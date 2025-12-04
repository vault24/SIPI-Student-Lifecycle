# Integration Testing Guide

This guide provides comprehensive testing procedures for the SLMS Django backend integration.

## Prerequisites

- Django backend running on `http://localhost:8000`
- PostgreSQL database configured and running
- Frontend running (if testing frontend integration)
- Test data seeded (optional)

## Setup for Testing

### 1. Start Backend Server

```bash
cd server
python manage.py runserver
```

### 2. Seed Test Data (Optional)

```bash
python manage.py seed_departments
python manage.py generate_sample_data --students 20 --applications 10
```

### 3. Create Test Superuser

```bash
python manage.py createsuperuser
```

## Testing Checklist

### ✅ Student CRUD Operations

#### Create Student
```bash
curl -X POST http://localhost:8000/api/students/ \
  -H "Content-Type: application/json" \
  -d '{
    "fullNameBangla": "টেস্ট স্টুডেন্ট",
    "fullNameEnglish": "Test Student",
    "fatherName": "Father Name",
    "fatherNID": "1234567890",
    "motherName": "Mother Name",
    "motherNID": "0987654321",
    "dateOfBirth": "2000-01-01",
    "birthCertificateNo": "BC123456",
    "gender": "Male",
    "mobileStudent": "01712345678",
    "guardianMobile": "01798765432",
    "email": "test@example.com",
    "emergencyContact": "Emergency",
    "presentAddress": {
      "division": "Dhaka",
      "district": "Dhaka",
      "subDistrict": "Mirpur",
      "policeStation": "Mirpur",
      "postOffice": "Mirpur",
      "municipality": "Dhaka",
      "village": "Mirpur",
      "ward": "1"
    },
    "permanentAddress": {
      "division": "Dhaka",
      "district": "Dhaka",
      "subDistrict": "Mirpur",
      "policeStation": "Mirpur",
      "postOffice": "Mirpur",
      "municipality": "Dhaka",
      "village": "Mirpur",
      "ward": "1"
    },
    "highestExam": "SSC",
    "board": "Dhaka",
    "group": "Science",
    "rollNumber": "12345",
    "registrationNumber": "67890",
    "passingYear": 2018,
    "gpa": 5.00,
    "currentRollNumber": "CS001",
    "currentRegistrationNumber": "REG001",
    "semester": 1,
    "department": "DEPARTMENT_UUID_HERE",
    "session": "2023-24",
    "shift": "Day",
    "currentGroup": "A",
    "enrollmentDate": "2023-01-01"
  }'
```

**Expected Result:** `201 Created` with student object including ID

#### List Students
```bash
curl http://localhost:8000/api/students/
```

**Expected Result:** `200 OK` with paginated list of students

#### Get Student Details
```bash
curl http://localhost:8000/api/students/{STUDENT_ID}/
```

**Expected Result:** `200 OK` with complete student details

#### Update Student
```bash
curl -X PUT http://localhost:8000/api/students/{STUDENT_ID}/ \
  -H "Content-Type: application/json" \
  -d '{...updated data...}'
```

**Expected Result:** `200 OK` with updated student object

#### Delete Student
```bash
curl -X DELETE http://localhost:8000/api/students/{STUDENT_ID}/
```

**Expected Result:** `204 No Content` (or `400` if student is alumni)

#### Search Students
```bash
curl http://localhost:8000/api/students/search/?q=Test
```

**Expected Result:** `200 OK` with matching students

### ✅ File Upload Operations

#### Upload Student Photo
```bash
curl -X POST http://localhost:8000/api/students/{STUDENT_ID}/upload-photo/ \
  -F "photo=@/path/to/photo.jpg"
```

**Expected Result:** `200 OK` with updated student including photo path

**Verify:**
- Photo file exists in `client/assets/images/students/`
- Student record has `profilePhoto` field populated
- Photo path is relative (e.g., `students/photo_123.jpg`)

#### Upload Document
```bash
curl -X POST http://localhost:8000/api/documents/ \
  -F "student=STUDENT_UUID" \
  -F "category=NID" \
  -F "file=@/path/to/document.pdf"
```

**Expected Result:** `201 Created` with document object

**Verify:**
- Document file exists in `client/assets/images/documents/`
- Document record has `filePath` field populated
- File path is relative (e.g., `documents/doc_123.pdf`)

### ✅ Alumni Transition Workflow

