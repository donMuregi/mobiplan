#!/bin/bash
# cPanel Deployment Script for Django Backend
# Run this script on the cPanel server after git pull

set -e

echo "🚀 Starting backend deployment..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | xargs)
fi

# Run migrations
echo "🗄️ Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Restart the application (cPanel passenger)
echo "🔄 Restarting application..."
touch tmp/restart.txt

echo "✅ Backend deployment complete!"
