FROM postgres:14

# Копируем файл init.sql в контейнер, если нужно
# COPY ./gibdd_db_init/init.sql /docker-entrypoint-initdb.d/

# Запуск по умолчанию для PostgreSQL, через стандартный entrypoint
CMD ["docker-entrypoint.sh", "postgres"]
