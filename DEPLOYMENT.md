# MobiPlan cPanel Deployment Guide

This guide covers deploying MobiPlan (Django + Next.js) to cPanel using Git.

## Prerequisites

- cPanel hosting with:
  - Python App support (Python 3.10+)
  - Node.js App support (Node.js 18+)
  - Git Version Control (built into cPanel)
- GitHub repository
- Domain configured in cPanel

## Architecture

```
yourdomain.com          → Next.js Frontend (Port 3000)
api.yourdomain.com      → Django Backend (Passenger WSGI)
```

---

## Step 1: Initial Server Setup

### 1.1 Clone repository via cPanel Git

1. Go to cPanel → **Git™ Version Control**
2. Click **Create**
3. Configure:
   - Clone URL: `https://github.com/yourusername/mobiplan.git`
   - Repository Path: `mobiplan`
   - Repository Name: `mobiplan`
4. Click **Create**

Alternatively, use cPanel Terminal:
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

## Step 4: Git-Based Deployment

### 4.1 Setup Git in cPanel

1. Go to cPanel → **Git™ Version Control**
2. Click **Create** to add a new repository
3. Configure:
   - Clone URL: `https://github.com/yourusername/mobiplan.git`
   - Repository Path: `mobiplan`
   - Repository Name: `mobiplan`
4. Click **Create**

### 4.2 Configure Git credentials (for private repos)

If your repository is private:

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens**
2. Generate a new token with `repo` scope
3. In cPanel Terminal or SSH:
```bash
git config --global credential.helper store
cd ~/mobiplan
git pull  # Enter your GitHub username and token when prompted
```

### 4.3 Deploy workflow

**From cPanel Git Version Control:**
1. Go to cPanel → **Git™ Version Control**
2. Find your repository and click **Manage**
3. Click **Pull or Deploy** → **Update from Remote**

**Or from cPanel Terminal:**
```bash
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

### 4.4 Optional: Setup .cpanel.yml for auto-deployment

Create `.cpanel.yml` in your repo root for automatic deployment on git pull:

```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/yourusername/mobiplan
    # Backend deployment
    - cd $DEPLOYPATH/backend
    - /home/yourusername/virtualenv/mobiplan/backend/3.10/bin/pip install -r requirements.txt
    - /home/yourusername/virtualenv/mobiplan/backend/3.10/bin/python manage.py migrate --noinput
    - /home/yourusername/virtualenv/mobiplan/backend/3.10/bin/python manage.py collectstatic --noinput
    - touch $DEPLOYPATH/backend/tmp/restart.txt
    # Frontend deployment
    - cd $DEPLOYPATH/frontend
    - source /home/yourusername/nodevenv/mobiplan/frontend/18/bin/activate && npm ci
    - source /home/yourusername/nodevenv/mobiplan/frontend/18/bin/activate && npm run build
```

### 4.5 Push and deploy

```bash
# On your local machine
git add .
git commit -m "Your changes"
git push origin main

# Then in cPanel, pull the changes to deploy
```

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

Deploy manually via cPanel Terminal:

```bash
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
- [ ] `.env` files not committed to git
