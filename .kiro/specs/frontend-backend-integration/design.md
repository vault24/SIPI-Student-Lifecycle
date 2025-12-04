# Design Document

## Overview

The Frontend-Backend Integration project transforms the SLMS frontend from a localStorage-based prototype into a production-ready application connected to the Django REST API backend. This involves replacing all `dataManager` calls with `backendAPI` calls, implementing comprehensive error handling, adding loading states, and removing all mock data dependencies.

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, Tailwind CSS
- **Backend**: Django REST Framework
- **Communication**: Fetch API with JSON payloads
- **File Uploads**: FormData with multipart/form-data
- **Error Handling**: Try-catch blocks with toast notifications
- **Loading States**: Skeleton screens and spinners

### Design Principles

- Progressive enhancement with graceful degradation
- Optimistic UI updates where appropriate
- Comprehensive error handling with user-friendly messages
- Consistent loading state patterns
- Minimal code changes to existing page structure
- Backward compatibility during migration

## Architecture

### Current Architecture (localStorage-based)

```
┌─────────────────┐
│   Page Module   │
│  (e.g., student │
│   ListPage.js)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  dataManager    │
│  (data.js)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  localStorage   │
│  (Browser)      │
└─────────────────┘
```

### New Architecture (API-based)

```
┌─────────────────┐
│   Page Module   │
│  (e.g., student │
│   ListPage.js)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  backendAPI     │
│  (backend.js)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   HTTP Client   │
│   (http.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Django REST    │
│     API         │
└─────────────────┘
```

### Module Responsibilities

**Page Modules** (e.g., `studentListPage.js`, `dashboardPage.js`)
- Render UI components
- Handle user interactions
- Call API functions
- Display loading states
- Handle errors with user feedback
- Update UI based on API responses

**Backend API Module** (`backend.js`)
- Provide high-level API functions
- Handle HTTP requests/responses
- Transform data between frontend and backend formats
- Throw errors for failed requests

**HTTP Client Module** (`http.js`)
- Low-level HTTP request handling
- Request/response interceptors
- Authentication token management
- CORS handling
- Retry logic for failed requests

**Error Handler Module** (`errorHandler.js`)
- Centralized error processing
- User-friendly error message generation
- Toast notification display
- Error logging

**Loading State Module** (`loadingState.js`)
- Skeleton screen rendering
- Spinner display
- Button loading states
- Progress indicators

## Components and Interfaces

### 1. HTTP Client Module (`http.js`)

```javascript
// Configuration
const API_BASE_URL = 'http://localhost:8000/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Core HTTP function
async function request(url, options = {}) {
  // Add authentication token
  // Set default headers
  // Handle timeout
  // Parse response
  // Throw on error
}

// Convenience methods
async function get(url, options = {})
async function post(url, data, options = {})
async function put(url, data, options = {})
async function patch(url, data, options = {})
async function del(url, options = {})
async function upload(url, formData, options = {})
```

**Features:**
- Automatic JSON parsing
- Authentication token injection
- Request timeout handling
- Response interceptors
- Error transformation

### 2. Error Handler Module (`errorHandler.js`)

```javascript
class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function handleAPIError(error) {
  // Extract error message
  // Determine error type
  // Show toast notification
  // Log to console
  // Handle special cases (401, 403, etc.)
}

function getErrorMessage(error) {
  // Convert API error to user-friendly message
}

function showErrorToast(message, duration = 5000) {
  // Display error toast notification
}
```

**Error Types:**
- Network errors (no connection)
- Timeout errors
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

### 3. Loading State Module (`loadingState.js`)

```javascript
function showLoadingSkeleton(containerId, type = 'table') {
  // Render skeleton based on type
}

function hideLoadingSkeleton(containerId) {
  // Remove skeleton
}

function setButtonLoading(buttonElement, loading = true) {
  // Disable button and show spinner
}

function showSpinner(containerId) {
  // Show centered spinner
}

function showProgressBar(containerId, progress) {
  // Show upload progress
}
```

**Skeleton Types:**
- Table skeleton (for lists)
- Card skeleton (for details)
- Form skeleton (for forms)
- Stats skeleton (for dashboard)

