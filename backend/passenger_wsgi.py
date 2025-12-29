import sys
import os

# Add your project directory to Python path
cwd = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, cwd)

# Load environment variables from .env file
env_file = os.path.join(cwd, '.env')
if os.path.exists(env_file):
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key.strip(), value.strip())

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mobiplan.settings')

# Import Django's WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
