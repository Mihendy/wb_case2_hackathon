FROM python:3.10.11-slim-buster

ENV PYTHONUNBUFFERED 1

RUN apt update && \
    pip install --no-cache-dir pipenv

COPY ../Pipfile ../Pipfile.lock ./

RUN pipenv install --system

COPY /backend/SignMonitoring /backend/SignMonitoring

WORKDIR /backend/SignMonitoring