### 4. Updated Backend API Module (`backend.js`)

The existing `backend.js` will be enhanced with:

```javascript
// Add error handling wrapper
async function apiCall(fn) {
  try {
    return await fn();
  } catch (error) {
    handleAPIError(error);
    throw error;
  }
}

// Update all API functions to use http.js
export const studentsAPI = {
  async getAll(filters = {}) {
    return await apiCall(() => http.get('/students/', { params: filters }));
  },
  
  async getById(id) {
    return await apiCall(() => http.get(`/students/${id}/`));
  },
  
  // ... other methods
};
```

### 5. Page Module Pattern

Each page module will follow this pattern:

```javascript
async function render() {
  renderNavbar('Page Title');
  
  // Show loading skeleton
  showLoadingSkeleton('main-content', 'table');
  
  try {
    // Fetch data from API
    const data = await backendAPI.students.getAll();
    
    // Render content with data
    renderContent(data);
    
  } catch (error) {
    // Error already handled by errorHandler
    // Show empty state or retry button
    renderErrorState();
  }
}

async function handleFormSubmit(formData) {
  const submitButton = document.getElementById('submit-btn');
  
  // Show loading state
  setButtonLoading(submitButton, true);
  
  try {
    // Submit to API
    const result = await backendAPI.students.create(formData);
    
    // Show success message
    showSuccessToast('Student added successfully');
    
    // Navigate to list
    navigateTo('/students');
    
  } catch (error) {
    // Error already handled by errorHandler
    // Keep form open for retry
    
  } finally {
    // Hide loading state
    setButtonLoading(submitButton, false);
  }
}
```

## Data Models

### API Response Formats

**Paginated List Response:**
```javascript
{
  count: number,           // Total count
  next: string | null,     // Next page URL
  previous: string | null, // Previous page URL
  results: Array           // Data array
}
```

**Single Item Response:**
```javascript
{
  id: string,
  // ... other fields
}
```

**Error Response:**
```javascript
{
  error: string,           // Error message
  details: {               // Field-specific errors
    field: [string]
  }
}
```

### Data Transformation

**Frontend to Backend:**
- Convert camelCase to snake_case
- Transform nested objects
- Format dates to ISO strings
- Handle file uploads

**Backend to Frontend:**
- Convert snake_case to camelCase
- Parse date strings
- Handle null values
- Extract nested data

## Page-by-Page Migration Plan

### 1. Dashboard Page (`dashboardPage.js`)

**Current Implementation:**
```javascript
const students = dataManager.getStudents();
const documents = dataManager.getDocuments();
const alumni = dataManager.getAlumni();
```

**New Implementation:**
```javascript
const stats = await backendAPI.dashboard.getStats();
const { students, alumni, applications } = stats;
```

**Changes:**
- Replace multiple dataManager calls with single API call
- Add loading skeleton for stat cards
- Handle API errors with retry button
- Cache stats for 5 minutes

### 2. Student List Page (`studentListPage.js`)

**Current Implementation:**
```javascript
let students = dataManager.getStudents();
// Client-side filtering and pagination
```

**New Implementation:**
```javascript
const response = await backendAPI.students.getAll({
  search: searchTerm,
  semester: semesterFilter,
  status: statusFilter,
  page: currentPage
});
const { results, count } = response;
```

**Changes:**
- Replace dataManager with API call
- Move filtering to server-side
- Use API pagination
- Add debounced search
- Show loading skeleton during fetch
- Handle empty results

### 3. Add Student Page (`addStudentPage.js`)

**Current Implementation:**
```javascript
dataManager.addStudent(studentData);
```

**New Implementation:**
```javascript
const student = await backendAPI.students.create(studentData);
```

**Changes:**
- Replace dataManager with API call
- Add button loading state
- Handle validation errors
- Show field-specific errors
- Handle photo upload separately
- Show success toast on completion

### 4. Student Details Page (`studentDetailsPage.js`)

**Current Implementation:**
```javascript
const student = dataManager.getStudent(id);
```

