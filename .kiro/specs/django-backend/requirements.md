# Requirements Document

## Introduction

This document specifies the requirements for a Django REST API backend that will replace the current localStorage-based data management system in the Student Learning Management System (SLMS). The backend will provide a PostgreSQL-backed API that supports all existing frontend features including student management, alumni tracking, applications, documents, marks, and attendance.

## Glossary

- **SLMS**: Student Learning Management System - the web application for managing student data
- **Django Backend**: The Python Django REST API server that will handle all data operations
- **PostgreSQL**: The relational database management system used for data persistence
- **Frontend**: The existing HTML/CSS/JavaScript client application
- **API Endpoint**: A URL path that accepts HTTP requests and returns JSON responses
- **CORS**: Cross-Origin Resource Sharing - mechanism to allow frontend to make requests to backend
- **Model**: Django ORM class representing a database table
- **Serializer**: Django REST Framework class for converting models to/from JSON
- **ViewSet**: Django REST Framework class for handling CRUD operations
- **Media Files**: Uploaded files such as student photos and documents

## Requirements

### Requirement 1

**User Story:** As a system administrator, I want a Django backend with PostgreSQL database, so that student data persists reliably and can be accessed by multiple users.

#### Acceptance Criteria

1. WHEN the Django project is initialized THEN the system SHALL create a project structure with separate apps for students, alumni, applications, departments, documents, attendance, and dashboard
2. WHEN database settings are configured THEN the system SHALL use PostgreSQL as the ONLY database engine with credentials loaded from environment variables
3. WHEN migrations are run THEN the system SHALL create all necessary database tables matching the frontend data models
4. WHEN the server starts THEN the system SHALL serve API endpoints on a configurable port
5. WHEN CORS is configured THEN the system SHALL allow requests from the frontend origin

### Requirement 2

**User Story:** As a developer, I want Django models that match all frontend data structures, so that no data fields are lost during migration.

#### Acceptance Criteria

1. WHEN the Student model is defined THEN the system SHALL include all personal information fields (fullNameBangla, fullNameEnglish, fatherName, fatherNID, motherName, motherNID, dateOfBirth, birthCertificateNo, nidNumber, gender, religion, bloodGroup, maritalStatus)
2. WHEN the Student model is defined THEN the system SHALL include all contact fields (mobileStudent, guardianMobile, email, emergencyContact, presentAddress, permanentAddress)
3. WHEN the Student model is defined THEN the system SHALL include all educational background fields (highestExam, board, group, rollNumber, registrationNumber, passingYear, gpa, institutionName)
4. WHEN the Student model is defined THEN the system SHALL include all current academic fields (currentRollNumber, currentRegistrationNumber, semester, department, session, shift, currentGroup, status, enrollmentDate)
5. WHEN the Student model is defined THEN the system SHALL include nested JSON fields for semesterResults and semesterAttendance arrays
6. WHEN the Student model is defined THEN the system SHALL include fields for discontinued students (discontinuedReason, lastSemester)
7. WHEN the Alumni model is defined THEN the system SHALL include fields for alumniType, transitionDate, graduationYear, careerHistory, supportHistory, currentSupportCategory, and currentPosition
8. WHEN the Application model is defined THEN the system SHALL include all form fields (fullNameBangla, fullNameEnglish, fatherName, motherName, department, session, shift, rollNumber, registrationNumber, email, applicationType, subject, message, status, submittedAt, reviewedAt, reviewedBy, reviewNotes)
9. WHEN the Document model is defined THEN the system SHALL include fields for studentId, fileName, fileType, category, uploadDate, fileSize, and fileUrl
10. WHEN address fields are stored THEN the system SHALL use JSON fields to store structured address data (division, district, subDistrict, policeStation, postOffice, municipality, village, ward)

### Requirement 3

**User Story:** As a frontend developer, I want RESTful API endpoints for all CRUD operations, so that I can replace localStorage calls with API calls.

#### Acceptance Criteria

1. WHEN a GET request is made to /api/students/ THEN the system SHALL return a paginated list of all students with optional filtering by department, semester, and status
2. WHEN a POST request is made to /api/students/ with valid data THEN the system SHALL create a new student record and return the created student with HTTP 201 status
3. WHEN a GET request is made to /api/students/{id}/ THEN the system SHALL return the complete student record including all nested data
4. WHEN a PUT request is made to /api/students/{id}/ with valid data THEN the system SHALL update the student record and return the updated student
5. WHEN a DELETE request is made to /api/students/{id}/ THEN the system SHALL delete the student record unless the student is an alumni
6. WHEN a GET request is made to /api/students/search/?q={query} THEN the system SHALL return students matching the query in name, rollNumber, or registrationNumber
7. WHEN endpoints are created for alumni THEN the system SHALL provide GET, POST, PUT operations at /api/alumni/
8. WHEN endpoints are created for applications THEN the system SHALL provide GET, POST, PUT, DELETE operations at /api/applications/
9. WHEN endpoints are created for documents THEN the system SHALL provide GET, POST, DELETE operations at /api/documents/
10. WHEN endpoints are created for departments THEN the system SHALL provide GET, POST, PUT, DELETE operations at /api/departments/

### Requirement 4