#### Create Student with 8 Semesters
```bash
# Create student with semesterResults containing 8 semesters
curl -X POST http://localhost:8000/api/students/ \
  -H "Content-Type: application/json" \
  -d '{
    ...student data...,
    "semesterResults": [
      {"semester": 1, "gpa": 3.5, "cgpa": 3.5},
      {"semester": 2, "gpa": 3.6, "cgpa": 3.55},
      {"semester": 3, "gpa": 3.7, "cgpa": 3.6},
      {"semester": 4, "gpa": 3.8, "cgpa": 3.65},
      {"semester": 5, "gpa": 3.9, "cgpa": 3.7},
      {"semester": 6, "gpa": 4.0, "cgpa": 3.75},
      {"semester": 7, "gpa": 4.0, "cgpa": 3.8},
      {"semester": 8, "gpa": 4.0, "cgpa": 3.85}
    ]
  }'
```

#### Transition to Alumni
```bash
curl -X POST http://localhost:8000/api/students/{STUDENT_ID}/transition-to-alumni/ \
  -H "Content-Type: application/json" \
  -d '{"graduationYear": 2024}'
```

**Expected Result:** `201 Created` with alumni record

**Verify:**
- Alumni record created
- Student status changed to 'graduated'
- Alumni has initial support history

#### Try to Delete Alumni Student
```bash
curl -X DELETE http://localhost:8000/api/students/{STUDENT_ID}/
```

**Expected Result:** `400 Bad Request` with error message

**Verify:** Student and alumni records still exist

### ✅ Application Submission and Review

#### Submit Application
```bash
curl -X POST http://localhost:8000/api/applications/submit/ \
  -H "Content-Type: application/json" \
  -d '{
    "fullNameBangla": "আবেদনকারী",
    "fullNameEnglish": "Applicant Name",
    "fatherName": "Father",
    "motherName": "Mother",
    "department": "Computer Science",
    "session": "2023-24",
    "shift": "Day",
    "rollNumber": "CS001",
    "registrationNumber": "REG001",
    "email": "applicant@example.com",
    "applicationType": "Testimonial",
    "subject": "Request for Testimonial",
    "message": "I need a testimonial for job application."
  }'
```

**Expected Result:** `201 Created` with application ID

**Verify:**
- Application status is 'pending'
- submittedAt timestamp is set

#### List Applications
```bash
curl http://localhost:8000/api/applications/
```

**Expected Result:** `200 OK` with list of applications

#### Filter Applications by Status
```bash
curl http://localhost:8000/api/applications/?status=pending
```

**Expected Result:** `200 OK` with only pending applications

#### Review Application
```bash
curl -X PUT http://localhost:8000/api/applications/{APP_ID}/review/ \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "reviewedBy": "Admin Name",
    "reviewNotes": "Application approved"
  }'
```

**Expected Result:** `200 OK` with updated application

**Verify:**
- Status changed to 'approved'
- reviewedAt timestamp is set
- reviewedBy and reviewNotes are populated

### ✅ Search and Filtering

#### Search Students
```bash
# Search by name
curl http://localhost:8000/api/students/search/?q=John

# Search by roll number
curl http://localhost:8000/api/students/search/?q=CS001
```

**Expected Result:** All results contain search query

#### Filter Students
```bash
# By department
curl http://localhost:8000/api/students/?department=DEPT_UUID

# By semester
curl http://localhost:8000/api/students/?semester=3

# By status
curl http://localhost:8000/api/students/?status=active

# Multiple filters
curl http://localhost:8000/api/students/?semester=3&status=active
```

**Expected Result:** Only matching students returned

### ✅ Department Management

#### Create Department
```bash
curl -X POST http://localhost:8000/api/departments/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Department",
    "code": "TD"
  }'
```

**Expected Result:** `201 Created` with department object

#### Get Department Students
```bash
# All students
curl http://localhost:8000/api/departments/{DEPT_ID}/students/

# Filter by semester
curl http://localhost:8000/api/departments/{DEPT_ID}/students/?semester=3
```

**Expected Result:** Department info with student list

#### Try to Delete Department with Students
```bash
curl -X DELETE http://localhost:8000/api/departments/{DEPT_ID}/
```

**Expected Result:** `400 Bad Request` if department has students

**Verify:** Department still exists

### ✅ Dashboard Statistics

#### Get Dashboard Stats
```bash
curl http://localhost:8000/api/dashboard/stats/
```

**Expected Result:** `200 OK` with comprehensive statistics

**Verify:**
- Student counts by status, department, semester
- Alumni counts by type, support category, year
- Application counts by status and type

### ✅ Data Persistence

#### Verify PostgreSQL Storage
```bash
# Connect to PostgreSQL
psql -U slms_user -d slms_db

# Check tables
\dt

# Check student count
SELECT COUNT(*) FROM students;

# Check alumni count
SELECT COUNT(*) FROM alumni;

# Check applications count
SELECT COUNT(*) FROM applications;
```

