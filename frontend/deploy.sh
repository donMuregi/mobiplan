#!/bin/bash
# cPanel Deployment Script for Next.js Frontend
# Run this script on the cPanel server after git pull

set -e

echo "🚀 Starting frontend deployment..."

# Navigate to frontend directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building Next.js application..."
npm run build

# For cPanel with Node.js selector, restart the app
echo "🔄 Restarting application..."
if [ -f "../tmp/restart.txt" ]; then
    touch ../tmp/restart.txt
fi

echo "✅ Frontend deployment complete!"
