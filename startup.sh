#!/bin/bash

# Azure App Service startup script

echo "Starting Trainee API deployment..."

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Run migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Start Gunicorn
echo "Starting Gunicorn server..."
gunicorn --bind=0.0.0.0:${PORT:-8000} --config gunicorn_config.py Trainee.wsgi