**New Implementation:**
```javascript
const student = await backendAPI.students.getById(id);
```

**Changes:**
- Replace dataManager with API call
- Add loading skeleton
- Handle 404 errors
- Implement delete with confirmation
- Refresh data after updates

### 5. Edit Student Page (`editStudentPage.js`)

**Current Implementation:**
```javascript
const student = dataManager.getStudent(id);
// ... edit form
dataManager.updateStudent(id, updatedData);
```

**New Implementation:**
```javascript
const student = await backendAPI.students.getById(id);
// ... edit form
const updated = await backendAPI.students.update(id, updatedData);
```

**Changes:**
- Load student data from API
- Update via API
- Handle validation errors
- Show loading states
- Handle photo updates

### 6. Alumni Page (`alumniPage.js`)

**Current Implementation:**
```javascript
const alumni = applicationManager.getAlumni();
```

**New Implementation:**
```javascript
const response = await backendAPI.alumni.getAll(filters);
```

**Changes:**
- Replace applicationManager with API
- Add filtering support
- Implement CRUD operations
- Handle career positions
- Show loading states

### 7. Documents Page (`documentsPage.js`)

**Current Implementation:**
```javascript
const documents = dataManager.getDocuments();
```

**New Implementation:**
```javascript
const response = await backendAPI.documents.getAll({ student: studentId });
```

**Changes:**
- Replace dataManager with API
- Implement file upload with progress
- Handle multipart/form-data
- Show upload progress bar
- Handle file size limits
- Implement delete with confirmation

### 8. Departments Page (`departmentsPage.js`)

**Current Implementation:**
```javascript
// Mock department data
```

**New Implementation:**
```javascript
const departments = await backendAPI.departments.getAll();
```

**Changes:**
- Fetch from API
- Display department students
- Add loading states
- Handle errors

### 9. Discontinued Students Page (`discontinuedStudentsPage.js`)

**Current Implementation:**
```javascript
const students = dataManager.getStudents().filter(s => s.status === 'discontinued');
```

**New Implementation:**
```javascript
const response = await backendAPI.students.getAll({ status: 'discontinued' });
```

**Changes:**
- Use API filtering
- Implement reinstate functionality
- Add confirmation modal
- Show success feedback

### 10. Marks & Attendance Page (`marksAttendancePage.js`)

**Current Implementation:**
```javascript
// Mock marks data
```

**New Implementation:**
```javascript
const results = await backendAPI.students.getSemesterResults(studentId);
const attendance = await backendAPI.students.getSemesterAttendance(studentId);
```

**Changes:**
- Fetch from API
- Display real data
- Add loading states
- Handle empty semesters

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: API call consistency
*For any* page that displays data, when the page loads, it should fetch data from the backend API and not from localStorage
**Validates: Requirements 1.3**

### Property 2: Loading state visibility
*For any* API request, while the request is in progress, a loading indicator should be visible to the user
**Validates: Requirements 2.1, 2.2**

### Property 3: Error message display
*For any* failed API request, an error message should be displayed to the user via toast notification
**Validates: Requirements 3.1, 3.2, 3.3**

### Property 4: Form submission idempotency
*For any* form submission, the submit button should be disabled during the API request to prevent duplicate submissions
**Validates: Requirements 2.2, 2.3**

### Property 5: Data freshness
*For any* page that displays data, the data shown should come from the most recent API response and not from stale cache
**Validates: Requirements 1.3, 4.3**

### Property 6: Search debouncing
*For any* search input, API calls should be debounced to avoid excessive requests while the user is typing
**Validates: Requirements 15.1**

### Property 7: Pagination state consistency
*For any* paginated list, when navigating between pages, the search and filter parameters should be maintained
**Validates: Requirements 16.5**

### Property 8: File upload progress
*For any* file upload operation, a progress indicator should be displayed showing the upload percentage
**Validates: Requirements 9.4**

### Property 9: Authentication redirect
*For any* API request that returns a 401 Unauthorized error, the user should be redirected to the login page
**Validates: Requirements 13.3**

