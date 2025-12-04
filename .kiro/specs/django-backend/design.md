# Design Document

## Overview

The Django backend will be a REST API server that provides data persistence and business logic for the Student Learning Management System (SLMS). It will replace the current localStorage-based data management with a robust PostgreSQL database backend. The system will use Django REST Framework for API development, support file uploads for student photos and documents, and provide comprehensive CRUD operations for all entities.

The backend will be organized into modular Django apps following the separation of concerns principle, with each app handling a specific domain (students, alumni, applications, etc.). All API responses will be in JSON format, and CORS will be configured to allow the existing frontend to communicate with the backend.

## Architecture

### Technology Stack

- **Framework**: Django 4.2+ with Django REST Framework 3.14+
- **Database**: PostgreSQL 14+
- **File Storage**: Files stored in `client/assets/images/`, database stores relative paths only
- **Environment Management**: python-decouple for environment variables
- **CORS**: django-cors-headers for cross-origin requests
- **Image Processing**: Pillow for image validation and processing

### Project Structure

```
server/
├── manage.py
├── requirements.txt
├── .env.example
├── README.md
├── slms_core/              # Main project configuration
│   ├── __init__.py
│   ├── settings.py         # Django settings with PostgreSQL config
│   ├── urls.py             # Root URL configuration
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── students/           # Student management
│   │   ├── models.py       # Student model
│   │   ├── serializers.py  # Student serializers
│   │   ├── views.py        # Student viewsets
│   │   ├── urls.py         # Student routes
│   │   └── validators.py   # Custom validators
│   ├── alumni/             # Alumni management
│   │   ├── models.py       # Alumni, CareerPosition models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── applications/       # Application submissions
│   │   ├── models.py       # Application model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── departments/        # Department management
│   │   ├── models.py       # Department model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── documents/          # Document management
│   │   ├── models.py       # Document model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── dashboard/          # Dashboard statistics
│       ├── views.py        # Stats aggregation
│       └── urls.py
└── utils/                  # Utility functions
    └── file_handler.py     # File upload to client/assets/images/
```

### API Design

All API endpoints will follow RESTful conventions:

- Base URL: `http://localhost:8000/api/`
- Authentication: Not required for initial version (can be added later)
- Response Format: JSON
- Error Format: `{"error": "message", "details": {...}}`

## Components and Interfaces

### 1. Student Management App

**Models:**

- `Student`: Main student model with all personal, contact, educational, and academic fields
  - Personal: fullNameBangla, fullNameEnglish, fatherName, fatherNID, motherName, motherNID, dateOfBirth, birthCertificateNo, nidNumber, gender, religion, bloodGroup, maritalStatus
  - Contact: mobileStudent, guardianMobile, email, emergencyContact, presentAddress (JSONField), permanentAddress (JSONField)
  - Educational: highestExam, board, group, rollNumber, registrationNumber, passingYear, gpa, institutionName
  - Current Academic: currentRollNumber, currentRegistrationNumber, semester, department (ForeignKey), session, shift, currentGroup, status, enrollmentDate
  - Academic Records: semesterResults (JSONField), semesterAttendance (JSONField)
  - Discontinued: discontinuedReason, lastSemester
  - Media: profilePhoto (CharField storing relative path to client/assets/images/)
  - Timestamps: createdAt, updatedAt

**Serializers:**

- `StudentListSerializer`: Lightweight serializer for list views (id, fullName, rollNumber, semester, department, status)
- `StudentDetailSerializer`: Complete serializer with all fields and nested data
- `StudentCreateSerializer`: Serializer for creating students with validation
- `StudentUpdateSerializer`: Serializer for updating students

**ViewSets:**

- `StudentViewSet`: ModelViewSet providing list, create, retrieve, update, destroy
  - Custom actions: `upload_photo`, `transition_to_alumni`, `disconnect_studies`
  - Filtering: department, semester, status
  - Search: fullName, rollNumber, registrationNumber
  - Ordering: createdAt, fullName, semester

**Endpoints:**

