"""
Django settings for cradmin demo project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""
from __future__ import unicode_literals

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(
                os.path.dirname(__file__)))))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'y%j0x%=7a^sf53m*s^5nbmfe0_t13d*oibfx#m#*wz1x+k6+m1'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Required by django cradmin
    'django_cradmin',
    'django_cradmin.apps.cradmin_imagearchive',
    'django_cradmin.apps.cradmin_temporaryfileuploadstore',
    'django_cradmin.apps.cradmin_generic_token_with_metadata',
    'django_cradmin.apps.cradmin_authenticate',
    'django_cradmin.apps.cradmin_resetpassword',
    'django_cradmin.apps.cradmin_activate_account',
    'django_cradmin.apps.cradmin_register_account',
    'django_cradmin.apps.cradmin_invite',
    'django_cradmin.apps.cradmin_email',
    'crispy_forms',
    'sorl.thumbnail',  # Required by cradmin_imagearchive

    # Nice for debugging, but not required to use django_cradmin
    'django_extensions',

    # The advanced demo
    'django_cradmin.demo.webdemo',
    'django_cradmin.demo.login_not_required_demo',

    # The demo based on the Django tutorial
    'django_cradmin.demo.polls_demo',

    # Demo for usermanager
    'django_cradmin.demo.usermanagerdemo',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    "django.contrib.messages.context_processors.messages",
    "django.core.context_processors.request",
    "django_cradmin.context_processors.cradmin",
)

ROOT_URLCONF = 'django_cradmin.demo.project.demo.urls'

# WSGI_APPLICATION = 'django_cradmin.demo.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'

# Django crispy forms:
CRISPY_TEMPLATE_PACK = 'bootstrap3'

# Thumbnails (sorl-thumbnail)
# See: http://sorl-thumbnail.readthedocs.org/en/latest/reference/settings.html
THUMBNAIL_ENGINE = 'sorl.thumbnail.engines.pil_engine.Engine'
THUMBNAIL_KVSTORE = 'sorl.thumbnail.kvstores.cached_db_kvstore.KVStore'
THUMBNAIL_PREFIX = 'sorlcache/'
THUMBNAIL_DEBUG = False

# The root for file fileuploads
MEDIA_ROOT = os.path.join(BASE_DIR, 'django_media_root')
STATIC_ROOT = os.path.join(BASE_DIR, 'django_static_root')

MEDIA_URL = '/media/'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'verbose': {
            'format': '[%(levelname)s %(asctime)s %(name)s %(pathname)s:%(lineno)s] %(message)s'
        }
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'stderr': {
            'level': 'DEBUG',
            'formatter': 'verbose',
            'class': 'logging.StreamHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['stderr'],
            'level': 'DEBUG',
            'propagate': False
        },
        'django.db': {
            'handlers': ['stderr'],
            'level': 'INFO',  # Do not set to debug - logs all queries
            'propagate': False
        },
        '': {
            'handlers': ['stderr'],
            'level': 'DEBUG',
            'propagate': False
        }
    }
}

LOGIN_REDIRECT_URL = '/'
LOGIN_URL = '/authenticate/login'
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

DJANGO_CRADMIN_SITENAME = 'Cradmin demo'
DJANGO_CRADMIN_RESETPASSWORD_FINISHED_REDIRECT_URL = LOGIN_REDIRECT_URL
DJANGO_CRADMIN_FORGOTPASSWORD_URL = '/resetpassword/begin'

DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS = \
    'django_cradmin.apps.cradmin_register_account.forms.auth_user.AuthUserCreateAccountAutoUsernameForm'
# DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS = \
#     'django_cradmin.apps.cradmin_register_account.forms.auth_user.AuthUserCreateAccountForm'


DJANGO_CRADMIN_USE_EMAIL_AUTH_BACKEND = True

AUTHENTICATION_BACKENDS = (
    'django_cradmin.apps.cradmin_authenticate.backends.EmailAuthBackend',
)
TIME_INPUT_FORMATS = [
    '%H:%M',        # '14:30'
    '%H:%M:%S',     # '14:30:59'
]

# DJANGO_CRADMIN_THEME_PATH = 'django_cradmin/dist/css/cradmin_theme_topmenu/theme.css'
DJANGO_CRADMIN_MENU_SCROLL_TOP_FIXED = True
# DJANGO_CRADMIN_MOMENTJS_LOCALE = 'nb'


# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'
# LANGUAGE_CODE = 'nb'

TIME_ZONE = 'Europe/Oslo'

USE_I18N = True

USE_L10N = True

USE_TZ = True


DJANGO_CRADMIN_IMAGEUTILS_IMAGETYPE_MAP = {
    'cradmin-archiveimage-listing': {
        'width': 170,
        'height': 100,
        'crop': 'lfill',
        'quality': 70,
    },
    'cradmin-archiveimage-preview': {
        'width': 330,
        'height': 400,
        'crop': 'limit',
        'quality': 70,
    },
}

DJANGO_CRADMIN_IMAGEARCHIVE_LISTING_IMAGETYPE = 'cradmin-archiveimage-listing'
DJANGO_CRADMIN_IMAGEARCHIVE_LISTING_IMAGEWIDTH = 170
DJANGO_CRADMIN_IMAGEARCHIVE_PREVIEW_IMAGETYPE = 'cradmin-archiveimage-preview'
# DJANGO_CRADMIN_IMAGEARCHIVE_MAX_FILESIZE = '100KB'
