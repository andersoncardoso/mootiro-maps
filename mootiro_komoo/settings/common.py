# -*- coding: utf-8 -*-
import os
import sys
import djcelery

djcelery.setup_loader()

# ========== Path config ======================================================
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_ROOT = os.path.dirname(PROJECT_ROOT)
APPS_ROOT = os.path.join(PROJECT_ROOT, 'apps')
LIB_ROOT = os.path.join(PROJECT_ROOT, 'lib')

# add to python path
sys.path.append(PROJECT_ROOT)
sys.path.append(APPS_ROOT)
sys.path.append(LIB_ROOT)


# ========== admin, managers and site =========================================
ADMINS = (('it3sdev', 'it3sdev@gmail.com'),)
MANAGERS = ADMINS

# ========== Localization =====================================================
USE_I18N = True
USE_L10N = True
LOCALE_PATHS = (
    os.path.join(PROJECT_ROOT, 'locale'),
)
TIME_ZONE = 'America/Sao_Paulo'

# ========== Static and Media =================================================
MEDIA_ROOT = os.path.join(PROJECT_ROOT, 'media')
MEDIA_URL = '/media/'

STATIC_ROOT = os.path.join(PROJECT_ROOT, 'public')
STATIC_URL = '/static/'
STATICFILES_DIRS = (os.path.join(PROJECT_ROOT, 'static'),)


STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)


# ========== Middlewares, processors and loaders ==============================
MIDDLEWARE_CLASSES = [
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'authentication.utils.AuthenticationMiddleware',
    'django.middleware.transaction.TransactionMiddleware',
]

CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
)


TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)
TEMPLATE_DIRS = (os.path.join(PROJECT_ROOT, 'templates'), )
TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.request",
    "main.context_processors.komoo_namespace",
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)


# ========== Application ======================================================

ROOT_URLCONF = 'mootiro_komoo.urls'

INSTALLED_APPS = [
    # django apps
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'django.contrib.gis',
    'django.contrib.markup',
    'django.contrib.humanize',

    # lib and 3rd party apps
    'django_js_utils',
    'fileupload',
    'gunicorn',
    'djcelery',

    # our apps
    'main',
    'komoo_map',
    'regions',
    'issues',
    'proposals',
    'discussions',
    'resources',
    'authentication',
    'organizations',
    'investments',
    'moderation',
    'hotsite',
    'signatures',
    'projects',
    'tags',
    'locker',
]

FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024

# ========== Komoo ============================================================
KOMOO_DISABLE_MAP = False
DELETE_HOURS = 24

# ========== Mailgun ==========================================================
MAILGUN_API_URL = 'https://api.mailgun.net/v2/it3s.mailgun.org/messages'
MAILGUN_API_KEY = 'override me on local_settings'

# ========== Datalog ==========================================================
DATALOG_SERVER = "http://localhost:8008/"
