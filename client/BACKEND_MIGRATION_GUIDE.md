# Backend API Migration Guide

This guide explains how to migrate from localStorage-based data management to the Django REST API backend.

## Overview

The new `backend.js` module provides a complete API client for interacting with the Django backend. It replaces the localStorage-based `dataManager` with actual HTTP requests.

## Setup

### 1. Start the Django Backend

```bash
cd server
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### 2. Import the API Module

```javascript
import backendAPI from './api/backend.js';
// Or import specific APIs
import { studentsAPI, alumniAPI } from './api/backend.js';
```

## Migration Examples

### Students

#### Before (localStorage)
```javascript
// Get all students
const students = dataManager.getStudents();

// Add student
const newStudent = dataManager.addStudent(studentData);

// Update student
dataManager.updateStudent(studentId, updatedData);

// Delete student
dataManager.deleteStudent(studentId);
```

#### After (Backend API)
```javascript
// Get all students
const response = await studentsAPI.getAll();
const students = response.results;

// Add student
const newStudent = await studentsAPI.create(studentData);

// Update student
const updated = await studentsAPI.update(studentId, updatedData);

// Delete student
await studentsAPI.delete(studentId);
```

### Alumni

#### Before (localStorage)
```javascript
const alumni = dataManager.getAlumni();
dataManager.updateAlumni(alumniId, data);
```

#### After (Backend API)
```javascript
const response = await alumniAPI.getAll();
const alumni = response.results;
await alumniAPI.update(alumniId, data);
```

### Applications

#### Before (localStorage)
```javascript
const applications = dataManager.getApplications();
dataManager.addApplication(appData);
```

#### After (Backend API)
```javascript
const response = await applicationsAPI.getAll();
const applications = response.results;
await applicationsAPI.submit(appData);
```

### Documents

#### Before (localStorage)
```javascript
const documents = dataManager.getDocuments();
dataManager.addDocument(docData);
```

#### After (Backend API)
```javascript
const response = await documentsAPI.getAll();
const documents = response.results;
await documentsAPI.upload(studentId, category, file);
```

### Departments

#### Before (localStorage)
```javascript
const departments = dataManager.getDepartments();
dataManager.addDepartment(deptData);
```

#### After (Backend API)
```javascript
const departments = await departmentsAPI.getAll();
await departmentsAPI.create(deptData);
```

## Key Differences

### 1. Async/Await

All API calls are asynchronous and return Promises. Use `async/await` or `.then()/.catch()`.

```javascript
// Using async/await
async function loadStudents() {
    try {
        const response = await studentsAPI.getAll();
        displayStudents(response.results);
    } catch (error) {
        console.error('Failed to load students:', error);
        showError(error.message);
    }
}

// Using .then()/.catch()
studentsAPI.getAll()
    .then(response => displayStudents(response.results))
    .catch(error => showError(error.message));
```

### 2. Pagination

API responses are paginated:

```javascript
const response = await studentsAPI.getAll();
console.log(response.count);      // Total number of items
console.log(response.results);    // Array of items for current page
console.log(response.next);       // URL for next page
console.log(response.previous);   // URL for previous page
```

### 3. Filtering

Use query parameters for filtering:

```javascript
// Filter students by semester and status
const response = await studentsAPI.getAll({
    semester: 3,
    status: 'active'
});

// Filter alumni by type
const response = await alumniAPI.getAll({
    alumniType: 'recent'
});
```

### 4. Error Handling

API errors should be caught and handled:

```javascript
try {
    await studentsAPI.delete(studentId);
    showSuccess('Student deleted successfully');
} catch (error) {
    if (error.message.includes('alumni')) {
        showError('Cannot delete student with alumni record');
    } else {
        showError('Failed to delete student');
    }
}
```

### 5. File Uploads

File uploads use FormData (handled internally):

```javascript
// Upload student photo
const photoFile = document.getElementById('photoInput').files[0];
await studentsAPI.uploadPhoto(studentId, photoFile);

// Upload document
const docFile = document.getElementById('docInput').files[0];
await documentsAPI.upload(studentId, 'NID', docFile);
```

## Complete API Reference

### Students API

```javascript
// List all students
await studentsAPI.getAll(filters);

// Get single student
await studentsAPI.getById(id);

// Create student
await studentsAPI.create(studentData);

// Update student
await studentsAPI.update(id, studentData);

// Delete student
await studentsAPI.delete(id);

// Search students
await studentsAPI.search(query);

// Upload photo
await studentsAPI.uploadPhoto(id, photoFile);

