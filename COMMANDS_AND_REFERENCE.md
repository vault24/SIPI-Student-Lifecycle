# SLMS Complete Commands and Reference Guide

A comprehensive reference guide containing all commands, API endpoints, code snippets, and quick references for the SIPI Student Lifecycle Management System.

---

## Table of Contents

1. [Quick Commands](#quick-commands)
2. [API Endpoints Reference](#api-endpoints-reference)
3. [Common Code Snippets](#common-code-snippets)
4. [Feature Locations](#feature-locations)
5. [Database Commands](#database-commands)
6. [Troubleshooting Commands](#troubleshooting-commands)
7. [Deployment Commands](#deployment-commands)

---

## Quick Commands

### Frontend Commands

```bash
# Start local development server
python -m http.server 8000
# Visit: http://localhost:8000/client/

# Or use Node.js http-server
npx http-server client -p 8000

# Open in browser
start http://localhost:8000/client/  # Windows
open http://localhost:8000/client/   # macOS
xdg-open http://localhost:8000/client/ # Linux
```

### Backend Setup Commands

```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (Command Prompt):
venv\Scripts\activate.bat

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# macOS/Linux:
source venv/bin/activate

# Verify activation (should show (venv) prefix)
python --version

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Verify Django installation
python -c "import django; print(django.get_version())"
```

### Database Setup Commands

```bash
# Windows setup (automated)
cd server
setup_postgres.bat

# macOS/Linux setup (automated)
cd server
chmod +x setup_postgres.sh
./setup_postgres.sh

# Manual PostgreSQL connection
psql -U postgres

# Create database manually
CREATE DATABASE slms_db;
CREATE USER sipi_web WITH PASSWORD 'sipiadmin';
GRANT ALL PRIVILEGES ON DATABASE slms_db TO sipi_web;
```

### Django Migration Commands

```bash
# Create migrations for changes
python manage.py makemigrations

# Create migrations for specific app
python manage.py makemigrations students
python manage.py makemigrations departments
python manage.py makemigrations alumni
python manage.py makemigrations applications
python manage.py makemigrations documents
python manage.py makemigrations notifications

# Apply all migrations
python manage.py migrate

# Apply migrations for specific app
python manage.py migrate students

# Show migration status
python manage.py showmigrations

# Reverse migrations
python manage.py migrate students zero

# Create initial migration
python manage.py makemigrations --initial
```

### Django Server Commands

```bash
# Start development server
python manage.py runserver

# Start on specific port
python manage.py runserver 8001

# Start on all interfaces
python manage.py runserver 0.0.0.0:8000

# Start with auto-reload disabled
python manage.py runserver --noreload

# Start with threading
python manage.py runserver --use-threading
```

### Django User Management Commands

```bash
# Create superuser (admin)
python manage.py createsuperuser

# Create user programmatically
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.create_user('username', 'email@example.com', 'password')

# Change user password
python manage.py changepassword username

# Delete user
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.get(username='username').delete()
```

### Django Data Commands

```bash
# Seed departments
python manage.py seed_departments

# Generate sample data
python manage.py generate_sample_data --students 20 --applications 10

# Clear all data
python manage.py flush

# Load data from fixture
python manage.py loaddata fixture_name

# Dump data to fixture
python manage.py dumpdata > backup.json
```

### Django Testing Commands

```bash
# Run all tests
python manage.py test

# Run tests for specific app
python manage.py test apps.students

# Run specific test class
python manage.py test apps.students.tests.StudentTestCase

# Run specific test method
python manage.py test apps.students.tests.StudentTestCase.test_create_student

# Run with verbose output
python manage.py test -v 2

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Django Shell Commands

```bash
# Open Django shell
python manage.py shell

# Inside shell:
from apps.students.models import Student
from django.contrib.auth.models import User

# Query examples
students = Student.objects.all()
student = Student.objects.get(id=1)
students = Student.objects.filter(semester=3)
students = Student.objects.filter(department__name='CSE')

# Create
student = Student.objects.create(
    name_english='John Doe',
    name_bangla='জন ডো',
    roll_number='001',
    registration_number='REG001',
    semester=1,
    department_id=1
)

# Update
student.semester = 2
student.save()

# Delete
student.delete()

# Count
count = Student.objects.count()

# Aggregate
from django.db.models import Count
departments = Student.objects.values('department').annotate(count=Count('id'))
```

### Database Backup/Restore Commands

```bash
# Backup PostgreSQL database
pg_dump -U sipi_web -d slms_db > backup.sql

# Backup with compression
pg_dump -U sipi_web -d slms_db | gzip > backup.sql.gz

# Restore database
psql -U sipi_web -d slms_db < backup.sql

# Restore from compressed backup
gunzip -c backup.sql.gz | psql -U sipi_web -d slms_db

# Backup specific table
pg_dump -U sipi_web -d slms_db -t students_student > students_backup.sql

# Backup all databases
pg_dumpall -U postgres > all_databases.sql
```

### PostgreSQL Commands

```bash
# Connect to PostgreSQL
psql -U postgres

# Connect to specific database
psql -U sipi_web -d slms_db

# List databases
\l

# List tables
\dt

# Describe table
\d students_student

# List users
\du

# Exit psql
\q

# Execute SQL file
psql -U sipi_web -d slms_db -f setup_postgres.sql

# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL service
# Windows: Services app or PostgreSQL installer
# macOS: brew services start postgresql@15
# Linux: sudo systemctl start postgresql

# Stop PostgreSQL service
# macOS: brew services stop postgresql@15
# Linux: sudo systemctl stop postgresql
```

### Git Commands

```bash
# Initialize repository
git init

# Add files
git add .
git add filename.txt

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push origin main

# Pull from remote
git pull origin main

# Create branch
git checkout -b feature-name

# Switch branch
git checkout main

# Merge branch
git merge feature-name

# View status
git status

# View log
git log

# View diff
git diff

# Stash changes
git stash

# Apply stashed changes
git stash pop
```

### Verification Commands

```bash
# Verify PostgreSQL connection
python verify_postgres_connection.py

# Check Python version
python --version

# Check Django version
python -c "import django; print(django.get_version())"

# Check installed packages
pip list

# Check specific package
pip show psycopg2-binary

# Test API endpoint
curl http://localhost:8000/api/students/

# Test with authentication
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/students/
```

---

## API Endpoints Reference

### Students API

```
GET    /api/students/                    - List all students
POST   /api/students/                    - Create new student
GET    /api/students/{id}/               - Get student details
PUT    /api/students/{id}/               - Update student
DELETE /api/students/{id}/               - Delete student
GET    /api/students/search/?q=query     - Search students
GET    /api/students/discontinued/       - List discontinued students
POST   /api/students/{id}/discontinue/   - Discontinue student
POST   /api/students/{id}/upload-photo/  - Upload student photo
```

### Alumni API

```
GET    /api/alumni/                      - List all alumni
POST   /api/alumni/                      - Create alumni record
GET    /api/alumni/{id}/                 - Get alumni details
PUT    /api/alumni/{id}/                 - Update alumni
DELETE /api/alumni/{id}/                 - Delete alumni
GET    /api/alumni/?status=Job           - Filter by status
```

### Departments API

```
GET    /api/departments/                 - List all departments
POST   /api/departments/                 - Create department
GET    /api/departments/{id}/            - Get department details
PUT    /api/departments/{id}/            - Update department
DELETE /api/departments/{id}/            - Delete department
GET    /api/departments/{id}/students/   - Get students by department
GET    /api/departments/{id}/students/?semester=3 - Filter by semester
```

### Documents API

```
GET    /api/documents/                   - List all documents
POST   /api/documents/                   - Upload document
GET    /api/documents/{id}/              - Get document details
DELETE /api/documents/{id}/              - Delete document
GET    /api/documents/?student_id=1      - Filter by student
GET    /api/documents/?category=NID      - Filter by category
```

### Applications API

```
GET    /api/applications/                - List all applications
POST   /api/applications/                - Submit application
GET    /api/applications/{id}/           - Get application details
PUT    /api/applications/{id}/           - Update application status
DELETE /api/applications/{id}/           - Delete application
GET    /api/applications/?status=Pending - Filter by status
```

### Dashboard API

```
GET    /api/dashboard/stats/             - Get dashboard statistics
```

### Query Parameters

```
# Pagination
?page=1&page_size=20

# Filtering
?department=1&semester=3&is_active=true

# Searching
?search=john

# Ordering
?ordering=-created_at

# Combining
?page=1&department=1&search=john&ordering=-created_at
```

### Response Format

```json
{
    "count": 100,
    "next": "http://localhost:8000/api/students/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "name_english": "John Doe",
            "name_bangla": "জন ডো",
            "roll_number": "001",
            "email": "john@example.com",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:00:00Z"
        }
    ]
}
```

---

## Common Code Snippets

### Frontend - Fetch Data

```javascript
// Using async/await
async function loadStudents() {
    try {
        const response = await fetch('/api/students/');
        const data = await response.json();
        console.log(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Using promises
fetch('/api/students/')
    .then(response => response.json())
    .then(data => console.log(data.results))
    .catch(error => console.error('Error:', error));

// With query parameters
const params = new URLSearchParams({
    page: 1,
    department: 1,
    search: 'john'
});
fetch(`/api/students/?${params}`)
    .then(response => response.json())
    .then(data => console.log(data));
```

### Frontend - Create Data

```javascript
async function createStudent(studentData) {
    try {
        const response = await fetch('/api/students/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData)
        });
        
        if (response.ok) {
            const newStudent = await response.json();
            console.log('Student created:', newStudent);
        } else {
            const error = await response.json();
            console.error('Error:', error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Usage
createStudent({
    name_english: 'John Doe',
    name_bangla: 'জন ডো',
    roll_number: '001',
    registration_number: 'REG001',
    semester: 1,
    department: 1
});
```

### Frontend - Update Data

```javascript
async function updateStudent(studentId, updates) {
    try {
        const response = await fetch(`/api/students/${studentId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });
        
        if (response.ok) {
            const updated = await response.json();
            console.log('Student updated:', updated);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Usage
updateStudent(1, { semester: 2, email: 'newemail@example.com' });
```

### Frontend - Delete Data

```javascript
async function deleteStudent(studentId) {
    try {
        const response = await fetch(`/api/students/${studentId}/`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            console.log('Student deleted');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Usage
deleteStudent(1);
```

### Frontend - File Upload

```javascript
async function uploadFile(file, studentId, category) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('student_id', studentId);
    formData.append('category', category);
    
    try {
        const response = await fetch('/api/documents/', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('File uploaded:', result);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Usage
const fileInput = document.getElementById('file-input');
uploadFile(fileInput.files[0], 1, 'NID');
```

### Backend - Model Definition

```python
from django.db import models

class Student(models.Model):
    name_bangla = models.CharField(max_length=200)
    name_english = models.CharField(max_length=200)
    roll_number = models.CharField(max_length=20, unique=True)
    registration_number = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True, null=True)
    mobile = models.CharField(max_length=15)
    semester = models.IntegerField()
    department = models.ForeignKey('departments.Department', on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name_english} ({self.roll_number})"
```

### Backend - Serializer

```python
from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Student
        fields = '__all__'
    
    def validate_roll_number(self, value):
        if Student.objects.filter(roll_number=value).exists():
            raise serializers.ValidationError("Roll number already exists")
        return value
```

### Backend - ViewSet

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by department
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department_id=department)
        
        # Filter by semester
        semester = self.request.query_params.get('semester')
        if semester:
            queryset = queryset.filter(semester=semester)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def discontinue(self, request, pk=None):
        student = self.get_object()
        student.is_active = False
        student.save()
        return Response({'status': 'student discontinued'})
```

### Backend - Custom Action

```python
@action(detail=False, methods=['get'])
def discontinued(self, request):
    students = self.queryset.filter(is_active=False)
    serializer = self.get_serializer(students, many=True)
    return Response(serializer.data)
```

---

## Feature Locations

### Frontend Pages

| Feature | File Path |
|---------|-----------|
| Dashboard | `client/js/pages/dashboardPage.js` |
| Student List | `client/js/pages/studentListPage.js` |
| Student Details | `client/js/pages/studentDetailsPage.js` |
| Add Student | `client/js/pages/addStudentPage.js` |
| Edit Student | `client/js/pages/editStudentPage.js` |
| Documents | `client/js/pages/documentsPage.js` |
| Marks & Attendance | `client/js/pages/marksAttendancePage.js` |
| Alumni List | `client/js/pages/alumniPage.js` |
| Alumni Details | `client/js/pages/alumniDetailsPage.js` |
| Edit Alumni | `client/js/pages/editAlumniPage.js` |
| Departments | `client/js/pages/departmentsPage.js` |
| Department View | `client/js/pages/departmentViewPage.js` |
| Discontinued Students | `client/js/pages/discontinuedStudentsPage.js` |
| Applications | `client/js/pages/applicationsPage.js` |
| Application Details | `client/js/pages/applicationDetailsPage.js` |
| Login | `client/js/pages/loginPage.js` |
| Admin Dashboard | `client/js/pages/adminDashboardPage.js` |

### Backend Apps

| Feature | File Path |
|---------|-----------|
| Student Model | `server/apps/students/models.py` |
| Student API | `server/apps/students/views.py` |
| Student Serializer | `server/apps/students/serializers.py` |
| Alumni Model | `server/apps/alumni/models.py` |
| Alumni API | `server/apps/alumni/views.py` |
| Department Model | `server/apps/departments/models.py` |
| Department API | `server/apps/departments/views.py` |
| Document Model | `server/apps/documents/models.py` |
| Document API | `server/apps/documents/views.py` |
| Application Model | `server/apps/applications/models.py` |
| Application API | `server/apps/applications/views.py` |
| Dashboard API | `server/apps/dashboard/views.py` |

---

## Database Commands

### PostgreSQL Connection

```bash
# Connect to PostgreSQL
psql -U postgres

# Connect to specific database
psql -U sipi_web -d slms_db

# Connect from specific host
psql -h localhost -U sipi_web -d slms_db

# Connect with password prompt
psql -U sipi_web -d slms_db -W
```

### Database Management

```sql
-- List all databases
\l

-- Create database
CREATE DATABASE slms_db;

-- Drop database
DROP DATABASE slms_db;

-- Connect to database
\c slms_db

-- List tables
\dt

-- Describe table
\d students_student

-- List users
\du

-- Create user
CREATE USER sipi_web WITH PASSWORD 'sipiadmin';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE slms_db TO sipi_web;

-- Grant table privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sipi_web;

-- Exit psql
\q
```

### Data Queries

```sql
-- Count students
SELECT COUNT(*) FROM students_student;

-- Get students by semester
SELECT * FROM students_student WHERE semester = 3;

-- Get students by department
SELECT * FROM students_student WHERE department_id = 1;

-- Get active students
SELECT * FROM students_student WHERE is_active = true;

-- Get discontinued students
SELECT * FROM students_student WHERE is_active = false;

-- Count by department
SELECT department_id, COUNT(*) FROM students_student GROUP BY department_id;

-- Get recent students
SELECT * FROM students_student ORDER BY created_at DESC LIMIT 10;

-- Search by name
SELECT * FROM students_student WHERE name_english ILIKE '%john%';

-- Join with department
SELECT s.*, d.name FROM students_student s 
JOIN departments_department d ON s.department_id = d.id;
```

---

## Troubleshooting Commands

### Check Services

```bash
# Check if PostgreSQL is running
pg_isready

# Check if Django server is running
curl http://localhost:8000/api/students/

# Check if port is in use
# Windows:
netstat -ano | findstr :8000

# macOS/Linux:
lsof -i :8000

# Kill process on port
# Windows:
taskkill /PID <PID> /F

# macOS/Linux:
kill -9 <PID>
```

### Check Logs

```bash
# Django logs (usually in console)
# Check for errors in terminal output

# PostgreSQL logs
# Windows: C:\Program Files\PostgreSQL\data\pg_log\
# macOS: /usr/local/var/postgres/
# Linux: /var/log/postgresql/

# View recent logs
tail -f /var/log/postgresql/postgresql.log
```

### Test Connections

```bash
# Test PostgreSQL connection
psql -U sipi_web -d slms_db -c "SELECT 1"

# Test Django connection
python manage.py dbshell

# Test API endpoint
curl http://localhost:8000/api/students/

# Test with verbose output
curl -v http://localhost:8000/api/students/

# Test with authentication
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/students/
```

### Fix Common Issues

```bash
# Fix psycopg2 error
pip install psycopg2-binary

# Fix Django not found
pip install -r requirements.txt

# Fix migration error
python manage.py migrate --run-syncdb

# Fix permission error
# Windows:
FIX_PERMISSIONS.bat

# macOS/Linux:
psql -U postgres -f fix_postgres_permissions.sql

# Clear cache
python manage.py clear_cache

# Collect static files
python manage.py collectstatic --noinput
```

---

## Deployment Commands

### Production Setup

```bash
# Install production dependencies
pip install gunicorn whitenoise

# Collect static files
python manage.py collectstatic --noinput

# Create production database
python manage.py migrate --settings=slms_core.settings.production

# Create superuser
python manage.py createsuperuser --settings=slms_core.settings.production

# Run production server
gunicorn slms_core.wsgi:application --bind 0.0.0.0:8000
```

### Environment Variables

```bash
# Set environment variables
export DEBUG=False
export SECRET_KEY=your-secret-key
export DATABASE_URL=postgresql://user:pass@host:port/db
export ALLOWED_HOSTS=example.com,www.example.com
export CORS_ALLOWED_ORIGINS=https://example.com

# Or in .env file
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
ALLOWED_HOSTS=example.com,www.example.com
CORS_ALLOWED_ORIGINS=https://example.com
```

### Backup and Restore

```bash
# Backup database
pg_dump -U sipi_web -d slms_db > backup.sql

# Backup with compression
pg_dump -U sipi_web -d slms_db | gzip > backup.sql.gz

# Restore database
psql -U sipi_web -d slms_db < backup.sql

# Restore from compressed backup
gunzip -c backup.sql.gz | psql -U sipi_web -d slms_db

# Backup specific table
pg_dump -U sipi_web -d slms_db -t students_student > students_backup.sql
```

---

## Quick Reference Tables

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve data | `GET /api/students/` |
| POST | Create data | `POST /api/students/` |
| PUT | Update data | `PUT /api/students/1/` |
| PATCH | Partial update | `PATCH /api/students/1/` |
| DELETE | Delete data | `DELETE /api/students/1/` |

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | Missing auth token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal error |

### Database Credentials

```
Database: slms_db
Username: sipi_web
Password: sipiadmin
Host:     localhost
Port:     5432
```

---

*Last Updated: December 2025*
*Version: 1.0.0*

</content>
