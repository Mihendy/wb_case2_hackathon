from decimal import ROUND_HALF_UP, Decimal

import pandas as pd
from django.conf import settings
from django.db.models.query import QuerySet
from geopy.distance import geodesic
from signs.models import CommerceSign, GibddSign, UnitedSign
from sqlalchemy import create_engine


def is_valid_geo(geo_str):
    try:
        lat, lon = geo_str.split(',')
        Decimal(lat)
        Decimal(lon)
        return True
    except Exception:
        return False


def normalize_commerce_name(name: str) -> str:
    parts = name.split(',', 1)
    if len(parts) == 2:
        letter = parts[0].strip()
        rest = parts[1].strip()
        return f"{rest} {letter}"
    return name.strip()


def normalize_gibdd_name(name: str) -> str:
    parts = name.split(' ', 1)
    if len(parts) == 2:
        rest = parts[0].strip()
        letter = parts[1].strip()
        return f"{rest} {letter}"
    return name.strip()


def remove_duplicates(df, name_col='name', lat_col='latitude', lon_col='longitude', max_distance_meters=5.0):
    to_remove = []
    for i, row1 in df.iterrows():
        if i in to_remove:
            continue
        for j, row2 in df.iterrows():
            if i < j and row1[name_col] == row2[name_col]:
                dist = geodesic((row1[lat_col], row1[lon_col]), (row2[lat_col], row2[lon_col])).meters
                if dist < max_distance_meters:
                    to_remove.append(j)
    return df.drop(to_remove)


def format_commerce_signs(commerce_qs: QuerySet):
    commerce_df = pd.DataFrame.from_records(commerce_qs.values('internal_id', 'name', 'geo', 'description'))

    commerce_df = commerce_df.dropna(subset=['name', 'internal_id', 'geo'])
    commerce_df = commerce_df[(commerce_df['name'].str.strip() != '') & (commerce_df['internal_id'].str.strip() != '')]

    # нормализация названий (к виду "Location A")
    commerce_df['name'] = commerce_df['name'].apply(normalize_commerce_name)

    # разделение координат на широту и долготу
    commerce_df = commerce_df[commerce_df['geo'].apply(is_valid_geo)]
    geo_split = commerce_df['geo'].str.split(',', n=1, expand=True)
    commerce_df['latitude'] = geo_split[0].apply(Decimal)
    commerce_df['longitude'] = geo_split[1].apply(Decimal)
    commerce_df['latitude'] = commerce_df['latitude'].apply(
        lambda x: x.quantize(Decimal('0.000001'), rounding=ROUND_HALF_UP))
    commerce_df['longitude'] = commerce_df['longitude'].apply(
        lambda x: x.quantize(Decimal('0.000001'), rounding=ROUND_HALF_UP))
    commerce_df = commerce_df.drop(columns=['geo'])

    # валидация координат
    commerce_df = commerce_df[
        (commerce_df['latitude'] >= Decimal('-90')) & (commerce_df['latitude'] <= Decimal('90'))
        & (commerce_df['longitude'] >= Decimal('-180')) & (commerce_df['longitude'] <= Decimal('180'))]

    # удаление дубликатов
    commerce_df = remove_duplicates(commerce_df, 'name', 'latitude', 'longitude')

    return commerce_df


def format_gibdd_signs(gibdd_qs: QuerySet):
    gibdd_df = pd.DataFrame.from_records(gibdd_qs.values('unical_id', 'name', 'latitude', 'longitude', 'description'))

    gibdd_df = gibdd_df.dropna(subset=['unical_id', 'name', 'latitude', 'longitude'])
    gibdd_df = gibdd_df[(gibdd_df['name'].str.strip() != '')]

    # нормализация названий (к виду "Location A")
    gibdd_df['name'] = gibdd_df['name'].apply(normalize_gibdd_name)

    # нормализация широты и долготы
    gibdd_df['latitude'] = gibdd_df['latitude'].apply(Decimal) / 1_000_000
    gibdd_df['longitude'] = gibdd_df['longitude'].apply(Decimal) / 1_000_000

    # валидация координат
    gibdd_df = gibdd_df[
        (gibdd_df['latitude'] >= Decimal('-90')) & (gibdd_df['latitude'] <= Decimal('90'))
        & (gibdd_df['longitude'] >= Decimal('-180')) & (gibdd_df['longitude'] <= Decimal('180'))]

    # удаление дубликатов
    gibdd_df = remove_duplicates(gibdd_df, 'name', 'latitude', 'longitude')

    return gibdd_df