**Expected Result:** All data persists in database

### ✅ Error Handling

#### Test Validation Errors

**Invalid Mobile Number:**
```bash
curl -X POST http://localhost:8000/api/students/ \
  -H "Content-Type: application/json" \
  -d '{...data with "mobileStudent": "123"...}'
```

**Expected Result:** `400 Bad Request` with validation error

**Invalid Semester:**
```bash
curl -X POST http://localhost:8000/api/students/ \
  -H "Content-Type: application/json" \
  -d '{...data with "semester": 10...}'
```

**Expected Result:** `400 Bad Request` with validation error

**Missing Required Fields:**
```bash
curl -X POST http://localhost:8000/api/students/ \
  -H "Content-Type: application/json" \
  -d '{
    "fullNameEnglish": "Test"
  }'
```

**Expected Result:** `400 Bad Request` with field errors

#### Test Business Logic Errors

**Transition Student Without 8 Semesters:**
```bash
curl -X POST http://localhost:8000/api/students/{STUDENT_ID}/transition-to-alumni/ \
  -H "Content-Type: application/json" \
  -d '{"graduationYear": 2024}'
```

**Expected Result:** `400 Bad Request` with error message

**Delete Student with Alumni Record:**
```bash
curl -X DELETE http://localhost:8000/api/students/{ALUMNI_STUDENT_ID}/
```

**Expected Result:** `400 Bad Request` with error message

## Automated Testing

### Run All Tests
```bash
cd server
python manage.py test
```

**Expected Result:** All tests pass

### Run Property-Based Tests
```bash
python manage.py test --tag=property
```

**Expected Result:** All property tests pass (100+ iterations each)

### Run Specific App Tests
```bash
# Students tests
python manage.py test apps.students

# Alumni tests
python manage.py test apps.alumni

# Applications tests
python manage.py test apps.applications

# Documents tests
python manage.py test apps.documents

# Departments tests
python manage.py test apps.departments
```

## Frontend Integration Testing

### 1. Start Both Servers
```bash
# Terminal 1: Django backend
cd server
python manage.py runserver

# Terminal 2: Frontend server
cd client
# Use your preferred method (Live Server, http-server, etc.)
```

### 2. Test Frontend Operations

- [ ] Load student list page
- [ ] Create new student via form
- [ ] Edit existing student
- [ ] Delete student
- [ ] Upload student photo
- [ ] Search students
- [ ] Filter students by department/semester
- [ ] View student details
- [ ] Transition student to alumni
- [ ] View alumni list
- [ ] Submit application
- [ ] View dashboard statistics

### 3. Verify Data Persistence

- [ ] Refresh page - data should persist
- [ ] Restart backend - data should persist
- [ ] Check database directly - data should match UI

## Performance Testing

### Response Time
```bash
# Measure API response time
time curl http://localhost:8000/api/students/
```

**Expected:** < 1 second for typical queries

### Load Testing (Optional)
```bash
# Install Apache Bench
# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:8000/api/students/
```

## Troubleshooting

### Tests Failing

1. Check PostgreSQL is running
2. Verify database credentials in `.env`
3. Run migrations: `python manage.py migrate`
4. Check for syntax errors in code

### API Returning Errors

1. Check Django server logs
2. Verify request format matches documentation
3. Check required fields are provided
4. Verify data types are correct

### File Uploads Failing

1. Check `client/assets/images/` directory exists
2. Verify file permissions
3. Check file size limits
4. Verify file type restrictions

### CORS Errors

1. Verify CORS configuration in `settings.py`
2. Check frontend URL in `CORS_ALLOWED_ORIGINS`
3. Restart Django server after changes

## Test Results Documentation

Create a test results document with:

- Date and time of testing
- Environment details (OS, Python version, Django version)
- Test results for each section
- Any issues encountered
- Screenshots of successful operations
- Performance metrics

## Sign-Off Checklist

- [ ] All CRUD operations work correctly
- [ ] File uploads work and files are stored correctly
- [ ] Alumni transition workflow works
- [ ] Application submission and review works
- [ ] Search and filtering work correctly
- [ ] Department management works
- [ ] Dashboard statistics are accurate
- [ ] Data persists in PostgreSQL
- [ ] Error handling works correctly
- [ ] All automated tests pass
- [ ] Frontend integration works (if applicable)
- [ ] Performance is acceptable
- [ ] Documentation is complete

## Next Steps

After successful integration testing:

1. Document any issues found
2. Fix any bugs discovered
3. Optimize performance if needed
4. Prepare for production deployment
5. Create user documentation
6. Train users on new system

---

**Testing completed by:** _______________

**Date:** _______________

**Status:** _______________

**Notes:** _______________
