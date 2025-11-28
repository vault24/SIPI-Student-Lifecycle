# Frontend Migration Guide

## Overview

The frontend has been updated to use API calls instead of localStorage. Some functions in `app.js` need to be updated to handle async operations.

## Key Changes Required

### 1. Functions that need to be async

Functions that call `dataManager.getStudents()`, `dataManager.getStudent()`, etc. need to be updated:

#### Before:
```javascript
function renderStudentList() {
    const students = dataManager.getStudents();
    // render students...
}
```

#### After:
```javascript
async function renderStudentList() {
    const students = await dataManager.getStudents();
    // render students...
}
```

### 2. Functions to Update

#### Dashboard (`renderDashboard`)
```javascript
async function renderDashboard() {
    renderNavbar('Dashboard');
    
    const students = await dataManager.getStudents();
    const documents = await dataManager.getDocuments();
    const alumni = await dataManager.getAlumni();
    
    // rest of the function...
}
```

#### Student List (`renderStudentList`)
```javascript
async function renderStudentList() {
    renderNavbar('Student List');
    
    const students = await dataManager.getStudents();
    // rest of the function...
}
```

#### Student Details (`renderStudentDetails`)
```javascript
async function renderStudentDetails(params) {
    const student = await dataManager.getStudent(params.id);
    if (!student) {
        // handle error
        return;
    }
    // render student details...
}
```

#### Add Student (`handleAddStudent`)
```javascript
async function handleAddStudent(e) {
    e.preventDefault();
    
    // ... validation code ...
    
    const result = await dataManager.addStudent(formData);
    if (result) {
        showToast('Student added successfully!', 'success');
        setTimeout(() => navigateTo('/students'), 1000);
    }
}
```

#### Update Student (`handleUpdateStudent`)
```javascript
async function handleUpdateStudent(e, studentId) {
    e.preventDefault();
    
    // ... collect form data ...
    
    const result = await dataManager.updateStudent(studentId, updates);
    if (result) {
        showToast('Student updated successfully!', 'success');
        navigateTo(`/student/${studentId}`);
    }
}
```

#### Delete Student
```javascript
async function deleteStudent(id) {
    const confirmed = await showConfirmModal({
        title: 'Delete Student',
        message: 'Are you sure?',
        onConfirm: async () => {
            const success = await dataManager.deleteStudent(id);
            if (success) {
                await updateStudentList(); // Also needs to be async
            }
        }
    });
}
```

#### Update Student List
```javascript
async function updateStudentList() {
    const students = await dataManager.getStudents();
    // filter and render...
}
```

### 3. Application Functions

#### Submit Application (`handlePublicApplicationSubmit`)
```javascript
async function handlePublicApplicationSubmit(e) {
    e.preventDefault();
    
    const applicationData = { /* ... */ };
    const application = await applicationManager.submitApplication(applicationData);
    
    if (application) {
        // show success message...
    }
}
```

### 4. Document Functions

#### Get Documents
```javascript
async function loadDocuments(studentId) {
    const documents = await dataManager.getDocuments(studentId);
    // render documents...
}
```

#### Upload Document
```javascript
async function uploadDocument(studentId, file, documentType) {
    const result = await dataManager.addDocument({
        studentId,
        file,
        documentType,
        description: ''
    });
    
    if (result) {
        await loadDocuments(studentId);
    }
}
```

## Error Handling

Always wrap async calls in try-catch or handle errors:

```javascript
async function renderStudentList() {
    try {
        const students = await dataManager.getStudents();
        // render...
    } catch (error) {
        console.error('Error loading students:', error);
        showToast('Failed to load students', 'error');
    }
}
```

## Testing

After updating functions:

1. Test adding a student
2. Test viewing student list
3. Test updating a student
4. Test deleting a student
5. Test uploading documents
6. Test submitting applications

## Notes

- All `dataManager` methods that interact with the API are now async
- Functions that call these methods must be async
- Use `await` when calling async functions
- Handle errors appropriately
- The `dataManager` already shows toast notifications, so you may not need to show them again


