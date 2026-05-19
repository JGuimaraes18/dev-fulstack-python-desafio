#!/bin/sh

set -e

echo "Applying migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Creating superuser (if not exists)..."

python manage.py shell << EOF
import os
from django.contrib.auth import get_user_model

User = get_user_model()

email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if email and password:
    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(
            email=email,
            password=password
        )
        print("Superuser created")
    else:
        print("Superuser already exists")
else:
    print("Superuser env not set, skipping")
EOF

echo "Starting Gunicorn..."
gunicorn core.wsgi:application --bind 0.0.0.0:8000