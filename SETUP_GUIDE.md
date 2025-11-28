# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Backend Setup (Django + PostgreSQL)

#### Install PostgreSQL
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Linux**: `sudo apt install postgresql postgresql-contrib`
- **macOS**: `brew install postgresql`

#### Create Database
```sql
CREATE DATABASE slms_db;
```

#### Setup Django Backend
```bash
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
# Windows:
copy env.example .env
# Linux/macOS:
cp env.example .env

# Edit .env file with your PostgreSQL credentials
# Update: DB_PASSWORD=your-postgres-password

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run server
python manage.py runserver
```

Backend will run at: `http://localhost:8000`

### 2. Frontend Setup

```bash
cd client

# Open index.html in a browser
# Or use a local server:
python -m http.server 5500
```

Frontend will be available at: `http://localhost:5500`

### 3. Verify Setup

1. **Backend**: Visit `http://localhost:8000/api/students/` - should return empty array `[]`
2. **Frontend**: Open `http://localhost:5500` - should load the dashboard
3. **Test**: Try adding a student from the frontend

## Common Issues

### PostgreSQL Connection Error
- Make sure PostgreSQL service is running
- Check credentials in `.env` file
- Verify database `slms_db` exists

### CORS Errors
- Backend CORS is configured for localhost:8000 and localhost:5500
- If using different ports, update `CORS_ALLOWED_ORIGINS` in `server/slms_backend/settings.py`

### API Not Found
- Ensure backend server is running on port 8000
- Check `API_BASE_URL` in `client/js/api.js`

## Next Steps

1. Add your first student via the frontend
2. Upload documents for students
3. Submit test applications
4. Explore the admin panel at `http://localhost:8000/admin`


