FROM python:3.10.11-slim-buster

ENV PYTHONUNBUFFERED 1

RUN apt update && \
    apt install -y \
    gnupg \
    unixodbc \
    unixodbc-dev \
    gcc \
    g++ \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt update && \
    ACCEPT_EULA=Y apt install -y msodbcsql17

RUN pip install --no-cache-dir pipenv

COPY ../Pipfile ../Pipfile.lock ./

RUN pipenv install --system

COPY /backend/SignMonitoring /backend/SignMonitoring

WORKDIR /backend/SignMonitoring
