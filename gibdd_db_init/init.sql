-- Проверка на существование базы данных
DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'gibdd_db_name') THEN
            -- Создание базы данных, если она не существует
            PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE gibdd_db_name');
        END IF;
    END
$$;
\c gibdd_db_name;

-- Проверка на существование таблицы
DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sample_table') THEN
            -- Создание таблицы, если она не существует
            CREATE TABLE sample_table
            (
                id          SERIAL PRIMARY KEY,           -- Автоинкрементируемый первичный ключ
                unical_id   INT          NOT NULL UNIQUE, -- Уникальный идентификатор
                name        VARCHAR(255) NOT NULL,        -- Имя (строка)
                latitude    BIGINT       NOT NULL,        -- Широта (число)
                longitude   BIGINT       NOT NULL,        -- Долгота (число)
                description TEXT                          -- Описание (текст)
            );
        END IF;
    END
$$;

-- Вставка 10 записей
INSERT INTO sample_table (unical_id, name, latitude, longitude, description)
VALUES (1001, 'Location A', 37458923, -122134789, 'A beautiful park in the city center.'),
       (1002, 'Location B', 40712836, -74006015, 'Historic landmark with great views.'),
       (1003, 'Location C', 51508423, -1259987, 'Iconic museum known for its art collection.'),
       (1004, 'Location A', -33868820, 151209295, 'Famous opera house by the harbor.'),
       (1005, 'Location C', 48856789, 22943432, 'Charming cafe with outdoor seating.'),
       (1006, 'Location B', 35689456, 139691701, 'Traditional market with local goods.'),
       (1007, 'Location C', 55755845, 37617300, 'Large shopping mall in the downtown area.'),
       (1008, 'Location B', -12074123, -77046098, 'Modern skyscraper with observation deck.'),
       (1009, 'Location B', 41891432, 12543789, 'Ancient ruins surrounded by nature.'),
       (1010, 'Location A', 25283945, 55270659, 'Beach resort perfect for relaxation.'),
       (1011, 'Location A', 25283947, 55270660, 'Beach resort perfect for relaxation.')
ON CONFLICT (unical_id) DO NOTHING; -- Записываются только уникальные записи по unical_id
