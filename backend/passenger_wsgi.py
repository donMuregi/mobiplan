#!/usr/bin/env python
"""
WSGI config for cPanel Passenger deployment.
This file is used by cPanel's Passenger to run the Django application.
"""
import os
import sys

# Add the project directory to the path
project_home = os.path.dirname(os.path.abspath(__file__))
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Add the parent directory (for imports)
parent_dir = os.path.dirname(project_home)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Load environment variables from .env file
env_file = os.path.join(project_home, '.env')
if os.path.exists(env_file):
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key.strip(), value.strip())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mobiplan.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