- `GET /api/students/` - List students with pagination and filters
- `POST /api/students/` - Create new student
- `GET /api/students/{id}/` - Get student details
- `PUT /api/students/{id}/` - Update student
- `DELETE /api/students/{id}/` - Delete student (with alumni check)
- `GET /api/students/search/?q={query}` - Search students
- `POST /api/students/{id}/upload-photo/` - Upload profile photo (saves to client/assets/images/students/, stores path in DB)
- `POST /api/students/{id}/transition-to-alumni/` - Transition to alumni
- `POST /api/students/{id}/disconnect-studies/` - Mark as discontinued

### 2. Alumni Management App

**Models:**

- `Alumni`: Alumni record linked to Student
  - studentId (OneToOneField to Student)
  - alumniType (choices: 'recent', 'established')
  - transitionDate
  - graduationYear
  - currentSupportCategory (choices: 'receiving_support', 'needs_extra_support', 'no_support_needed')
  - currentPosition (JSONField)
  - careerHistory (JSONField array)
  - supportHistory (JSONField array)
  - createdAt, updatedAt

**Serializers:**

- `AlumniSerializer`: Complete alumni data with student details
- `AlumniStatsSerializer`: Statistics aggregation
- `CareerPositionSerializer`: For career history entries
- `SupportHistorySerializer`: For support history entries

**ViewSets:**

- `AlumniViewSet`: ModelViewSet for alumni CRUD
  - Custom actions: `add_career_position`, `update_support_category`, `stats`
  - Filtering: alumniType, supportCategory, graduationYear, positionType

**Endpoints:**

- `GET /api/alumni/` - List alumni with filters
- `POST /api/alumni/` - Create alumni (usually via student transition)
- `GET /api/alumni/{id}/` - Get alumni details
- `PUT /api/alumni/{id}/` - Update alumni
- `POST /api/alumni/{id}/add-career-position/` - Add career position
- `PUT /api/alumni/{id}/update-support-category/` - Update support status
- `GET /api/alumni/stats/` - Get alumni statistics

### 3. Applications App

**Models:**

- `Application`: Student application submissions
  - fullNameBangla, fullNameEnglish
  - fatherName, motherName
  - department, session, shift
  - rollNumber, registrationNumber, email
  - applicationType (choices: 'Testimonial', 'Certificate', 'Stipend', etc.)
  - subject, message
  - status (choices: 'pending', 'approved', 'rejected')
  - submittedAt, reviewedAt, reviewedBy, reviewNotes

**Serializers:**

- `ApplicationSubmitSerializer`: For public submissions
- `ApplicationSerializer`: Complete application data
- `ApplicationReviewSerializer`: For admin review

**ViewSets:**

- `ApplicationViewSet`: ModelViewSet for applications
  - Custom actions: `submit` (public), `review` (admin)
  - Filtering: status, applicationType, department

**Endpoints:**

- `GET /api/applications/` - List applications
- `POST /api/applications/submit/` - Submit application (public)
- `GET /api/applications/{id}/` - Get application details
- `PUT /api/applications/{id}/review/` - Review application
- `DELETE /api/applications/{id}/` - Delete application

### 4. Departments App

**Models:**

- `Department`: Department/program information
  - name (unique)
  - code (unique)
  - createdAt, updatedAt

**Serializers:**

- `DepartmentSerializer`: Department data
- `DepartmentWithStudentsSerializer`: Department with student count

**ViewSets:**

- `DepartmentViewSet`: ModelViewSet for departments
  - Custom actions: `students` (get students by department and semester)

**Endpoints:**

- `GET /api/departments/` - List departments
- `POST /api/departments/` - Create department
- `GET /api/departments/{id}/` - Get department details
- `PUT /api/departments/{id}/` - Update department
- `DELETE /api/departments/{id}/` - Delete department (with student check)
- `GET /api/departments/{id}/students/` - Get department students

### 5. Documents App

**Models:**

- `Document`: Uploaded documents
  - student (ForeignKey to Student)
  - fileName
  - fileType
  - category (choices: 'NID', 'Marksheet', 'Certificate', etc.)
  - filePath (CharField storing relative path to client/assets/images/documents/)
  - fileSize
  - uploadDate

