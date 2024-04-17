#  Copyright 2024 TopBids
# 
# This file is part of TopBids.
# 
# TopBids is free software: you can redistribute it and/or modify it
# under the terms of the GNU Affero General Public License as published by the Free
# Software Foundation, either version 3 of the License, or (at your option) any
# later version.
# 
# TopBids is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
# General Public License for more details.
# 
# You should have received a copy of the GNU Affero
# General Public License along with TopBids. If not, see
# <https://www.gnu.org/licenses/>.

from pathlib import Path
import os
from dotenv import load_dotenv

BASE_DIR=Path(__file__).resolve().parent.parent

if not load_dotenv():
    print('No .env file found')

SECRET_KEY=os.getenv('SECRET_KEY', 'django-insecure-ds45545gpp39)+kydou*#=fhp!3^y+06p)8d%@mn4@x0u(!(ih')

DEBUG=os.getenv('DEBUG', 'True') == 'True'

ALLOWED_HOSTS=['localhost', '127.0.0.1']

INSTALLED_APPS=[
    'logic.apps.LogicConfig',
    'django_extensions',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE=[
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF='logic.urls'

TEMPLATES=[
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

DATABASES={
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': os.getenv('DATABASE_PORT'),
    }
}

EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend'
EMAIL_PORT=587
EMAIL_USE_TLS='True'
EMAIL_HOST_USER=os.getenv('EMAIL_USER')
EMAIL_HOST_PASSWORD=os.getenv('EMAIL_PASSWORD')
EMAIL_HOST=os.getenv('EMAIL_HOST')

PASSWORD_RESET_TIMEOUT_DAYS=1

AUTH_USER_MODEL='logic.User'

AUTHENTICATION_BACKENDS=[
    'django.contrib.auth.backends.ModelBackend'
]

AUTH_PASSWORD_VALIDATORS=[
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 10,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

PASSWORD_HASHERS=["django.contrib.auth.hashers.PBKDF2PasswordHasher"]

LANGUAGE_CODE='en-us'

TIME_ZONE='UTC'

USE_I18N=True

USE_TZ=True

STATIC_URL='static/'

STATICFILES_DIRS=[
    os.path.join(BASE_DIR, 'static'),
]

DEFAULT_AUTO_FIELD='django.db.models.BigAutoField'

WSGI_APPLICATION='app.wsgi.application'

