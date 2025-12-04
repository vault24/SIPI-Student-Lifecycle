# SLMS Complete Setup and Installation Guide

A comprehensive step-by-step guide for setting up and installing the SIPI Student Lifecycle Management System from scratch.

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Overview](#installation-overview)
3. [Step 1: Install PostgreSQL](#step-1-install-postgresql)
4. [Step 2: Install Python](#step-2-install-python)
5. [Step 3: Clone/Download Project](#step-3-clonedownload-project)
6. [Step 4: Backend Setup](#step-4-backend-setup)
7. [Step 5: Database Setup](#step-5-database-setup)
8. [Step 6: Frontend Setup](#step-6-frontend-setup)
9. [Step 7: Verification](#step-7-verification)
10. [Step 8: Running the Application](#step-8-running-the-application)
11. [Troubleshooting](#troubleshooting)
12. [Production Deployment](#production-deployment)

---

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: 4 GB minimum (8 GB recommended)
- **Disk Space**: 2 GB minimum
- **Internet Connection**: Required for downloading dependencies

### Software Requirements

- **Python**: 3.8 or higher
- **PostgreSQL**: 12 or higher
- **Node.js**: 14+ (optional, for frontend development)
- **Git**: 2.0+ (optional, for version control)

### Browser Requirements

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Installation Overview

### Total Installation Time: 30-45 minutes

1. **PostgreSQL Installation**: 5-10 minutes
2. **Python Setup**: 5 minutes
3. **Project Download**: 2 minutes
4. **Backend Setup**: 10 minutes
5. **Database Setup**: 5 minutes
6. **Frontend Setup**: 2 minutes
7. **Verification**: 5 minutes

### Installation Checklist

- [ ] PostgreSQL installed
- [ ] Python installed
- [ ] Project downloaded
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Database created
- [ ] Migrations applied
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Application accessible

---

## Step 1: Install PostgreSQL

### Windows Installation

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15 or higher
   - File size: ~150 MB

2. **Run Installer**
   - Double-click the downloaded `.exe` file
   - Click "Next" to proceed
   - Accept the license agreement
   - Choose installation directory (default is fine)
   - Click "Next"

3. **Configure Components**
   - Check all components:
     - PostgreSQL Server ✓
     - pgAdmin 4 ✓
     - Stack Builder ✓
     - Command Line Tools ✓
   - Click "Next"

4. **Set Data Directory**
   - Default: `C:\Program Files\PostgreSQL\15\data`
   - Click "Next"

5. **Set Password**
   - Enter password for `postgres` user
   - **Important**: Remember this password!
   - Example: `postgres123`
   - Click "Next"

6. **Configure Port**
   - Default port: 5432
   - Click "Next"

7. **Select Locale**
   - Default: English, United States
   - Click "Next"

8. **Review Summary**
   - Click "Next" to install

9. **Installation Complete**
   - Uncheck "Stack Builder" if you don't need it
   - Click "Finish"

10. **Verify Installation**
    - Open Command Prompt
    - Type: `psql --version`
    - Should show: `psql (PostgreSQL) 15.x`

### macOS Installation

1. **Using Homebrew (Recommended)**
   ```bash
   # Install Homebrew if not already installed
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install PostgreSQL
   brew install postgresql@15
   
   # Start PostgreSQL service
   brew services start postgresql@15
   
   # Verify installation
   psql --version
   ```

2. **Using PostgreSQL Installer**
   - Download from: https://www.postgresql.org/download/macosx/
   - Run the installer
   - Follow on-screen instructions
   - Remember the password for `postgres` user

### Linux Installation (Ubuntu/Debian)

1. **Update Package Manager**
   ```bash
   sudo apt-get update
   sudo apt-get upgrade
   ```

2. **Install PostgreSQL**
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   ```

3. **Start PostgreSQL Service**
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql  # Auto-start on boot
   ```

4. **Verify Installation**
   ```bash
   psql --version
   ```

### Verify PostgreSQL Installation

```bash
# Test connection
psql -U postgres

# Inside psql, type:
SELECT version();

# Exit
\q
```

---

## Step 2: Install Python

### Windows Installation

1. **Download Python**
   - Visit: https://www.python.org/downloads/
   - Download Python 3.10 or higher
   - File size: ~30 MB

2. **Run Installer**
   - Double-click the downloaded `.exe` file
   - **IMPORTANT**: Check "Add Python to PATH"
   - Click "Install Now"

3. **Verify Installation**
   - Open Command Prompt
   - Type: `python --version`
   - Should show: `Python 3.10.x` or higher

### macOS Installation

1. **Using Homebrew**
   ```bash
   brew install python@3.10
   ```

2. **Or Download from Python.org**
   - Visit: https://www.python.org/downloads/macosx/
   - Download the installer
   - Run and follow instructions

3. **Verify Installation**
   ```bash
   python3 --version
   ```

### Linux Installation (Ubuntu/Debian)

1. **Install Python**
   ```bash
   sudo apt-get install python3 python3-pip python3-venv
   ```

2. **Verify Installation**
   ```bash
   python3 --version
   pip3 --version
   ```

---

## Step 3: Clone/Download Project

### Option A: Using Git (Recommended)

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd slms

# List contents
ls -la
```

### Option B: Download ZIP

1. Visit the repository on GitHub
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Open the extracted folder

### Project Structure

```
slms/
├── client/                 # Frontend application
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── server/                 # Django backend
│   ├── apps/
│   ├── slms_core/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   └── setup_postgres.sql
├── README.md
└── Documentation files
```

---

## Step 4: Backend Setup

### Step 4.1: Navigate to Server Directory

```bash
cd server
```

### Step 4.2: Create Virtual Environment

**Windows (Command Prompt):**
```bash
python -m venv venv
```

**Windows (PowerShell):**
```powershell
python -m venv venv
```

**macOS/Linux:**
```bash
python3 -m venv venv
```

### Step 4.3: Activate Virtual Environment

**Windows (Command Prompt):**
```bash
venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Verify Activation:**
- You should see `(venv)` prefix in your terminal
- Example: `(venv) C:\path\to\server>`

### Step 4.4: Upgrade pip

```bash
python -m pip install --upgrade pip
```

### Step 4.5: Install Dependencies

```bash
pip install -r requirements.txt
```

**What gets installed:**
- Django 4.2.7
- Django REST Framework
- psycopg2-binary (PostgreSQL driver)
- django-cors-headers
- Pillow (image processing)
- python-dateutil
- And other dependencies

**Installation time:** 3-5 minutes

### Step 4.6: Verify Installation

```bash
# Check Django
python -c "import django; print(django.get_version())"

# Check psycopg2
python -c "import psycopg2; print(psycopg2.__version__)"

# Check all packages
pip list
```

---

## Step 5: Database Setup

### Step 5.1: Run Setup Script

**Windows:**
```bash
setup_postgres.bat
```

**macOS/Linux:**
```bash
chmod +x setup_postgres.sh
./setup_postgres.sh
```

**What the script does:**
- Creates database `slms_db`
- Creates user `sipi_web`
- Sets password `sipiadmin`
- Grants all privileges
- Verifies the setup

### Step 5.2: Manual Setup (If Script Fails)

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql, run these commands:
CREATE DATABASE slms_db;
CREATE USER sipi_web WITH PASSWORD 'sipiadmin';
ALTER ROLE sipi_web SET client_encoding TO 'utf8';
ALTER ROLE sipi_web SET default_transaction_isolation TO 'read committed';
ALTER ROLE sipi_web SET default_transaction_deferrable TO on;
ALTER ROLE sipi_web SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE slms_db TO sipi_web;

# Exit psql
\q
```

### Step 5.3: Verify Database Connection

```bash
# Test connection
psql -U sipi_web -d slms_db

# Inside psql:
SELECT 1;

# Exit
\q
```

### Step 5.4: Run Django Migrations

```bash
# Make sure you're in the server directory with venv activated
python manage.py migrate
```

**Expected output:**
```
Operations to perform:
  Apply all migrations: admin, alumni, applications, auth, contenttypes, documents, sessions, students
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
```

### Step 5.5: Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

**Follow the prompts:**
- Username: `admin`
- Email: `admin@example.com`
- Password: (enter a strong password)
- Password (again): (confirm password)

### Step 5.6: Seed Initial Data (Optional)

```bash
# Seed departments
python manage.py seed_departments

# Generate sample data
python manage.py generate_sample_data --students 20 --applications 10
```

---

## Step 6: Frontend Setup

### Step 6.1: Navigate to Client Directory

```bash
# From the project root
cd client
```

### Step 6.2: Start Frontend Server

**Option A: Using Python**
```bash
python -m http.server 8000
```

**Option B: Using Node.js (if installed)**
```bash
npx http-server -p 8000
```

**Option C: Using Live Server (VS Code)**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

### Step 6.3: Access Frontend

Open your browser and visit:
```
http://localhost:8000/client/
```

---

## Step 7: Verification

### Step 7.1: Run Verification Script

```bash
# From server directory
python verify_postgres_connection.py
```

**Expected output:**
```
✅ Database connection successful
✅ Database settings correct
✅ Migrations applied
✅ Installed apps configured
✅ Database tables created
✅ API endpoints accessible
✅ CORS configured
```

### Step 7.2: Test API Endpoints

**In your browser:**
```
http://localhost:8000/api/students/
http://localhost:8000/api/departments/
http://localhost:8000/api/dashboard/stats/
```

**Or using curl:**
```bash
curl http://localhost:8000/api/students/
```

### Step 7.3: Test Admin Panel

1. Visit: `http://localhost:8000/admin/`
2. Login with superuser credentials
3. Verify you can see:
   - Students
   - Departments
   - Alumni
   - Documents
   - Applications

### Step 7.4: Test Frontend

1. Visit: `http://localhost:8000/client/`
2. Verify you can see:
   - Dashboard
   - Navigation menu
   - All pages load
   - No console errors

---

## Step 8: Running the Application

### Terminal 1: Start Backend

```bash
cd server

# Activate virtual environment
# Windows:
venv\Scripts\activate.bat
# macOS/Linux:
source venv/bin/activate

# Start Django server
python manage.py runserver
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### Terminal 2: Start Frontend

```bash
cd client

# Start frontend server
python -m http.server 8000
```

**Expected output:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

### Access Application

- **Frontend**: http://localhost:8000/client/
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

---

## Troubleshooting

### Issue 1: PostgreSQL Not Running

**Symptom:** "Connection refused" or "FATAL: could not connect to server"

**Solution:**
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Windows
# Use Services app or PostgreSQL installer
```

### Issue 2: psycopg2 Installation Error

**Symptom:** "error: Microsoft Visual C++ 14.0 is required"

**Solution:**
```bash
pip install psycopg2-binary
```

### Issue 3: Virtual Environment Not Activating

**Symptom:** `(venv)` prefix doesn't appear

**Solution:**
```bash
# Windows (try PowerShell instead of CMD)
.\venv\Scripts\Activate.ps1

# If that fails, check path
dir venv\Scripts\

# macOS/Linux
source venv/bin/activate
```

### Issue 4: Django Not Found

**Symptom:** "ModuleNotFoundError: No module named 'django'"

**Solution:**
```bash
# Make sure virtual environment is activated
pip install -r requirements.txt
```

### Issue 5: Database Connection Error

**Symptom:** "FATAL: Ident authentication failed for user"

**Solution:**
```bash
# Edit PostgreSQL pg_hba.conf
# Change 'ident' to 'md5' or 'scram-sha-256'
# Restart PostgreSQL
```

### Issue 6: Port Already in Use

**Symptom:** "Address already in use"

**Solution:**
```bash
# Find process using port 8000
# Windows:
netstat -ano | findstr :8000

# macOS/Linux:
lsof -i :8000

# Kill the process
# Windows:
taskkill /PID <PID> /F

# macOS/Linux:
kill -9 <PID>

# Or use different port
python manage.py runserver 8001
```

### Issue 7: Migration Error

**Symptom:** "No such table" or migration conflicts

**Solution:**
```bash
# Reset migrations (development only)
python manage.py migrate --fake-initial

# Or start fresh
rm db.sqlite3
python manage.py migrate
```

### Issue 8: Static Files Not Loading

**Symptom:** CSS/JS files return 404

**Solution:**
```bash
python manage.py collectstatic --noinput
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] Static files collected
- [ ] DEBUG set to False
- [ ] SECRET_KEY changed
- [ ] ALLOWED_HOSTS configured
- [ ] CORS origins restricted
- [ ] HTTPS enabled

### Environment Variables for Production

Create `.env` file:
```env
DEBUG=False
SECRET_KEY=your-very-secret-key-here
DATABASE_URL=postgresql://user:password@host:port/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Deploy to Heroku

```bash
# Install Heroku CLI
# Visit: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Create superuser
heroku run python manage.py createsuperuser

# View logs
heroku logs --tail
```

### Deploy to AWS

1. **Create EC2 Instance**
   - Ubuntu 20.04 LTS
   - t2.micro (free tier)

2. **Install Dependencies**
   ```bash
   sudo apt-get update
   sudo apt-get install python3 python3-pip postgresql
   ```

3. **Clone Project**
   ```bash
   git clone <repository-url>
   cd slms
   ```

4. **Setup Backend**
   ```bash
   cd server
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

5. **Configure Database**
   ```bash
   # Create RDS PostgreSQL instance
   # Update .env with RDS endpoint
   ```

6. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

7. **Start Server**
   ```bash
   gunicorn slms_core.wsgi:application --bind 0.0.0.0:8000
   ```

### Deploy to DigitalOcean

1. **Create Droplet**
   - Ubuntu 20.04
   - $5/month (1GB RAM)

2. **SSH into Droplet**
   ```bash
   ssh root@your_droplet_ip
   ```

3. **Install Dependencies**
   ```bash
   apt-get update
   apt-get install python3 python3-pip postgresql nginx
   ```

4. **Setup Application**
   - Clone repository
   - Create virtual environment
   - Install dependencies
   - Configure database

5. **Configure Nginx**
   ```bash
   # Create nginx config
   # Point to Django application
   ```

6. **Start Services**
   ```bash
   systemctl start postgresql
   systemctl start nginx
   gunicorn slms_core.wsgi:application
   ```

---

## Quick Reference

### Important Directories

```
slms/
├── client/              # Frontend files
├── server/              # Backend files
│   ├── apps/           # Django apps
│   ├── slms_core/      # Settings
│   └── manage.py       # Django management
└── Documentation/      # Guides and docs
```

### Important Files

```
server/
├── .env                           # Configuration
├── requirements.txt               # Dependencies
├── manage.py                      # Django CLI
├── setup_postgres.sql             # Database setup
├── setup_postgres.bat             # Windows setup
├── setup_postgres.sh              # Linux/macOS setup
└── verify_postgres_connection.py  # Verification
```

### Important Credentials

```
Database: slms_db
User:     sipi_web
Password: sipiadmin
Host:     localhost
Port:     5432
```

### Important URLs

```
Frontend:  http://localhost:8000/client/
API:       http://localhost:8000/api/
Admin:     http://localhost:8000/admin/
```

---

## Next Steps

1. ✅ Complete installation
2. ✅ Verify everything works
3. 🔄 Explore the application
4. 🔄 Add sample data
5. 🔄 Customize as needed
6. 🔄 Deploy to production

---

## Support and Resources

### Documentation
- Django: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- PostgreSQL: https://www.postgresql.org/docs/
- Python: https://docs.python.org/3/

### Tools
- Postman: https://www.postman.com/ (API testing)
- pgAdmin: https://www.pgadmin.org/ (Database management)
- VS Code: https://code.visualstudio.com/ (Code editor)

### Getting Help
1. Check troubleshooting section
2. Run verification script
3. Check Django logs
4. Review documentation files
5. Search online for specific errors

---

## Conclusion

You now have a complete, working SLMS installation with:
- ✅ PostgreSQL database
- ✅ Django backend with REST API
- ✅ Premium frontend UI
- ✅ All features configured
- ✅ Ready for development or deployment

**Happy coding!** 🚀

---

*Last Updated: December 2025*
*Version: 1.0.0*
*Installation Guide for SLMS v1.0*

</content>
