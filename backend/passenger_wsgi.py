import os
import sys
from pathlib import Path

# Add the app directory to Python path
app_path = Path(__file__).resolve().parent
sys.path.insert(0, str(app_path))

# Load environment variables from .env file
env_file = app_path / '.env'
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key.strip(), value.strip())

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mobiplan.settings')

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
