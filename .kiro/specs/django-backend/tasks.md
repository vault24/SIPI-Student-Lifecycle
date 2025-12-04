# Implementation Plan

- [x] 1. Set up Django project structure and PostgreSQL configuration



  - Create Django project 'slms_core' with proper directory structure
  - Install required packages: Django, djangorestframework, psycopg2-binary, django-cors-headers, Pillow, python-decouple, hypothesis
  - Configure settings.py for PostgreSQL with environment variables
  - Set up CORS headers for frontend communication
  - Create .env.example file with database configuration template
  - Create utils/file_handler.py for handling file uploads to client/assets/images/
  - Configure file path to save uploads to ../client/assets/images/ (relative to Django project)
  - Create initial README.md with setup instructions
  - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [x] 2. Create Department app and models



  - Create departments Django app
  - Implement Department model with name, code, timestamps
  - Create DepartmentSerializer for API responses
  - Implement DepartmentViewSet with CRUD operations
  - Add URL routing for /api/departments/
  - _Requirements: 10.1, 10.2_

- [x] 2.1 Write property test for department creation


  - **Property 1: Department creation with unique constraints**
  - **Validates: Requirements 10.1**

- [x] 3. Create Student app and comprehensive models


  - Create students Django app
  - Implement Student model with all personal information fields
  - Add contact information fields with JSONField for addresses
  - Add educational background fields
  - Add current academic fields with ForeignKey to Department
  - Add semesterResults and semesterAttendance as JSONField
  - Add discontinued student fields
  - Add profilePhoto CharField to store relative path (e.g., "students/photo123.jpg")
  - Add timestamps and status field
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.10_

- [x] 3.1 Write property test for student model validation



  - **Property 6: Required field validation**
  - **Validates: Requirements 5.1**

- [ ] 3.2 Write property test for address structure
  - **Property 12: Address structure preservation**
  - **Validates: Requirements 2.10**

- [x] 4. Implement Student serializers and validators




  - Create StudentListSerializer for list views
  - Create StudentDetailSerializer for complete data
  - Create StudentCreateSerializer with validation
  - Create StudentUpdateSerializer
  - Implement custom validators for mobile numbers (11 digits)
  - Implement custom validators for semester range (1-8)
  - Implement custom validators for GPA range (0.00-4.00)
  - Implement custom validators for email format
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_



- [ ] 4.1 Write property test for mobile validation
  - **Property 7: Mobile number format validation**

  - **Validates: Requirements 5.3**



- [ ] 4.2 Write property test for semester validation
  - **Property 8: Semester range validation**
  - **Validates: Requirements 5.4**


- [ ] 5. Create Student ViewSet with CRUD operations
  - Implement StudentViewSet with ModelViewSet
  - Add list action with pagination
  - Add create action with validation
  - Add retrieve action for detail view
  - Add update action
  - Add destroy action with alumni check
  - Add filtering by department, semester, status

  - Add search functionality for name, rollNumber, registrationNumber
  - Add ordering by createdAt, fullName, semester
  - Add URL routing for /api/students/

  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_


- [ ] 5.1 Write property test for student creation
  - **Property 1: Student creation completeness**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 3.2**

- [ ] 5.2 Write property test for search functionality
  - **Property 3: Search result consistency**
  - **Validates: Requirements 3.6**

- [x] 6. Implement file upload functionality

  - Add upload_photo custom action to StudentViewSet
  - Implement file type validation (jpg, png)
  - Implement file size validation (max 5MB for images)
  - Use file_handler utility to save files to client/assets/images/students/
  - Store only relative path in database (e.g., "students/photo123.jpg")
  - Return relative path in API response for frontend to use
  - _Requirements: 4.1, 4.3, 4.4, 4.5_

- [x] 6.1 Write property test for file upload validation

  - **Property 4: File upload validation**
  - **Validates: Requirements 4.3, 4.4**

- [x] 7. Create Alumni app and models


  - Create alumni Django app
  - Implement Alumni model with OneToOneField to Student
  - Add alumniType, transitionDate, graduationYear fields
  - Add currentSupportCategory field with choices
  - Add currentPosition as JSONField
  - Add careerHistory as JSONField array
  - Add supportHistory as JSONField array
  - Add timestamps
  - _Requirements: 2.7_



- [ ] 8. Implement Alumni serializers and business logic
  - Create AlumniSerializer with student details
  - Create AlumniStatsSerializer for statistics
  - Create CareerPositionSerializer for career entries
  - Create SupportHistorySerializer for support entries
  - Implement career history sorting by startDate
  - _Requirements: 6.3_


- [x] 8.1 Write property test for career position sorting




  - **Property 11: Career position chronology**
  - **Validates: Requirements 6.3**

- [x] 9. Create Alumni ViewSet with custom actions

  - Implement AlumniViewSet with ModelViewSet

  - Add filtering by alumniType, supportCategory, graduationYear
  - Add add_career_position custom action
  - Add update_support_category custom action
  - Add stats custom action for statistics
  - Add URL routing for /api/alumni/
  - _Requirements: 3.7, 6.3, 6.4, 6.5_


- [x] 10. Implement student to alumni transition


  - Add transition_to_alumni custom action to StudentViewSet
  - Validate 8 semesters completion before transition

  - Create Alumni record with initial data
  - Update Student status to 'graduated'
  - Add initial support history entry
  - _Requirements: 6.1, 6.2, 5.7_

- [x] 10.1 Write property test for alumni transition

  - **Property 2: Alumni transition validation**
  - **Validates: Requirements 6.1, 5.7**