### Property 10: Mock data removal
*For any* page in the application, no data should be read from or written to localStorage except for authentication tokens
**Validates: Requirements 14.1, 14.2, 14.3, 14.4**

### Property 11: Error field mapping
*For any* form submission that returns validation errors, each error should be displayed next to its corresponding form field
**Validates: Requirements 3.4, 5.4, 7.4**

### Property 12: Empty state handling
*For any* list view, when the API returns zero results, an appropriate empty state message should be displayed
**Validates: Requirements 15.5**

## Error Handling

### Error Categories

**1. Network Errors**
- No internet connection
- DNS resolution failure
- Connection timeout

**User Message:** "Unable to connect to the server. Please check your internet connection and try again."

**Action:** Show retry button

**2. Timeout Errors**
- Request takes longer than 30 seconds

**User Message:** "The request is taking longer than expected. Please try again."

**Action:** Show retry button

**3. Validation Errors (400)**
- Invalid form data
- Business logic violations

**User Message:** Display specific field errors from API response

**Action:** Keep form open, highlight error fields

**4. Authentication Errors (401)**
- Missing or invalid token
- Expired session

**User Message:** "Your session has expired. Please log in again."

**Action:** Redirect to login page

**5. Authorization Errors (403)**
- Insufficient permissions

**User Message:** "You don't have permission to perform this action."

**Action:** Show error toast, disable action

**6. Not Found Errors (404)**
- Resource doesn't exist

**User Message:** "The requested resource was not found."

**Action:** Show empty state or redirect to list

**7. Server Errors (500)**
- Unexpected server error

**User Message:** "Something went wrong on our end. Please try again later."

**Action:** Show retry button, log error details

### Error Handling Flow

```
API Request
    │
    ▼
Try-Catch Block
    │
    ├─ Success ──> Update UI
    │
    └─ Error ──> handleAPIError()
                      │
                      ├─ Extract error message
                      ├─ Determine error type
                      ├─ Show toast notification
                      ├─ Log to console
                      └─ Handle special cases
```

### Retry Logic

**Automatic Retry:**
- Network errors: Retry up to 3 times with exponential backoff
- Timeout errors: No automatic retry

**Manual Retry:**
- Show "Retry" button for all failed requests
- Clear error state before retry
- Show loading state during retry

## Testing Strategy

### Unit Tests

**HTTP Client Tests:**
- Test request method (GET, POST, PUT, DELETE)
- Test header injection
- Test timeout handling
- Test response parsing
- Test error transformation

**Error Handler Tests:**
- Test error message extraction
- Test error type determination
- Test toast notification display
- Test special case handling (401, 403)

**Loading State Tests:**
- Test skeleton rendering
- Test button loading state
- Test spinner display
- Test progress bar updates

### Integration Tests

**Page Integration Tests:**
- Test data fetching on page load
- Test form submission
- Test search and filter
- Test pagination
- Test error handling
- Test loading states

**API Integration Tests:**
- Test all API endpoints
- Test request/response formats
- Test error responses
- Test file uploads
- Test pagination

### End-to-End Tests

**User Flows:**
- Add new student → View in list → Edit → Delete
- Upload document → View → Delete
- Search students → Filter → Paginate
- Handle network error → Retry → Success

### Manual Testing Checklist

**For Each Page:**
- [ ] Data loads from API on page load
- [ ] Loading skeleton displays during fetch
- [ ] Data renders correctly after fetch
- [ ] Search works with debouncing
- [ ] Filters work correctly
- [ ] Pagination works correctly
- [ ] Form submission works
- [ ] Validation errors display correctly
- [ ] Success messages display
- [ ] Error messages display
- [ ] Retry button works
- [ ] No localStorage usage (except auth)
- [ ] No console errors

**Network Conditions:**
- [ ] Test with slow 3G
- [ ] Test with offline mode
- [ ] Test with intermittent connection
- [ ] Test with high latency

**Error Scenarios:**
- [ ] Test with invalid data
- [ ] Test with missing required fields
- [ ] Test with server errors
- [ ] Test with 404 errors
- [ ] Test with 401 errors

## Performance Considerations

### Optimization Strategies

