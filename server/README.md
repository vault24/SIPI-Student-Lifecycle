# SIPI Student Lifecycle Management System - Backend

Django REST API backend for the Student Lifecycle Management System.

## Prerequisites

- Python 3.8 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

## Setup Instructions

### 1. Install PostgreSQL

#### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install PostgreSQL with default settings
3. Remember the password you set for the `postgres` user

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### 2. Create PostgreSQL Database

Open PostgreSQL command line or pgAdmin and run:

```sql
CREATE DATABASE slms_db;
```

Or using command line:
```bash
# Windows (using psql)
psql -U postgres
CREATE DATABASE slms_db;
\q

# Linux/macOS
sudo -u postgres psql
CREATE DATABASE slms_db;
\q
```

### 3. Setup Python Virtual Environment

```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

```bash
# Copy .env.example to .env
# Windows:
copy .env.example .env
# Linux/macOS:
cp .env.example .env
```

Edit `.env` file and update database credentials:

```env
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True

DB_NAME=slms_db
DB_USER=postgres
DB_PASSWORD=your-postgres-password
DB_HOST=localhost
DB_PORT=5432
```

### 6. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 8. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Students
- `GET /api/students/` - List all students
- `GET /api/students/?search=query` - Search students
- `GET /api/students/?semester=1&status=active` - Filter students
- `GET /api/students/{id}/` - Get student details
- `POST /api/students/` - Create new student
- `PUT /api/students/{id}/` - Update student
- `PATCH /api/students/{id}/` - Partially update student
- `DELETE /api/students/{id}/` - Delete student
- `POST /api/students/{id}/upload_photo/` - Upload profile photo

### Documents
- `GET /api/documents/` - List all documents
- `GET /api/documents/?student_id={id}` - Get documents for a student
- `POST /api/documents/` - Upload document
- `POST /api/documents/upload_multiple/` - Upload multiple documents
- `DELETE /api/documents/{id}/` - Delete document

### Applications
- `GET /api/applications/` - List all applications
- `GET /api/applications/?status=pending` - Filter by status
- `GET /api/applications/{id}/` - Get application details
- `POST /api/applications/` - Submit new application
- `POST /api/applications/{id}/approve/` - Approve application
- `POST /api/applications/{id}/reject/` - Reject application
- `DELETE /api/applications/{id}/` - Delete application

## Database Models

### Student
Contains all student information including:
- Personal information (name, DOB, gender, etc.)
- Address information (present and permanent)
- Contact information
- Educational background
- Current academic information
- Profile photo

### Document
Student documents including:
- Passport photos
- Certificates
- NID copies
- Marksheets
- Other documents

### Application
Student applications for:
- Testimonials
- Certificates
- Stipends
- Other services

## Development

### Running Tests
```bash
python manage.py test
```

### Accessing Admin Panel
1. Create superuser: `python manage.py createsuperuser`
2. Visit: `http://localhost:8000/admin`
3. Login with superuser credentials

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Set a strong `SECRET_KEY`
3. Configure proper `ALLOWED_HOSTS` in `settings.py`
4. Use a production-grade web server (gunicorn, uwsgi)
5. Configure static file serving
6. Use environment variables for all sensitive data

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `slms_db` exists

### Migration Errors
- Delete migration files (except `__init__.py`) and run `makemigrations` again
- Or reset database: `python manage.py flush`

### Port Already in Use
- Change port: `python manage.py runserver 8001`
- Or kill the process using port 8000


