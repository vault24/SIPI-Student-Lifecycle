# Complete SLMS Setup Guide - Step by Step

## 🎯 Overview

This guide will walk you through the complete setup of your SLMS project with PostgreSQL, from start to finish.

---

## 📋 Prerequisites

- PostgreSQL installed and running
- Python 3.8+ installed
- Git (optional)

---

## 🚀 Complete Setup Steps

### Step 1: Navigate to Server Directory

```bash
cd "G:\Collage project\Database\server"
```

### Step 2: Create and Activate Virtual Environment

**Windows (Command Prompt):**
```bash
python -m venv venv
venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` prefix in your terminal.

### Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs:
- Django 4.2.7
- Django REST Framework
- psycopg2-binary (PostgreSQL driver)
- django-cors-headers
- And other required packages

### Step 4: Fix PostgreSQL Permissions

**Windows:**
```bash
FIX_PERMISSIONS.bat
```

**macOS/Linux:**
```bash
psql -U postgres -f fix_postgres_permissions.sql
```

### Step 5: Run Migrations

```bash
python manage.py migrate
```

Expected output:
```
Operations to perform:
  Apply all migrations: admin, alumni, applications, auth, contenttypes, documents, sessions, students
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
```

### Step 6: Verify Connection

```bash
python verify_postgres_connection.py
```

Should show all checks passing with ✅

### Step 7: Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin user.

### Step 8: Start Django Server

```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

### Step 9: Start Frontend (New Terminal)

Open a new terminal and run:
```bash
cd "G:\Collage project\Database\client"
# Your frontend command here
```
python -m http.server 8000
---

## ✅ Verification Checklist

- [ ] Virtual environment created
- [ ] Virtual environment activated (see `(venv)` prefix)
- [ ] Dependencies installed (no errors)
- [ ] PostgreSQL permissions fixed
- [ ] Migrations applied successfully
- [ ] Connection verified
- [ ] Django server running
- [ ] Frontend server running
- [ ] Can access http://localhost:8000/api/students/

---

## 📊 What Gets Installed

### Core Dependencies
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API framework
- **psycopg2-binary** - PostgreSQL driver
- **django-cors-headers** - CORS support
- **python-decouple** - Environment variables

### Utilities
- **Pillow** - Image processing
- **python-dateutil** - Date utilities

### Development Tools (Optional)
- **django-debug-toolbar** - Debugging
- **black** - Code formatter
- **flake8** - Linter
- **pytest** - Testing framework
- **pytest-django** - Django testing

### Production Tools (Optional)
- **gunicorn** - Production server
- **whitenoise** - Static file serving

---

## 🔧 Troubleshooting

### Issue: Virtual environment not activating
**Solution:**
```bash
# Windows CMD
venv\Scripts\activate.bat

# Windows PowerShell
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate
```

### Issue: psycopg2 installation fails
**Solution:**
```bash
pip install psycopg2-binary
```

### Issue: Permission denied for schema public
**Solution:**
```bash
# Windows
FIX_PERMISSIONS.bat

# macOS/Linux
psql -U postgres -f fix_postgres_permissions.sql
```

### Issue: Django not found
**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: PostgreSQL connection refused
**Solution:**
1. Check PostgreSQL is running: `pg_isready`
2. Verify credentials in `.env`
3. Check port 5432 is not blocked

---

## 📁 Project Structure

```
G:\Collage project\Database\
├── client/                    # Frontend (Premium UI)
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript
│   └── index.html
├── server/                    # Django Backend
│   ├── apps/                  # Django apps
│   ├── slms_core/             # Django settings
│   ├── manage.py
│   ├── requirements.txt       # Dependencies
│   ├── .env                   # Configuration
│   ├── setup_postgres.sql     # Database setup
│   ├── fix_postgres_permissions.sql  # Permission fix
│   ├── FIX_PERMISSIONS.bat    # Windows fix script
│   └── verify_postgres_connection.py  # Verification
└── Documentation files
```

---

## 🎯 Quick Commands Reference

| Task | Command |
|------|---------|
| Activate venv (Windows CMD) | `venv\Scripts\activate.bat` |
| Activate venv (Windows PS) | `.\venv\Scripts\Activate.ps1` |
| Activate venv (macOS/Linux) | `source venv/bin/activate` |
| Deactivate venv | `deactivate` |
| Install dependencies | `pip install -r requirements.txt` |
| Fix permissions | `FIX_PERMISSIONS.bat` or `psql -U postgres -f fix_postgres_permissions.sql` |
| Run migrations | `python manage.py migrate` |
| Create superuser | `python manage.py createsuperuser` |
| Start server | `python manage.py runserver` |
| Verify connection | `python verify_postgres_connection.py` |
| Access API | http://localhost:8000/api/ |
| Access admin | http://localhost:8000/admin/ |

---

## 🔐 Database Credentials

```
Database: slms_db
User:     sipi_web
Password: sipiadmin
Host:     localhost
Port:     5432
```

---

## 📊 API Endpoints

Once running, access these endpoints:

```
GET  /api/dashboard/stats/
GET  /api/students/
POST /api/students/
GET  /api/students/{id}/
PUT  /api/students/{id}/
DELETE /api/students/{id}/
GET  /api/departments/
GET  /api/alumni/
GET  /api/documents/
GET  /api/applications/
```

---

## 🎉 Success Indicators

After completing all steps, you should see:

1. ✅ Virtual environment activated (venv prefix in terminal)
2. ✅ All dependencies installed
3. ✅ Migrations applied successfully
4. ✅ Django server running on port 8000
5. ✅ Frontend running on your configured port
6. ✅ API endpoints responding with data

---

## 📞 Need Help?

- **Django not found**: See [FIX_DJANGO_NOT_FOUND.md](FIX_DJANGO_NOT_FOUND.md)
- **Permission denied**: See [FIX_POSTGRESQL_PERMISSIONS.md](FIX_POSTGRESQL_PERMISSIONS.md)
- **PostgreSQL setup**: See [POSTGRESQL_SETUP_GUIDE.md](POSTGRESQL_SETUP_GUIDE.md)
- **Quick start**: See [QUICK_START_POSTGRES.md](QUICK_START_POSTGRES.md)

---

**Status**: ✅ Complete Setup Guide
**Last Updated**: December 2025
**Version**: 1.0.0