**1. Request Debouncing**
- Debounce search inputs (300ms)
- Debounce filter changes (300ms)
- Prevent duplicate requests

**2. Response Caching**
- Cache dashboard stats (5 minutes)
- Cache department list (10 minutes)
- Invalidate cache on updates

**3. Lazy Loading**
- Load images on demand
- Paginate large lists
- Infinite scroll for long lists

**4. Request Batching**
- Batch multiple requests where possible
- Use single dashboard stats endpoint

**5. Optimistic Updates**
- Update UI immediately
- Revert on error
- Show loading indicator

**6. Request Cancellation**
- Cancel pending requests on navigation
- Cancel outdated search requests
- Use AbortController

### Performance Targets

- Initial page load: < 2 seconds
- API request: < 1 second
- Search response: < 500ms
- Form submission: < 2 seconds
- File upload: Progress indicator required

## Security Considerations

### Authentication

**Token Storage:**
- Store JWT token in localStorage
- Include token in all API requests
- Clear token on logout
- Redirect to login on 401

**Token Format:**
```javascript
{
  token: 'jwt-token-string',
  expiresAt: '2024-12-31T23:59:59Z'
}
```

### CORS Configuration

**Backend Settings:**
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
CORS_ALLOW_CREDENTIALS = True
```

**Frontend Requests:**
- Include credentials in requests
- Handle CORS errors gracefully

### Input Validation

**Client-Side:**
- Validate before submission
- Sanitize user input
- Prevent XSS attacks

**Server-Side:**
- Trust server validation
- Display server errors
- Don't bypass server validation

### File Upload Security

**Validation:**
- Check file type
- Check file size
- Validate on server

**Limits:**
- Images: 5MB max
- Documents: 10MB max
- Allowed types: JPG, PNG, PDF

## Migration Strategy

### Phase 1: Setup (Week 1)

1. Create new modules:
   - `http.js` - HTTP client
   - `errorHandler.js` - Error handling
   - `loadingState.js` - Loading states

2. Update `backend.js`:
   - Integrate with `http.js`
   - Add error handling wrapper

3. Create utility functions:
   - Data transformation helpers
   - Date formatting helpers

### Phase 2: Core Pages (Week 2)

1. Migrate Dashboard page
2. Migrate Student List page
3. Migrate Add Student page
4. Migrate Student Details page

**Testing:** Verify each page works before moving to next

### Phase 3: Secondary Pages (Week 3)

1. Migrate Edit Student page
2. Migrate Alumni page
3. Migrate Documents page
4. Migrate Departments page

**Testing:** Verify all CRUD operations work

### Phase 4: Remaining Pages (Week 4)

1. Migrate Discontinued Students page
2. Migrate Marks & Attendance page
3. Migrate Applications page

**Testing:** Complete integration testing

### Phase 5: Cleanup (Week 5)

1. Remove `dataManager` from `data.js`
2. Remove all mock data functions
3. Remove localStorage operations (except auth)
4. Update documentation
5. Final testing

### Rollback Plan

**If Issues Arise:**
1. Keep old `dataManager` code commented
2. Feature flag for API vs localStorage
3. Easy rollback per page
4. Monitor error rates

## Future Enhancements

### Real-time Updates

- WebSocket connection for live updates
- Push notifications for new data
- Automatic refresh on data changes

### Offline Support

- Service worker for offline caching
- Queue requests when offline
- Sync when connection restored

### Advanced Features

- Bulk operations
- Export to PDF/Excel
- Advanced search with filters
- Data visualization charts

### Performance Improvements

- GraphQL for flexible queries
- Server-side rendering
- Progressive web app features
- Image optimization

## Documentation

### Developer Documentation

**API Integration Guide:**
- How to add new API endpoints
- How to handle errors
- How to add loading states
- How to test API integration

**Code Examples:**
- Common patterns
- Error handling examples
- Loading state examples
- Form submission examples

### User Documentation

**Error Messages:**
- What each error means
- How to resolve common errors
- When to contact support

**Feature Guide:**
- How to use each feature
- Tips for better performance
- Troubleshooting guide
