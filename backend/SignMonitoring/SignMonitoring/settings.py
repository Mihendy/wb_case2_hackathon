from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env()

SECRET_KEY = env("DJANGO_SECRET")

DEBUG = env("DJANGO_DEBUG")

ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS")

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'SignMonitoring.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'SignMonitoring.wsgi.application'

ATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_UNIFIED_NAME'),
        'USER': env('DB_UNIFIED_USER'),
        'PASSWORD': env('DB_UNIFIED_PASSWORD'),
        'HOST': env('DB_UNIFIED_HOST'),
        'PORT': env('DB_UNIFIED_PORT'),
    },
    'gibdd': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_GIBDD_NAME'),
        'USER': env('DB_GIBDD_USER'),
        'PASSWORD': env('DB_GIBDD_PASSWORD'),
        'HOST': env('DB_GIBDD_HOST'),
        'PORT': env('DB_GIBDD_PORT'),
    },
    'commerce': {
        'ENGINE': 'sql_server.pyodbc',
        'NAME': env('DB_COMMERCE_NAME'),
        'USER': env('DB_COMMERCE_USER'),
        'PASSWORD': env('DB_COMMERCE_PASSWORD'),
        'HOST': env('DB_COMMERCE_HOST'),
        'PORT': env('DB_COMMERCE_PORT'),
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',
        },
    },
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True



STATIC_URL = 'static/'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