**Serializers:**

- `DocumentSerializer`: Document data with file URL
- `DocumentUploadSerializer`: For file uploads

**ViewSets:**

- `DocumentViewSet`: ModelViewSet for documents
  - Filtering: student, category

**Endpoints:**

- `GET /api/documents/` - List documents
- `POST /api/documents/` - Upload document (saves to client/assets/images/documents/, stores path in DB)
- `GET /api/documents/{id}/` - Get document details
- `DELETE /api/documents/{id}/` - Delete document (removes file from client/assets/images/documents/)

### 6. Dashboard App

**Views:**

- `DashboardStatsView`: APIView for dashboard statistics
  - Total students by status
  - Students by department
  - Students by semester
  - Alumni statistics
  - Application statistics

**Endpoints:**

- `GET /api/dashboard/stats/` - Get dashboard statistics

## Data Models

### Student Model Schema

```python
class Student(models.Model):
    # Personal Information
    fullNameBangla = models.CharField(max_length=255)
    fullNameEnglish = models.CharField(max_length=255)
    fatherName = models.CharField(max_length=255)
    fatherNID = models.CharField(max_length=20)
    motherName = models.CharField(max_length=255)
    motherNID = models.CharField(max_length=20)
    dateOfBirth = models.DateField()
    birthCertificateNo = models.CharField(max_length=50)
    nidNumber = models.CharField(max_length=20, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    religion = models.CharField(max_length=50, blank=True)
    bloodGroup = models.CharField(max_length=5, blank=True)
    maritalStatus = models.CharField(max_length=20, blank=True)
    
    # Contact Information
    mobileStudent = models.CharField(max_length=11)
    guardianMobile = models.CharField(max_length=11)
    email = models.EmailField(blank=True)
    emergencyContact = models.CharField(max_length=255)
    presentAddress = models.JSONField()
    permanentAddress = models.JSONField()
    
    # Educational Background
    highestExam = models.CharField(max_length=100)
    board = models.CharField(max_length=100)
    group = models.CharField(max_length=50)
    rollNumber = models.CharField(max_length=50)
    registrationNumber = models.CharField(max_length=50)
    passingYear = models.IntegerField()
    gpa = models.DecimalField(max_digits=4, decimal_places=2)
    institutionName = models.CharField(max_length=255, blank=True)
    
    # Current Academic Information
    currentRollNumber = models.CharField(max_length=50, unique=True)
    currentRegistrationNumber = models.CharField(max_length=50, unique=True)
    semester = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(8)])
    department = models.ForeignKey('departments.Department', on_delete=models.PROTECT)
    session = models.CharField(max_length=20)
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)
    currentGroup = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    enrollmentDate = models.DateField()
    
    # Academic Records
    semesterResults = models.JSONField(default=list)
    semesterAttendance = models.JSONField(default=list)
    
    # Discontinued Fields
    discontinuedReason = models.TextField(blank=True)
    lastSemester = models.IntegerField(null=True, blank=True)
    
    # Media (stores relative path to client/assets/images/)
    profilePhoto = models.CharField(max_length=500, blank=True)
    
    # Timestamps
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
```

### Alumni Model Schema

```python
class Alumni(models.Model):
    student = models.OneToOneField('students.Student', on_delete=models.PROTECT)
    alumniType = models.CharField(max_length=20, choices=ALUMNI_TYPE_CHOICES)
    transitionDate = models.DateTimeField()
    graduationYear = models.IntegerField()
    currentSupportCategory = models.CharField(max_length=30, choices=SUPPORT_CATEGORY_CHOICES)
    currentPosition = models.JSONField(null=True, blank=True)
    careerHistory = models.JSONField(default=list)
    supportHistory = models.JSONField(default=list)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
```

### Application Model Schema

