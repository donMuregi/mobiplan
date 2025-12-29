import sys
import os
import logging

# Setup logging to file
log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'passenger_debug.log')
logging.basicConfig(
    filename=log_file,
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("="*50)
logger.info("Passenger WSGI starting...")
logger.info(f"Current executable: {sys.executable}")
logger.info(f"Current working directory: {os.getcwd()}")
logger.info(f"Script location: {os.path.dirname(os.path.abspath(__file__))}")

# Path to your virtual environment's Python interpreter
INTERP = "/home/mobiplan/virtualenv/repositories/mobiplan/backend/3.13/bin/python3"
logger.info(f"Expected interpreter: {INTERP}")

if sys.executable != INTERP:
    logger.info(f"Switching interpreter from {sys.executable} to {INTERP}")
    try:
        os.execl(INTERP, INTERP, *sys.argv)
    except Exception as e:
        logger.error(f"Failed to switch interpreter: {e}")

# Add your project directory to Python path
cwd = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, cwd)
logger.info(f"Added to path: {cwd}")
logger.info(f"sys.path: {sys.path}")

# Load environment variables from .env file
env_file = os.path.join(cwd, '.env')
logger.info(f"Looking for .env at: {env_file}")
if os.path.exists(env_file):
    logger.info(".env file found, loading...")
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key.strip(), value.strip())
                logger.info(f"Set env var: {key.strip()}")
else:
    logger.warning(".env file NOT found!")

# Set Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'mobiplan.settings'
logger.info(f"DJANGO_SETTINGS_MODULE = {os.environ.get('DJANGO_SETTINGS_MODULE')}")

# Import Django's WSGI application
try:
    logger.info("Importing Django WSGI application...")
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    logger.info("Django WSGI application loaded successfully!")
except Exception as e:
    logger.error(f"Failed to load Django application: {e}")
    import traceback
    logger.error(traceback.format_exc())
    raise

logger.info("Passenger WSGI initialization complete")
logger.info("="*50)
