FROM mcr.microsoft.com/mssql/server:2019-latest

USER root

RUN apt-get update && \
    apt-get install -y gnupg curl apt-transport-https && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/9/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y mssql-tools unixodbc-dev

USER mssql

ENV PATH="/opt/mssql-tools/bin:${PATH}"

WORKDIR /var/opt/mssql

COPY ../commerce_db_init/init.sql /docker-entrypoint-initdb.d/

CMD /opt/mssql/bin/sqlservr