- [x] 10.2 Write property test for alumni deletion prevention

  - **Property 5: Alumni deletion prevention**
  - **Validates: Requirements 3.5, 6.6**

- [x] 11. Create Applications app and models



  - Create applications Django app
  - Implement Application model with all form fields
  - Add status field with choices (pending, approved, rejected)
  - Add submittedAt, reviewedAt, reviewedBy, reviewNotes fields
  - Add applicationType field with choices
  - _Requirements: 2.8_

- [x] 12. Implement Application serializers and ViewSet


  - Create ApplicationSubmitSerializer for public submissions
  - Create ApplicationSerializer for complete data
  - Create ApplicationReviewSerializer for admin review
  - Implement ApplicationViewSet with ModelViewSet
  - Add submit custom action (no authentication required)
  - Add review custom action for status updates
  - Add filtering by status, applicationType, department
  - Add URL routing for /api/applications/
  - _Requirements: 3.8, 7.1, 7.2, 7.3, 7.4_

- [x] 12.1 Write property test for application submission


  - **Property 10: Application submission idempotency**
  - **Validates: Requirements 7.1, 7.2**

- [x] 13. Create Documents app and file management


  - Create documents Django app
  - Implement Document model with ForeignKey to Student
  - Add fileName, fileType, category, filePath (CharField), fileSize, uploadDate fields
  - Add category choices (NID, Marksheet, Certificate, etc.)
  - filePath will store relative path (e.g., "documents/doc123.pdf")
  - _Requirements: 2.9_

- [x] 14. Implement Document serializers and ViewSet


  - Create DocumentSerializer with filePath field
  - Create DocumentUploadSerializer for uploads
  - Implement DocumentViewSet with ModelViewSet
  - Add file upload handling in create action using file_handler utility
  - Save files to client/assets/images/documents/
  - Store only relative path in database (e.g., "documents/doc123.pdf")
  - Implement file type validation (pdf)
  - Implement file size validation (max 10MB)
  - Add filtering by student, category
  - Override destroy to delete physical file from client/assets/images/documents/
  - Add URL routing for /api/documents/
  - _Requirements: 3.9, 4.2, 4.3, 4.4, 4.6_

- [x] 14.1 Write property test for document file cleanup


  - **Property 14: Document file cleanup**

  - **Validates: Requirements 4.6**

- [x] 15. Implement semester results and attendance management


  - Add validation for semesterResults structure (gpa/cgpa OR referredSubjects)
  - Add validation for semesterAttendance structure
  - Implement average attendance calculation
  - Add custom endpoints for semester data retrieval
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 15.1 Write property test for semester results structure


  - **Property 13: Semester results structure validation**
  - **Validates: Requirements 9.1**

- [x] 16. Create Dashboard app for statistics


  - Create dashboard Django app
  - Implement DashboardStatsView APIView
  - Add total students count by status
  - Add students count by department
  - Add students count by semester
  - Add alumni statistics aggregation
  - Add application statistics by status
  - Add URL routing for /api/dashboard/stats/
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 17. Implement department student management


  - Add students custom action to DepartmentViewSet
  - Implement filtering by semester within department
  - Add department deletion protection (check for enrolled students)
  - _Requirements: 10.3, 10.4_

- [x] 17.1 Write property test for department deletion protection


  - **Property 9: Department deletion protection**
  - **Validates: Requirements 10.4**

- [x] 18. Add student disconnect studies functionality


  - Add disconnect_studies custom action to StudentViewSet
  - Update status to 'discontinued'
  - Set discontinuedReason and lastSemester fields
  - Validate reason is provided
  - _Requirements: 2.6_

- [x] 19. Configure CORS and finalize settings


  - Configure django-cors-headers in settings
  - Add frontend origin to CORS_ALLOWED_ORIGINS
  - Configure CORS_ALLOW_CREDENTIALS if needed
  - Test CORS headers in responses
  - _Requirements: 1.5_

- [x] 19.1 Write property test for CORS headers


  - **Property 15: CORS header presence**
  - **Validates: Requirements 1.5**

- [x] 20. Create database migrations and seed data



  - Run makemigrations for all apps
  - Run migrate to create database tables
  - Create management command for seeding departments
  - Create management command for generating sample data (optional)
  - _Requirements: 1.3_


- [x] 21. Write comprehensive API documentation

  - Document all endpoints in README.md
  - Add example requests and responses for each endpoint
  - Document error response formats
  - Add PostgreSQL setup instructions
  - Add environment variable configuration guide
  - Add migration and server startup instructions
  - _Requirements: 8.4, 8.5_

- [x] 22. Update frontend API calls


  - Create new API service module in frontend (client/js/api/backend.js)
  - Replace dataManager.getStudents() with fetch to /api/students/
  - Replace dataManager.addStudent() with POST to /api/students/
  - Replace dataManager.updateStudent() with PUT to /api/students/{id}/
  - Replace dataManager.deleteStudent() with DELETE to /api/students/{id}/
  - Update all alumni-related calls to use /api/alumni/ endpoints
  - Update all application-related calls to use /api/applications/ endpoints
  - Update all document-related calls to use /api/documents/ endpoints
  - Update all department-related calls to use /api/departments/ endpoints
  - Handle API errors and display appropriate messages
  - Update file upload forms to use FormData and multipart/form-data
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_


- [x] 23. Test complete integration

  - Test student CRUD operations from frontend
  - Test file uploads (photos and documents)
  - Test alumni transition workflow
  - Test application submission and review
  - Test search and filtering
  - Test department management
  - Verify all data persists in PostgreSQL
  - Verify error handling displays correctly
  - _Requirements: All_

- [x] 24. Final checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.
