# SIPI Student Lifecycle Management System

A comprehensive web application for managing student information from admission to graduation and beyond. Built with Django REST API backend and vanilla JavaScript frontend.

## Project Structure

```
SIPI-Student-Lifecycle-main/
├── client/                 # Frontend (HTML, CSS, JavaScript)
│   ├── index.html
│   ├── css/
│   ├── js/
│   │   ├── api.js          # API service layer
│   │   ├── data-api.js     # API-based data manager
│   │   ├── app.js          # Main application logic
│   │   └── ...
│   └── pages/
├── server/                 # Django Backend
│   ├── slms_backend/       # Django project settings
│   ├── students/           # Students app
│   ├── documents/          # Documents app
│   ├── applications/        # Applications app
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
└── README.md               # This file
```

## Features

### Student Management
- ✅ Add new students with comprehensive information
- ✅ View and search student list
- ✅ Update student information
- ✅ Delete students
- ✅ Upload profile photos
- ✅ Filter by department, semester, and status

### Document Management
- ✅ Upload student documents (photos, certificates, NID copies, etc.)
- ✅ View documents by student
- ✅ Delete documents
- ✅ Support for multiple file types (images, PDFs)

### Application System
- ✅ Submit applications for testimonials, certificates, stipends, etc.
- ✅ View and manage applications
- ✅ Approve/reject applications
- ✅ Track application status

### Additional Features
- ✅ Dashboard with statistics
- ✅ Department management
- ✅ Marks and attendance tracking (localStorage-based)
- ✅ Alumni management (localStorage-based)

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS (CDN)
- Lucide Icons
- Chart.js

### Backend
- Django 4.2.7
- Django REST Framework
- PostgreSQL
- Python 3.8+

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)
- A modern web browser

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup PostgreSQL database:**
   - Create a database named `slms_db`
   - Update `.env` file with your database credentials (see `server/.env.example`)

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server:**
   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Open `index.html` in a web browser:**
   - You can use a local web server (e.g., Live Server in VS Code)
   - Or use Python's built-in server:
     ```bash
     python -m http.server 5500
     ```
   - Then open `http://localhost:5500` in your browser

3. **Configure API URL (if needed):**
   - Edit `client/js/api.js`
   - Update `API_BASE_URL` if your backend is running on a different port/host

## API Endpoints

### Students
- `GET /api/students/` - List all students
- `GET /api/students/?search=query` - Search students
- `GET /api/students/{id}/` - Get student details
- `POST /api/students/` - Create new student
- `PATCH /api/students/{id}/` - Update student
- `DELETE /api/students/{id}/` - Delete student
- `POST /api/students/{id}/upload_photo/` - Upload profile photo

### Documents
- `GET /api/documents/` - List all documents
- `GET /api/documents/?student_id={id}` - Get documents for a student
- `POST /api/documents/` - Upload document
- `DELETE /api/documents/{id}/` - Delete document

### Applications
- `GET /api/applications/` - List all applications
- `GET /api/applications/{id}/` - Get application details
- `POST /api/applications/` - Submit new application
- `POST /api/applications/{id}/approve/` - Approve application
- `POST /api/applications/{id}/reject/` - Reject application

## Database Models

### Student Model
Contains comprehensive student information:
- Personal information (name, DOB, gender, etc.)
- Address information (present and permanent)
- Contact information
- Educational background
- Current academic information
- Profile photo

### Document Model
Student documents including:
- Passport photos
- Certificates
- NID copies
- Marksheets
- Other documents

### Application Model
Student applications for:
- Testimonials
- Certificates
- Stipends
- Other services

## Configuration

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True

DB_NAME=slms_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

### CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:8000`
- `http://localhost:5500`
- `http://127.0.0.1:8000`
- `http://127.0.0.1:5500`

For production, update `CORS_ALLOWED_ORIGINS` in `server/slms_backend/settings.py`.

## Development

### Running Tests
```bash
cd server
python manage.py test
```

### Accessing Admin Panel
1. Create superuser: `python manage.py createsuperuser`
2. Visit: `http://localhost:8000/admin`
3. Login with superuser credentials

## Production Deployment

### Backend
1. Set `DEBUG=False` in `.env`
2. Set a strong `SECRET_KEY`
3. Configure `ALLOWED_HOSTS` in `settings.py`
4. Use a production web server (gunicorn, uwsgi)
5. Configure static file serving
6. Use environment variables for all sensitive data

### Frontend
1. Update `API_BASE_URL` in `client/js/api.js` to point to production API
2. Deploy static files to a web server (nginx, Apache, etc.)
3. Configure CORS on backend to allow your frontend domain

## Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `slms_db` exists

**Migration Errors:**
- Delete migration files (except `__init__.py`) and run `makemigrations` again
- Or reset database: `python manage.py flush`

**Port Already in Use:**
- Change port: `python manage.py runserver 8001`

### Frontend Issues

**API Connection Error:**
- Verify backend server is running
- Check `API_BASE_URL` in `client/js/api.js`
- Check browser console for CORS errors
- Ensure CORS is properly configured in backend

**Data Not Loading:**
- Check browser console for errors
- Verify API endpoints are accessible
- Check network tab in browser dev tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is developed for Sirajganj Polytechnic Institute (SIPI).

## Support

For issues and questions, please contact the development team.