```python
class Application(models.Model):
    fullNameBangla = models.CharField(max_length=255)
    fullNameEnglish = models.CharField(max_length=255)
    fatherName = models.CharField(max_length=255)
    motherName = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    session = models.CharField(max_length=20)
    shift = models.CharField(max_length=20)
    rollNumber = models.CharField(max_length=50)
    registrationNumber = models.CharField(max_length=50)
    email = models.EmailField(blank=True)
    applicationType = models.CharField(max_length=50, choices=APPLICATION_TYPE_CHOICES)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    submittedAt = models.DateTimeField(auto_now_add=True)
    reviewedAt = models.DateTimeField(null=True, blank=True)
    reviewedBy = models.CharField(max_length=255, blank=True)
    reviewNotes = models.TextField(blank=True)
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Student creation completeness
*For any* valid student data submitted via POST /api/students/, the created student record should contain all provided fields and return HTTP 201 with the complete student object including auto-generated id and timestamps
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 3.2**

### Property 2: Alumni transition validation
*For any* student record, transitioning to alumni should only succeed if all 8 semesters exist in semesterResults, and should fail with HTTP 400 otherwise
**Validates: Requirements 6.1, 5.7**

### Property 3: Search result consistency
*For any* search query, all returned student records should contain the query string in either fullNameEnglish, currentRollNumber, or currentRegistrationNumber (case-insensitive)
**Validates: Requirements 3.6**

### Property 4: File upload validation
*For any* file upload request, files exceeding size limits (5MB for images, 10MB for documents) or with invalid types should be rejected with HTTP 400
**Validates: Requirements 4.3, 4.4**

### Property 5: Alumni deletion prevention
*For any* student with an associated alumni record, DELETE requests to /api/students/{id}/ should return HTTP 400 and preserve both student and alumni records
**Validates: Requirements 3.5, 6.6**

### Property 6: Required field validation
*For any* POST or PUT request with missing required fields, the system should return HTTP 400 with specific field error messages
**Validates: Requirements 5.1**

### Property 7: Mobile number format validation
*For any* student data with mobileStudent or guardianMobile fields, values not matching the 11-digit pattern should be rejected with HTTP 400
**Validates: Requirements 5.3**

### Property 8: Semester range validation
*For any* student data with semester field, values outside the range 1-8 should be rejected with HTTP 400
**Validates: Requirements 5.4**

### Property 9: Department deletion protection
*For any* department with enrolled students, DELETE requests to /api/departments/{id}/ should return HTTP 400 and preserve the department
**Validates: Requirements 10.4**

### Property 10: Application submission idempotency
*For any* valid application data, submitting via POST /api/applications/submit/ should create exactly one application record and return a unique application ID
**Validates: Requirements 7.1, 7.2**

### Property 11: Career position chronology
*For any* alumni record, when a new career position is added, the careerHistory array should be sorted by startDate in descending order (most recent first)
**Validates: Requirements 6.3**

### Property 12: Address structure preservation
*For any* student with presentAddress or permanentAddress, the stored JSON should contain all required fields (division, district, subDistrict, policeStation, postOffice, municipality, village, ward)
**Validates: Requirements 2.10**

### Property 13: Semester results structure validation
*For any* semester result entry, it should contain either (semester, gpa, cgpa) for passed semesters OR (semester, referredSubjects array) for referred semesters, but not both
**Validates: Requirements 9.1**

### Property 14: Document file cleanup
*For any* document deletion via DELETE /api/documents/{id}/, both the database record and the physical file should be removed from client/assets/images/documents/
**Validates: Requirements 4.6**

### Property 15: CORS header presence
*For any* API request from the frontend origin, the response should include appropriate CORS headers allowing the request
**Validates: Requirements 1.5**

## Error Handling

### HTTP Status Codes

- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests
- **400 Bad Request**: Validation errors, business logic violations
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Unexpected server errors

### Error Response Format

```json
{
  "error": "Validation failed",
  "details": {
    "mobileStudent": ["Ensure this field has exactly 11 digits."],
    "semester": ["Ensure this value is less than or equal to 8."]
  }
}
```

### Validation Error Handling

- All serializers will use Django REST Framework's built-in validation
- Custom validators will be created for:
  - Mobile number format (11 digits)
  - Semester range (1-8)
  - GPA range (0.00-4.00)
  - File size and type validation
  - Alumni transition eligibility

### Business Logic Error Handling

- Alumni transition: Check for 8 completed semesters
- Student deletion: Check for alumni record
- Department deletion: Check for enrolled students
- File uploads: Validate size and type before saving

## Testing Strategy

### Unit Testing

Unit tests will verify specific functionality of individual components:

- Model validation (field constraints, choices)
- Serializer validation (required fields, format validation)
- Custom validator functions (mobile format, semester range)
- File upload validation logic
- Alumni transition eligibility check
- Department deletion protection logic

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **Hypothesis** (Python property-based testing library). Each test will run a minimum of 100 iterations with randomly generated data.

**Property Test 1: Student Creation Completeness**
- Generate random valid student data
- POST to /api/students/
- Verify response is 201 and all fields are present in response
- **Validates: Property 1**

**Property Test 2: Alumni Transition Validation**
- Generate random student with varying semester counts (0-8)
- POST to /api/students/{id}/transition-to-alumni/
- Verify success only when 8 semesters exist, failure otherwise
- **Validates: Property 2**

**Property Test 3: Search Result Consistency**
- Generate random students with various names and roll numbers
- Generate random search queries
- GET /api/students/search/?q={query}
- Verify all results contain the query string
- **Validates: Property 3**

**Property Test 4: File Upload Validation**
- Generate random files with varying sizes and types
- POST to /api/students/{id}/upload-photo/
- Verify rejection for oversized or invalid type files
- **Validates: Property 4**

**Property Test 5: Alumni Deletion Prevention**
- Generate random student with/without alumni record
- DELETE /api/students/{id}/
- Verify failure for students with alumni, success otherwise
- **Validates: Property 5**

**Property Test 6: Required Field Validation**
- Generate random student data with randomly omitted required fields
- POST to /api/students/
- Verify 400 response with field-specific errors
- **Validates: Property 6**

**Property Test 7: Mobile Number Format Validation**
- Generate random mobile numbers (valid 11-digit and invalid formats)
- POST to /api/students/ with mobile data
- Verify rejection for non-11-digit numbers
- **Validates: Property 7**

**Property Test 8: Semester Range Validation**
- Generate random semester values (including out-of-range)
- POST to /api/students/ with semester data
- Verify rejection for values outside 1-8
- **Validates: Property 8**

**Property Test 9: Department Deletion Protection**
- Generate random department with/without students
- DELETE /api/departments/{id}/
- Verify failure when students exist, success otherwise
- **Validates: Property 9**

**Property Test 10: Application Submission Idempotency**
- Generate random valid application data
- POST to /api/applications/submit/
- Verify exactly one record created with unique ID
- **Validates: Property 10**

**Property Test 11: Career Position Chronology**
- Generate random alumni with multiple career positions
- POST to /api/alumni/{id}/add-career-position/
- Verify careerHistory is sorted by startDate descending
- **Validates: Property 11**

**Property Test 12: Address Structure Preservation**
- Generate random address data with all required fields
- POST to /api/students/ with address data
- Verify stored JSON contains all address fields
- **Validates: Property 12**

**Property Test 13: Semester Results Structure Validation**
- Generate random semester results (passed and referred)
- POST to /api/students/ with semesterResults
- Verify each entry has correct structure (gpa/cgpa OR referredSubjects)
- **Validates: Property 13**

**Property Test 14: Document File Cleanup**
- Generate random document with file in client/assets/images/documents/
- DELETE /api/documents/{id}/
- Verify both DB record and file are removed from client/assets/images/documents/
- **Validates: Property 14**

**Property Test 15: CORS Header Presence**
- Generate random API requests from frontend origin
- Verify all responses include CORS headers
- **Validates: Property 15**

### Integration Testing

Integration tests will verify end-to-end workflows:

- Complete student lifecycle (create → update → transition to alumni → prevent deletion)
- Application submission and review workflow
- Document upload and retrieval
- Department management with student enrollment
- Alumni career tracking workflow

### Test Configuration

- Use Django's TestCase for database tests
- Use APITestCase for API endpoint tests
- Use Hypothesis for property-based tests
- Configure test database (PostgreSQL)
- Mock file uploads for faster tests
- Use factory_boy for test data generation