def merge_by_name_and_coords_with_flags(commerce_df, gibdd_df, max_distance_meters=5.0):
    """Функция для объединения DataFrame с учетом совпадений по имени и координатам с использованием флагов для отслеживания совпадений."""
    # добавление флагов
    commerce_df['matched'] = False
    gibdd_df['matched'] = False

    merged_data = []

    # сортировка gibdd_df по имени для оптимизации поиска
    gibdd_dict = {}
    for _, row2 in gibdd_df.iterrows():
        if row2['name'] not in gibdd_dict:
            gibdd_dict[row2['name']] = []
        gibdd_dict[row2['name']].append(row2)

    for _, row1 in commerce_df.iterrows():
        matched = False
        if row1['name'] in gibdd_dict:
            for row2 in gibdd_dict[row1['name']]:
                # Рассчитываем расстояние между точками
                dist = geodesic((row1['latitude'], row1['longitude']), (row2['latitude'], row2['longitude'])).meters
                if dist < max_distance_meters:  # Если точка достаточно близка
                    merged_data.append({
                        'internal_id': row1['internal_id'],
                        'unical_id': row2['unical_id'],
                        'name': row1['name'],
                        'latitude': row1['latitude'],
                        'longitude': row1['longitude'],
                        'commerce_description': row1['description'],
                        'gibdd_description': row2['description']
                    })
                    commerce_df.at[_, 'matched'] = True
                    gibdd_df.at[gibdd_df[gibdd_df['unical_id'] == row2['unical_id']].index[0], 'matched'] = True
                    matched = True
                    break

        if not matched:
            merged_data.append({
                'internal_id': row1['internal_id'],
                'unical_id': None,
                'name': row1['name'],
                'latitude': row1['latitude'],
                'longitude': row1['longitude'],
                'commerce_description': row1['description'],
                'gibdd_description': None
            })

    for _, row2 in gibdd_df.iterrows():
        if not row2['matched']:
            merged_data.append({
                'internal_id': None,
                'unical_id': row2['unical_id'],
                'name': row2['name'],
                'latitude': row2['latitude'],
                'longitude': row2['longitude'],
                'commerce_description': None,
                'gibdd_description': row2['description']
            })

    return pd.DataFrame(merged_data)


def format_signs(commerce_qs: QuerySet, gibdd_qs: QuerySet):
    """
    Функция для форматирования данных о знаках.
    :param commerce_qs:
    :param gibdd_qs:
    :return:
    """

    # знаки коммерции

    pd.set_option('display.max_columns', None)

    commerce_df = format_commerce_signs(commerce_qs)
    gibdd_df = format_gibdd_signs(gibdd_qs)

    # объединение данных
    merged_df = merge_by_name_and_coords_with_flags(commerce_df, gibdd_df)

    DATABASES = settings.DATABASES['default']
    connection_string = f"postgresql://{DATABASES['USER']}:{DATABASES['PASSWORD']}@{DATABASES['HOST']}:{DATABASES['PORT']}/{DATABASES['NAME']}"
    table_name = UnitedSign._meta.db_table
    engine = create_engine(connection_string)
    merged_df.rename(columns={'internal_id': 'commerce_internal_id'}, inplace=True)
    merged_df.rename(columns={'unical_id': 'gibdd_unical_id'}, inplace=True)

    merged_df.to_sql(table_name, engine, if_exists='append', index=False)

    return merged_df


def force_update_signs() -> tuple[bool, bool]:
    """
    Функция для обновления данных о знаках.
    :return: Кортеж из двух булевых значений:
        - создан ли новый знак (True/False)
        - обновлен ли существующий знак (True/False)
    """
    created = False
    updated = False

    format_united_signs = format_signs(CommerceSign.objects.using('commerce_db').all(),
                                       GibddSign.objects.using('gibdd_db').all())
    print(format_united_signs.head())

    # Получаем все знаки из базы данных
    united_signs_qs = UnitedSign.objects.all()
    old_united_signs = pd.DataFrame.from_records(
        united_signs_qs.values('gibdd_unical_id', 'commerce_internal_id', 'name', 'latitude', 'longitude',
                               'gibdd_description', 'commerce_description', 'source', 'status'))

    print(old_united_signs.head())

    return created, updated