**User Story:** As a student, I want to upload profile photos and documents, so that my records are complete with supporting files.

#### Acceptance Criteria

1. WHEN a POST request is made to /api/students/{id}/upload-photo/ with an image file THEN the system SHALL save the file to client/assets/images/students/ and store the relative path in the student's profilePhoto field
2. WHEN a POST request is made to /api/documents/ with a file THEN the system SHALL save the file to client/assets/images/documents/ and create a document record with the relative file path
3. WHEN files are uploaded THEN the system SHALL validate file types (images: jpg, png; documents: pdf)
4. WHEN files are uploaded THEN the system SHALL validate file sizes (max 5MB for images, max 10MB for documents)
5. WHEN a GET request is made for a student or document THEN the system SHALL return the relative file path that the frontend can use to display the file
6. WHEN a document is deleted THEN the system SHALL remove both the database record and the physical file from client/assets/images/documents/

### Requirement 5

**User Story:** As a system administrator, I want data validation on all API endpoints, so that invalid data cannot corrupt the database.

#### Acceptance Criteria

1. WHEN required fields are missing in a POST/PUT request THEN the system SHALL return HTTP 400 with error details
2. WHEN email format is invalid THEN the system SHALL return HTTP 400 with validation error
3. WHEN mobile numbers do not match the 11-digit pattern THEN the system SHALL return HTTP 400 with validation error
4. WHEN semester values are outside 1-8 range THEN the system SHALL return HTTP 400 with validation error
5. WHEN GPA values are outside 0.00-4.00 range THEN the system SHALL return HTTP 400 with validation error
6. WHEN date fields have invalid formats THEN the system SHALL return HTTP 400 with validation error
7. WHEN a student is transitioned to alumni without completing 8 semesters THEN the system SHALL return HTTP 400 with error message

### Requirement 6

**User Story:** As a system administrator, I want alumni management features, so that graduated students can be tracked separately.

#### Acceptance Criteria

1. WHEN a POST request is made to /api/students/{id}/transition-to-alumni/ THEN the system SHALL verify 8 semesters are complete before creating an alumni record
2. WHEN an alumni record is created THEN the system SHALL set alumniType to 'recent', create initial support history, and update student status to 'graduated'
3. WHEN a POST request is made to /api/alumni/{id}/add-career-position/ THEN the system SHALL add a career position to the alumni's careerHistory
4. WHEN a PUT request is made to /api/alumni/{id}/update-support-category/ THEN the system SHALL update currentSupportCategory and add an entry to supportHistory
5. WHEN a GET request is made to /api/alumni/stats/ THEN the system SHALL return statistics grouped by alumniType, supportCategory, positionType, and graduationYear
6. WHEN a student with alumni status is deleted THEN the system SHALL return HTTP 400 preventing deletion

### Requirement 7

**User Story:** As a student, I want to submit applications without logging in, so that I can request documents easily.

#### Acceptance Criteria

1. WHEN a POST request is made to /api/applications/submit/ without authentication THEN the system SHALL create an application with 'pending' status
2. WHEN an application is submitted THEN the system SHALL return the application ID for tracking
3. WHEN a GET request is made to /api/applications/?status={status} THEN the system SHALL return applications filtered by status
4. WHEN a PUT request is made to /api/applications/{id}/review/ THEN the system SHALL update status, reviewedAt, reviewedBy, and reviewNotes fields

### Requirement 8

**User Story:** As a developer, I want comprehensive API documentation, so that I can integrate the frontend easily.

#### Acceptance Criteria

1. WHEN Django REST Framework is installed THEN the system SHALL provide browsable API at /api/
2. WHEN API endpoints are accessed THEN the system SHALL return consistent JSON response formats
3. WHEN errors occur THEN the system SHALL return appropriate HTTP status codes (400, 404, 500) with error messages
4. WHEN the README is created THEN the system SHALL include setup instructions for PostgreSQL, environment variables, and running migrations
5. WHEN the README is created THEN the system SHALL include example API requests for all major endpoints

### Requirement 9

**User Story:** As a system administrator, I want marks and attendance management, so that academic records are tracked.

#### Acceptance Criteria

1. WHEN semester results are stored THEN the system SHALL support both GPA-based results and referred subject lists
2. WHEN semester attendance is stored THEN the system SHALL store subject-wise attendance with present/total counts
3. WHEN a GET request is made to /api/students/{id}/semester-results/ THEN the system SHALL return all semester results for that student
4. WHEN a GET request is made to /api/students/{id}/semester-attendance/ THEN the system SHALL return all semester attendance for that student
5. WHEN semester data is updated THEN the system SHALL calculate average attendance percentages automatically

### Requirement 10

**User Story:** As a system administrator, I want department management, so that I can organize students by their programs.

#### Acceptance Criteria

1. WHEN a GET request is made to /api/departments/ THEN the system SHALL return all departments with id, name, and code
2. WHEN a GET request is made to /api/departments/{id}/students/ THEN the system SHALL return all students in that department
3. WHEN a GET request is made to /api/departments/{id}/students/?semester={sem} THEN the system SHALL return students filtered by semester
4. WHEN a department is deleted THEN the system SHALL prevent deletion if students are enrolled in that department
