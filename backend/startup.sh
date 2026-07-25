#!/bin/bash
# Azure App Service (Linux) startup script for Django backend.
# Azure deploys the 'backend/' subdirectory as the app root
# (see GitHub Actions workflow: path: backend/).
# Gunicorn must target core.wsgi:application from within that directory.

cd /home/site/wwwroot

# Collect static files so Whitenoise can serve admin CSS/JS
python manage.py collectstatic --noinput --clear

# Apply any outstanding database migrations
python manage.py migrate --noinput

# Start Gunicorn on the port Azure injects via $PORT (default 8000)
gunicorn \
    --bind=0.0.0.0:${PORT:-8000} \
    --timeout 120 \
    --workers 2 \
    --threads 4 \
    --worker-class gthread \
    --access-logfile '-' \
    --error-logfile '-' \
    core.wsgi:application
