"""
Django Settings for core project.
Production-ready configuration with environment variable support.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from decouple import config, Csv
import dj_database_url

load_dotenv()

# ---------------------------------------------------------------------------
# Python 3.14 Compatibility Patch (django.template.context.BaseContext.__copy__)
# Fixes: AttributeError: 'super' object has no attribute 'dicts' when copying
# Django contexts under Python 3.14.
# ---------------------------------------------------------------------------
import django.template.context

def _patched_base_context_copy(self):
    duplicate = self.__class__.__new__(self.__class__)
    duplicate.__dict__.update(self.__dict__)
    duplicate.dicts = self.dicts[:]
    return duplicate

django.template.context.BaseContext.__copy__ = _patched_base_context_copy

# ---------------------------------------------------------------------------
# Base Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# Explicitly load .env file from BASE_DIR
env_file_path = BASE_DIR / '.env'
if env_file_path.exists():
    load_dotenv(env_file_path, override=True)
else:
    load_dotenv()

# ---------------------------------------------------------------------------
# Security — Core
# ---------------------------------------------------------------------------
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')

# Strictly driven by .env — never defaults to True in any ambiguous case.
DEBUG = os.getenv('DEBUG') == 'True'

# Comma-separated list from .env — no wildcard '*' permitted in production.
# Default already includes the Azure App Service hostname so it works
# even if the env var hasn't been set on the Azure dashboard yet.
# Prod .env value:
#   ALLOWED_HOSTS=urbanixsolution.online,www.urbanixsolution.online,urbanix-brdpdta5acenanh5.centralindia-01.azurewebsites.net
ALLOWED_HOSTS = [h.strip() for h in os.getenv(
    'ALLOWED_HOSTS',
    'localhost,127.0.0.1,urbanix-brdpdta5acenanh5.centralindia-01.azurewebsites.net'
).split(',') if h.strip()] + [
    'urbanixsolution.online',
    'www.urbanixsolution.online',
]

# Ensure Django redirects /path to /path/ where needed (safe default).
APPEND_SLASH = True
# ---------------------------------------------------------------------------
# Application Definition
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    # Jazzmin — must come BEFORE django.contrib.admin
    'jazzmin',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    # Local Apps
    'portfolio',
    'leads',
    'api',
    'crm',          # Agency CRM & ERP
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

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

WSGI_APPLICATION = 'core.wsgi.application'

# ---------------------------------------------------------------------------
# Database — PostgreSQL (Supabase / Production) / dj-database-url
# ---------------------------------------------------------------------------
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# ---------------------------------------------------------------------------
# Password Validation
# ---------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ---------------------------------------------------------------------------
# Internationalization
# ---------------------------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# Static & Media Files
# ---------------------------------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Enable Whitenoise compression and caching
# Using CompressedStaticFilesStorage prevents 500 Internal Server Errors when
# static files or fonts are missing in production (unlike CompressedManifestStaticFilesStorage).
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------------------------
# ✅ CORS_ALLOW_ALL_ORIGINS is intentionally NOT set here.
# Only the explicit origin list from .env is trusted.
# Dev default allows localhost only.
# Prod .env example:
#   CORS_ALLOWED_ORIGINS=https://urbanixsolution.com,https://www.urbanixsolution.com
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000',
    cast=Csv()
) + [
    "https://urbanixsolution.online",
    "https://www.urbanixsolution.online",
]
CORS_ALLOW_CREDENTIALS = True

# CSRF trusted origins: must include every origin that POSTs to the API.
# Read from .env so the same var covers both CORS and CSRF in production.
CSRF_TRUSTED_ORIGINS = config(
    'CSRF_TRUSTED_ORIGINS',
    default='http://localhost:8000,http://127.0.0.1:8000,http://localhost:3000,http://127.0.0.1:3000',
    cast=Csv()
) + [
    "https://urbanixsolution.online",
    "https://www.urbanixsolution.online",
]

# ---------------------------------------------------------------------------
# Security Headers — active only in production (DEBUG=False)
# ---------------------------------------------------------------------------
# Prevent browsers from MIME-sniffing responses away from the declared content-type.
SECURE_CONTENT_TYPE_NOSNIFF = True

# Activate the browser's built-in XSS filter (legacy browsers).
SECURE_BROWSER_XSS_FILTER = True

# Instruct browsers to only send these cookies over HTTPS.
# Kept False locally (HTTP); flipped True in production via the env flag below.
CSRF_COOKIE_SECURE   = not DEBUG   # True when DEBUG=False (production)
SESSION_COOKIE_SECURE = not DEBUG  # True when DEBUG=False (production)

# Prevent the admin/site from being embedded in an <iframe> (clickjacking defence).
X_FRAME_OPTIONS = 'DENY'

# In production, tell browsers to always use HTTPS for 1 year (31536000 s).
# Only activate when your TLS certificate is confirmed working — a wrong value
# is very hard to undo.  Set SECURE_HSTS_SECONDS=31536000 in your prod .env.
SECURE_HSTS_SECONDS        = int(os.getenv('SECURE_HSTS_SECONDS', '0'))  # 0 = disabled
SECURE_HSTS_INCLUDE_SUBDOMAINS = os.getenv('SECURE_HSTS_INCLUDE_SUBDOMAINS', 'False') == 'True'
SECURE_HSTS_PRELOAD            = os.getenv('SECURE_HSTS_PRELOAD', 'False') == 'True'
SECURE_SSL_REDIRECT            = os.getenv('SECURE_SSL_REDIRECT', 'False') == 'True'

# ---------------------------------------------------------------------------
# Django REST Framework
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],

    # Global throttle classes — apply to ALL views as a baseline spam defence.
    # Individual views (contact/career forms, captcha) may declare tighter
    # per-view throttle classes on top of these globals.
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',   # unauthenticated requests
        'rest_framework.throttling.UserRateThrottle',   # authenticated requests
    ],
    'DEFAULT_THROTTLE_RATES': {
        # Global baselines — generous enough not to block normal browsing.
        'anon': '5/min',    # 5 requests/min for anonymous (public API) traffic
        'user': '50/min',   # 50 requests/min for authenticated users
        # Per-view overrides — tighter limits for sensitive form endpoints.
        'contact_submission': '3/hour',
        'career_submission':  '3/day',
        'captcha_generate':   '30/hour',
    },
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# ---------------------------------------------------------------------------
# Google reCAPTCHA Configuration
# ---------------------------------------------------------------------------
# Official Google reCAPTCHA v2 test secret key (always verifies successfully in dev)
RECAPTCHA_SECRET_KEY = config('RECAPTCHA_SECRET_KEY', default='6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe')

# ---------------------------------------------------------------------------
# Celery Configuration (Redis Broker — AI-Ready)
# ---------------------------------------------------------------------------
CELERY_BROKER_URL = config('REDIS_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('REDIS_URL', default='redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE
# Autodiscover tasks in all INSTALLED_APPS
CELERY_IMPORTS = ('portfolio.tasks', 'leads.tasks')


# ---------------------------------------------------------------------------
# Jazzmin — Premium Django Admin UI
# Docs: https://django-jazzmin.readthedocs.io/configuration/
# ---------------------------------------------------------------------------

JAZZMIN_SETTINGS = {
    # ── Branding ───────────────────────────────────────────────────────────────────────────
    'site_title':       'Urbanix Solution Admin',
    'site_header':      'Urbanix Solution',
    'site_brand':       'Urbanix Solution',
    'site_icon':        None,           # path to favicon inside STATIC_URL
    'site_logo':        None,           # path to top-left logo inside STATIC_URL
    'login_logo':       None,           # separate logo on login page
    'welcome_sign':     'Welcome to the Urbanix Solution Control Room',
    'copyright':        'Urbanix Solution',

    # ── Top navigation links ────────────────────────────────────────────────
    'topmenu_links': [
        # Home shortcut
        {'name': 'Home', 'url': 'admin:index', 'permissions': ['auth.view_user']},
        # Link to live frontend
        {'name': 'View Website ↗',  'url': 'http://localhost:3000', 'new_window': True},
        # Link to DRF browsable API
        {'name': 'API Explorer ↗', 'url': 'http://localhost:8000/api/', 'new_window': True},
        # App-level shortcuts
        {'app': 'api'},
    ],

    # ── User menu (top-right avatar dropdown) ───────────────────────────────
    'usermenu_links': [
        {'name': 'View Website', 'url': 'http://localhost:3000', 'new_window': True, 'icon': 'fas fa-globe'},
        {'model': 'auth.user'},
    ],

    # ── Left sidebar ────────────────────────────────────────────────────────
    'show_sidebar':            True,
    'navigation_expanded':     True,
    'hide_apps':               ['portfolio', 'leads'],  # crm is intentionally visible
    'hide_models':             [],

    # Custom sidebar ordering: our apps first, then auth
    'order_with_respect_to': [
        'api', 'crm', 'auth',
    ],

    # Custom icons for sidebar items (Font Awesome 5 free)
    'icons': {
        # Auth
        'auth':                         'fas fa-users-cog',
        'auth.user':                    'fas fa-user',
        'auth.Group':                   'fas fa-users',
        # API Models
        'api':                          'fas fa-layer-group',
        'api.service':                  'fas fa-cogs',
        'api.category':                 'fas fa-tags',
        'api.portfolioproject':         'fas fa-laptop-code',
        'api.contactlead':              'fas fa-address-card',
        'portfolio.category':           'fas fa-tags',
        'portfolio.project':            'fas fa-laptop-code',
        # Leads
        'leads':                        'fas fa-envelope-open-text',
        'leads.lead':                   'fas fa-paper-plane',
        # CRM & ERP
        'crm':                          'fas fa-chart-line',
        'crm.teammember':               'fas fa-user-tie',
        'crm.client':                   'fas fa-building',
        'crm.projecttask':              'fas fa-tasks',
        'crm.contactlead':              'fas fa-funnel-dollar',
        'crm.careerapplication':        'fas fa-file-alt',
    },
    'default_icon_parents':  'fas fa-folder',
    'default_icon_children': 'fas fa-circle',

    # ── UI behaviour ────────────────────────────────────────────────────────
    'related_modal_active':     True,   # open FK selects in a modal, not a new tab
    'use_google_fonts_cdn':     True,
    'show_ui_builder':          False,  # set True temporarily to tweak theme live
    'changeform_format':        'horizontal_tabs',  # or 'collapsible' / 'carousel'
    'changeform_format_overrides': {
        'auth.user':  'collapsible',
        'auth.group': 'vertical_tabs',
    },

    # ── Search bar ──────────────────────────────────────────────────────────
    'search_model': ['portfolio.project', 'portfolio.service', 'auth.user'],

    # ── Language / locale ───────────────────────────────────────────────────
    'language_chooser': False,
}


JAZZMIN_UI_TWEAKS = {
    # ── Colour theme ────────────────────────────────────────────────────────
    # Dark sidebar matching the Urbanix Solution brand palette
    'navbar_small_text':         False,
    'footer_small_text':         False,
    'body_small_text':           False,
    'brand_small_text':          False,

    # Navbar colour: dark navy matching #0b0f19
    'brand_colour':              'navbar-dark',
    'accent':                    'accent-primary',

    # Sidebar: dark navy
    'navbar':                    'navbar-dark',
    'no_navbar_border':          True,
    'navbar_fixed':              True,        # sticky top navbar
    'layout_boxed':              False,
    'footer_fixed':              False,
    'sidebar_fixed':             True,        # sticky sidebar
    'sidebar':                   'sidebar-dark-primary',
    'sidebar_nav_small_text':    False,
    'sidebar_disable_expand':    False,
    'sidebar_nav_child_indent':  True,
    'sidebar_nav_compact_style': False,
    'sidebar_nav_legacy_style':  False,
    'sidebar_nav_flat_style':    False,

    # Theme
    'theme':                     'darkly',   # options: default, darkly, flatly, etc.
    'dark_mode_theme':           None,

    # Buttons & links
    'button_classes': {
        'primary':   'btn-primary',
        'secondary': 'btn-outline-secondary',
        'info':      'btn-outline-info',
        'warning':   'btn-warning',
        'danger':    'btn-danger',
        'success':   'btn-success',
    },
}

# ---------------------------------------------------------------------------
# Email Configuration (SMTP / Gmail App Password)
# ---------------------------------------------------------------------------
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', 'your_email@gmail.com')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', 'pnzg ewlo qbfe wfix')
DEFAULT_FROM_EMAIL = f"Urbanix Solution <{EMAIL_HOST_USER}>"
