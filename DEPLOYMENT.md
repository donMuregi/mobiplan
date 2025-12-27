# MobiPlan cPanel Deployment Guide

This guide covers deploying MobiPlan (Django + Next.js) to cPanel with GitHub CI/CD.

## Prerequisites

- cPanel hosting with:
  - Python App support (Python 3.10+)
  - Node.js App support (Node.js 18+)
  - SSH access enabled
  - Git access
- GitHub repository
- Domain configured in cPanel

## Architecture

```
yourdomain.com          → Next.js Frontend (Port 3000)
api.yourdomain.com      → Django Backend (Passenger WSGI)
```

---

## Step 1: Initial Server Setup

### 1.1 SSH into your cPanel server

```bash
ssh yourusername@yourdomain.com
```

### 1.2 Clone the repository

```bash
cd ~
git clone https://github.com/yourusername/mobiplan.git
cd mobiplan
```

---

## Step 2: Backend Setup (Django)

### 2.1 Create Python App in cPanel

1. Go to cPanel → **Setup Python App**
2. Click **Create Application**
3. Configure:
   - Python version: `3.10` or higher
   - Application root: `mobiplan/backend`
   - Application URL: `api.yourdomain.com` (or subdomain)
   - Application startup file: `passenger_wsgi.py`
   - Application Entry point: `application`
4. Click **Create**

### 2.2 Install dependencies

```bash
# cPanel creates a virtual environment, activate it
source ~/virtualenv/mobiplan/backend/3.10/bin/activate

cd ~/mobiplan/backend
pip install -r requirements.txt
```

### 2.3 Configure environment variables

```bash
cd ~/mobiplan/backend
cp .env.example .env
nano .env  # Edit with your production values
```

**Important `.env` values:**
```env
DJANGO_SECRET_KEY=your-unique-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=api.yourdomain.com,yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 2.4 Run migrations and collect static files

```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser  # Create admin user
```

### 2.5 Upload Google Sheets credentials

Upload your `google-sheets-credentials.json` to:
```
~/mobiplan/backend/credentials/google-sheets-credentials.json
```

### 2.6 Create tmp directory for Passenger

```bash
mkdir -p ~/mobiplan/backend/tmp
touch ~/mobiplan/backend/tmp/restart.txt
```

### 2.7 Restart the app

In cPanel Python App, click **Restart** or:
```bash
touch ~/mobiplan/backend/tmp/restart.txt
```

---

## Step 3: Frontend Setup (Next.js)

### 3.1 Create Node.js App in cPanel

1. Go to cPanel → **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - Node.js version: `18` or higher
   - Application mode: `Production`
   - Application root: `mobiplan/frontend`
   - Application URL: `yourdomain.com`
   - Application startup file: `server.js` (we'll create this)
4. Click **Create**

### 3.2 Create production environment file

```bash
cd ~/mobiplan/frontend
echo "NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1" > .env.production
```

### 3.3 Install dependencies and build

```bash
# Use the Node.js version from cPanel
source ~/nodevenv/mobiplan/frontend/18/bin/activate

npm ci
npm run build
```

### 3.4 Create server.js for cPanel

```bash
cat > server.js << 'EOF'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
EOF
```

### 3.5 Restart the app

In cPanel Node.js App, click **Restart**.

---

## Step 4: GitHub CI/CD Setup

### 4.1 Generate SSH key for deployment

On your local machine:
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/mobiplan_deploy
```

### 4.2 Add public key to cPanel

1. SSH into cPanel server
2. Add the public key to `~/.ssh/authorized_keys`:
```bash
cat >> ~/.ssh/authorized_keys << 'EOF'
YOUR_PUBLIC_KEY_HERE
EOF
```

### 4.3 Add secrets to GitHub

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:
| Secret Name | Value |
|-------------|-------|
| `CPANEL_HOST` | Your cPanel server hostname (e.g., `server123.web-hosting.com`) |
| `CPANEL_USERNAME` | Your cPanel username |
| `SSH_PRIVATE_KEY` | Contents of `~/.ssh/mobiplan_deploy` (private key) |
| `SSH_PORT` | `22` (or your custom SSH port) |

### 4.4 Push to trigger deployment

```bash
git add .
git commit -m "Setup CI/CD deployment"
git push origin main
```

The GitHub Action will automatically deploy when you push to `main`.

---

## Step 5: Domain Configuration

### 5.1 Backend subdomain

1. Go to cPanel → **Subdomains**
2. Create `api.yourdomain.com`
3. Point it to: `public_html/api` or configure with Python App

### 5.2 SSL Certificates

1. Go to cPanel → **SSL/TLS** → **Let's Encrypt**
2. Issue certificates for:
   - `yourdomain.com`
   - `www.yourdomain.com`
   - `api.yourdomain.com`

---

## Troubleshooting

### Backend not working

1. Check logs:
```bash
cat ~/mobiplan/backend/logs/error.log
```

2. Test Python app:
```bash
cd ~/mobiplan/backend
source ~/virtualenv/mobiplan/backend/3.10/bin/activate
python manage.py check
```

3. Restart:
```bash
touch ~/mobiplan/backend/tmp/restart.txt
```

### Frontend not loading

1. Check Node.js logs in cPanel
2. Ensure build completed:
```bash
cd ~/mobiplan/frontend
npm run build
```

3. Check `.env.production` has correct API URL

### Database issues

For production, consider migrating from SQLite to MySQL/PostgreSQL:

```python
# In settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

---

## Manual Deployment

If CI/CD fails, deploy manually:

```bash
# SSH into server
ssh yourusername@yourdomain.com

# Pull latest changes
cd ~/mobiplan
git pull origin main

# Deploy backend
cd backend
chmod +x deploy.sh
./deploy.sh

# Deploy frontend
cd ../frontend
chmod +x deploy.sh
./deploy.sh
```

---

## Security Checklist

- [ ] `DJANGO_DEBUG=False` in production
- [ ] Strong `DJANGO_SECRET_KEY`
- [ ] SSL certificates installed
- [ ] CORS properly configured
- [ ] Database credentials secured
- [ ] Google Sheets credentials not in git
- [ ] SSH key with limited permissions