// Transition to alumni
await studentsAPI.transitionToAlumni(id, graduationYear);

// Disconnect studies
await studentsAPI.disconnectStudies(id, reason, lastSemester);

// Get semester results
await studentsAPI.getSemesterResults(id);

// Get semester attendance
await studentsAPI.getSemesterAttendance(id);
```

### Alumni API

```javascript
await alumniAPI.getAll(filters);
await alumniAPI.getById(id);
await alumniAPI.update(id, alumniData);
await alumniAPI.addCareerPosition(id, positionData);
await alumniAPI.updateSupportCategory(id, category, notes);
await alumniAPI.getStats();
```

### Applications API

```javascript
await applicationsAPI.getAll(filters);
await applicationsAPI.getById(id);
await applicationsAPI.submit(applicationData);
await applicationsAPI.review(id, status, reviewedBy, reviewNotes);
await applicationsAPI.delete(id);
```

### Documents API

```javascript
await documentsAPI.getAll(filters);
await documentsAPI.getById(id);
await documentsAPI.upload(studentId, category, file);
await documentsAPI.delete(id);
```

### Departments API

```javascript
await departmentsAPI.getAll();
await departmentsAPI.getById(id);
await departmentsAPI.create(departmentData);
await departmentsAPI.update(id, departmentData);
await departmentsAPI.delete(id);
await departmentsAPI.getStudents(id, semester);
```

### Dashboard API

```javascript
await dashboardAPI.getStats();
```

## Migration Checklist

- [ ] Replace `dataManager.getStudents()` with `studentsAPI.getAll()`
- [ ] Replace `dataManager.addStudent()` with `studentsAPI.create()`
- [ ] Replace `dataManager.updateStudent()` with `studentsAPI.update()`
- [ ] Replace `dataManager.deleteStudent()` with `studentsAPI.delete()`
- [ ] Replace alumni-related calls with `alumniAPI` methods
- [ ] Replace application-related calls with `applicationsAPI` methods
- [ ] Replace document-related calls with `documentsAPI` methods
- [ ] Replace department-related calls with `departmentsAPI` methods
- [ ] Update file upload forms to use new API methods
- [ ] Add error handling for all API calls
- [ ] Update UI to handle pagination
- [ ] Test all CRUD operations
- [ ] Test file uploads
- [ ] Test search and filtering

## Testing

### 1. Test Individual Endpoints

```javascript
// Test in browser console
import { studentsAPI } from './api/backend.js';

// Test get all
const students = await studentsAPI.getAll();
console.log(students);

// Test create
const newStudent = await studentsAPI.create({...});
console.log(newStudent);
```

### 2. Test Error Handling

```javascript
try {
    await studentsAPI.delete('invalid-id');
} catch (error) {
    console.log('Error caught:', error.message);
}
```

### 3. Test File Uploads

```javascript
const fileInput = document.getElementById('photoInput');
const file = fileInput.files[0];
const result = await studentsAPI.uploadPhoto(studentId, file);
console.log('Upload result:', result);
```

## Troubleshooting

### CORS Errors

If you see CORS errors, ensure:
1. Django backend is running
2. CORS is configured in `settings.py`
3. Frontend URL is in `CORS_ALLOWED_ORIGINS`

### Connection Refused

If you see "Connection refused":
1. Check if Django server is running
2. Verify the API_BASE_URL in `backend.js`
3. Check if port 8000 is available

### 404 Not Found

If endpoints return 404:
1. Verify the endpoint URL in API documentation
2. Check Django URL configuration
3. Ensure migrations are run

### Validation Errors

If you get validation errors:
1. Check required fields in API documentation
2. Verify data types match expectations
3. Check field constraints (e.g., mobile number format)

## Gradual Migration Strategy

You can migrate gradually by keeping both systems running:

1. **Phase 1**: Add backend API alongside localStorage
2. **Phase 2**: Migrate read operations (GET requests)
3. **Phase 3**: Migrate write operations (POST, PUT, DELETE)
4. **Phase 4**: Remove localStorage code
5. **Phase 5**: Test thoroughly

## Performance Considerations

- API calls are slower than localStorage
- Implement loading indicators for better UX
- Consider caching frequently accessed data
- Use pagination to limit data transfer
- Implement debouncing for search inputs

## Next Steps

1. Start Django backend server
2. Import `backend.js` in your pages
3. Replace one dataManager call at a time
4. Test each replacement thoroughly
5. Handle errors appropriately
6. Update UI for async operations
7. Remove localStorage code when complete

For detailed API documentation, see `server/API_DOCUMENTATION.md`.
