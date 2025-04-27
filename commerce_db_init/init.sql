-- Проверка на существование базы данных
IF NOT EXISTS (SELECT name
               FROM sys.databases
               WHERE name = N'commerce_db_name')
    BEGIN
        -- Создание базы данных, если она не существует
        CREATE DATABASE commerce_db_name;
    END
GO

-- Использование созданной базы данных
USE commerce_db_name;
GO

-- Проверка на существование таблицы
IF NOT EXISTS (SELECT *
               FROM information_schema.tables
               WHERE table_name = 'sample_table')
    BEGIN
        -- Создание таблицы, если она не существует
        CREATE TABLE sample_table
        (
            id          INT IDENTITY (256,1) PRIMARY KEY,
            name        varchar(max) NOT NULL,
            geo         varchar(max) NOT NULL,
            description varchar(max),
            internal_id varchar(max) NOT NULL
        );
    END
GO

-- Вставка данных (данные вставляются только если они ещё не существуют)
INSERT INTO sample_table (name, geo, description, internal_id)
SELECT name, geo, description, internal_id
FROM (VALUES
            ('A, Location', '-37.458924,122.134789', NULL, 'IIDBB0010011'),
            ('A, Location', '-37.458924,122.13479', NULL, 'IIDBB0010012'),
            ('B, Location', '40.712836,-74.006015', NULL, 'IIDBB001002'),
            ('B, Location', '40.712837,-74.006015', NULL, 'IIDBB0010032'),
            ('C, Location', '51.508323,-0.1259987', NULL, 'IIDBB001003'),
            ('A, Location', '-33.868821,151.209295', NULL, 'IIDBB001004'),
            ('C, Location', '48.856789,2.2943432', NULL, 'IIDBB001005'),
            ('B, Location', '35.689456,139.691701', NULL, 'IIDBB001006'),
            ('C, Location', '55.755843,37.617310', NULL, 'IIDBB001007'),
            ('B, Location', '-12.074123,-77.046058', NULL, 'IIDBB001008'),
            ('B, Location', '41.891432,12.543789', NULL, 'IIDBB001009'),
            ('B, Location', '41.891450,12.547389', NULL, 'IIDBB001010'),
            ('A, Location', '25.283145,55.270459', NULL, 'IIDBB001011')
) AS NewData(name, geo, description, internal_id)
WHERE NOT EXISTS (SELECT 1 FROM sample_table WHERE sample_table.internal_id = NewData.internal_id);
GO
