# Design Document

## Overview

This document describes the architectural design for restructuring the SIPI Student Lifecycle Management System (SLMS) from a monolithic frontend application into a well-organized, modular client-side architecture. The restructuring will maintain all existing functionality while improving code organization, maintainability, and scalability.

The design follows a layered architecture pattern with clear separation between:
- **Presentation Layer**: Page modules and UI components
- **API Layer**: Data fetching and HTTP communication
- **Utility Layer**: Reusable helper functions
- **Styling Layer**: Organized CSS with proper cascading

## Architecture

### High-Level Structure

```
client/
├── index.html                 # Main HTML entry point
├── assets/                    # Static assets
│   ├── images/               # Image files
│   ├── fonts/                # Font files
│   └── [other assets]        # Other static files
├── css/                       # Stylesheets
│   ├── base.css              # Global styles and resets
│   ├── layout.css            # Layout patterns
│   ├── components.css        # Component styles
│   └── pages/                # Page-specific styles
│       ├── dashboard.css
│       ├── students.css
│       ├── departments.css
│       └── alumni.css
└── js/                        # JavaScript modules
    ├── app.js                # Main application entry point
    ├── api/                  # API communication layer
    │   ├── http.js           # Base HTTP client
    │   ├── studentsApi.js    # Student API calls
    │   ├── departmentsApi.js # Department API calls
    │   ├── documentsApi.js   # Document API calls
    │   ├── alumniApi.js      # Alumni API calls
    │   ├── applicationsApi.js# Application API calls
    │   └── marksApi.js       # Marks/Attendance API calls
    ├── pages/                # Page rendering modules
    │   ├── dashboardPage.js
    │   ├── addStudentPage.js
    │   ├── studentListPage.js
    │   ├── studentDetailsPage.js
    │   ├── editStudentPage.js
    │   ├── departmentsPage.js
    │   ├── departmentViewPage.js
    │   ├── alumniPage.js
    │   ├── alumniDetailsPage.js
    │   ├── editAlumniPage.js
    │   ├── applicationsPage.js
    │   ├── applicationDetailsPage.js
    │   ├── marksAttendancePage.js
    │   ├── documentsPage.js
    │   ├── loginPage.js
    │   └── adminDashboardPage.js
    ├── components/           # Reusable UI components
    │   ├── sidebar.js
    │   ├── navbar.js
    │   ├── modal.js
    │   ├── table.js
    │   ├── toast.js
    │   ├── statCard.js
    │   ├── pagination.js
    │   └── skeleton.js
    └── utils/                # Utility functions
        ├── dom.js            # DOM manipulation
        ├── forms.js          # Form handling
        ├── format.js         # Data formatting
        ├── storage.js        # LocalStorage wrapper
        ├── router.js         # Routing logic
        └── validation.js     # Validation helpers
```

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Pages, Components, User Interface)    │
├─────────────────────────────────────────┤
│           API Layer                     │
│  (HTTP Client, Domain-specific APIs)    │
├─────────────────────────────────────────┤
│         Utility Layer                   │
│  (Helpers, Formatters, Validators)      │
├─────────────────────────────────────────┤
│         Data Layer                      │
│  (LocalStorage, Data Manager)           │
└─────────────────────────────────────────┘
```

## Components and Interfaces

### API Layer

#### HTTP Client (`js/api/http.js`)

The base HTTP client provides a unified interface for all HTTP operations.

```javascript
// Interface
{
  get(url, options): Promise<Response>
  post(url, data, options): Promise<Response>
  put(url, data, options): Promise<Response>
  delete(url, options): Promise<Response>
  handleResponse(response): Promise<any>
  handleError(error): void
}
```

**Responsibilities:**
- Execute HTTP requests with proper headers
- Handle response parsing (JSON, text, blob)
- Centralized error handling
- Request/response interceptors for logging
- Timeout management

#### Domain-Specific API Modules

Each domain API module wraps the HTTP client and provides domain-specific methods.

**Students API (`js/api/studentsApi.js`)**
```javascript
{
  getStudents(filters): Promise<Student[]>
  getStudent(id): Promise<Student>
  createStudent(data): Promise<Student>
  updateStudent(id, data): Promise<Student>
  deleteStudent(id): Promise<boolean>
  getStudentsByDepartment(dept, semester): Promise<Student[]>
}
```

**Departments API (`js/api/departmentsApi.js`)**
```javascript
{
  getDepartments(): Promise<Department[]>
  getDepartment(id): Promise<Department>
  createDepartment(data): Promise<Department>
  updateDepartment(id, data): Promise<Department>
  deleteDepartment(id): Promise<boolean>
}
```

**Documents API (`js/api/documentsApi.js`)**
```javascript
{
  getDocuments(studentId?): Promise<Document[]>
  uploadDocument(file, metadata): Promise<Document>
  deleteDocument(id): Promise<boolean>
  downloadDocument(id): Promise<Blob>
}
```

**Alumni API (`js/api/alumniApi.js`)**
```javascript
{
  getAlumni(filters): Promise<Alumni[]>
  getAlumniById(id): Promise<Alumni>
  transitionToAlumni(studentId): Promise<Alumni>
  updateAlumni(id, data): Promise<Alumni>
  addCareerPosition(alumniId, position): Promise<Position>
  updateCareerPosition(alumniId, positionId, data): Promise<Position>
  updateSupportCategory(alumniId, category, notes): Promise<SupportEntry>
  getAlumniStats(): Promise<AlumniStats>
}
```

**Applications API (`js/api/applicationsApi.js`)**
```javascript
{
  getApplications(status?): Promise<Application[]>
  getApplication(id): Promise<Application>
  submitApplication(data): Promise<Application>
  updateApplicationStatus(id, status, notes): Promise<boolean>
  deleteApplication(id): Promise<boolean>
}
```

**Marks API (`js/api/marksApi.js`)**
```javascript
{
  getMarks(studentId?): Promise<Marks[]>
  addMarks(data): Promise<Marks>
  updateMarks(id, data): Promise<Marks>
  getAttendance(studentId?): Promise<Attendance[]>
  addAttendance(data): Promise<Attendance>
}
```

### Page Layer

Each page module exports a `render` function that handles page-specific logic.

**Page Module Interface**
```javascript
{
  render(params?): void  // Main render function
  cleanup?(): void       // Optional cleanup on page exit
}
```

**Example: Dashboard Page (`js/pages/dashboardPage.js`)**
```javascript
export function render() {
  // 1. Update navbar
  // 2. Fetch data from API
  // 3. Render stats cards
  // 4. Render quick actions
  // 5. Render recent activity
  // 6. Initialize icons
}
```

**Example: Student List Page (`js/pages/studentListPage.js`)**
```javascript
export function render() {
  // 1. Update navbar
  // 2. Fetch students from API
  // 3. Render search/filter UI
  // 4. Render student table
  // 5. Render pagination
  // 6. Attach event listeners
}
```

### Component Layer

Components are reusable UI elements that can be used across multiple pages.

**Sidebar Component (`js/components/sidebar.js`)**
```javascript
{
  render(): string  // Returns HTML string for sidebar
  updateActive(path): void  // Updates active menu item
}
```

**Navbar Component (`js/components/navbar.js`)**
```javascript
{
  render(title): string  // Returns HTML string for navbar
  toggleUserMenu(): void  // Toggles user dropdown
}
```

**Modal Component (`js/components/modal.js`)**
```javascript
{
  showConfirm(options): Promise<boolean>  // Confirmation dialog
  showForm(options): Promise<FormData>    // Form modal
  close(id): void                         // Close specific modal
}
```

**Table Component (`js/components/table.js`)**
```javascript
{
  render(data, columns, options): string  // Renders data table
  renderMobileCards(data, columns): string  // Mobile-friendly cards
}
```

**Toast Component (`js/components/toast.js`)**
```javascript
{
  show(message, type, duration): void  // Show notification
  remove(id): void                     // Remove notification
}
```

**Stat Card Component (`js/components/statCard.js`)**
```javascript
{
  render(options): string  // Renders statistics card
}
```

**Pagination Component (`js/components/pagination.js`)**
```javascript
{
  render(paginatedData, onPageChange): string  // Renders pagination controls
}
```

**Skeleton Component (`js/components/skeleton.js`)**
```javascript
{
  renderCard(count): string   // Loading skeleton for cards
  renderTable(rows): string   // Loading skeleton for tables
  renderList(count): string   // Loading skeleton for lists
}
```

### Utility Layer

**DOM Utilities (`js/utils/dom.js`)**
```javascript
{
  $(selector): Element  // Query selector shorthand
  $$(selector): NodeList  // Query selector all shorthand
  createElement(tag, attrs, children): Element
  addClass(element, ...classes): void
  removeClass(element, ...classes): void
  toggleClass(element, className): void
  on(element, event, handler): void
  off(element, event, handler): void
}
```

**Form Utilities (`js/utils/forms.js`)**
```javascript
{
  getFormData(formElement): Object  // Extract form data
  setFormData(formElement, data): void  // Populate form
  validateForm(formElement, rules): ValidationResult
  resetForm(formElement): void
  serializeForm(formElement): string
}
```

**Format Utilities (`js/utils/format.js`)**
```javascript
{
  formatDate(date, format): string
  formatFileSize(bytes): string
  formatCurrency(amount, currency): string
  formatPhone(phone): string
  truncateText(text, maxLength): string
  capitalize(text): string
  toTitleCase(text): string
}
```

**Storage Utilities (`js/utils/storage.js`)**
```javascript
{
  get(key): any
  set(key, value): boolean
  remove(key): boolean
  clear(): boolean
  has(key): boolean
}
```

**Router Utilities (`js/utils/router.js`)**
```javascript
{
  register(path, handler): void
  navigate(path): void
  getCurrentRoute(): string
  getParams(): Object
}
```

**Validation Utilities (`js/utils/validation.js`)**
```javascript
{
  isRequired(value): boolean
  isEmail(value): boolean
  isPhone(value): boolean
  isNumber(value): boolean
  isDate(value): boolean
  minLength(value, length): boolean
  maxLength(value, length): boolean
  matches(value, pattern): boolean
}
```

## Data Models

### Student Model
```javascript
{
  id: string
  fullName: string
  fullNameBangla?: string
  rollNumber: string
  registrationNumber: string
  semester: number
  department: string
  dateOfBirth: string
  nidNumber?: string
  birthCertificateNo: string
  fatherName: string
  fatherNID: string
  motherName: string
  motherNID: string
  gender: string
  religion?: string
  bloodGroup?: string
  maritalStatus?: string
  presentAddress: Address
  permanentAddress: Address
  mobileStudent: string
  guardianMobile: string
  email?: string
  emergencyContact: string
  educationalBackground: EducationalBackground
  profilePhoto?: string
  status: 'active' | 'inactive' | 'graduated'
  enrollmentDate: string
  semesterResults?: SemesterResult[]
  createdAt: string
  updatedAt: string
}
```

### Address Model
```javascript
{
  division: string
  district: string
  subDistrict: string
  policeStation: string
  postOffice: string
  municipality: string
  village: string
  ward: string
}
```

### Alumni Model
```javascript
{
  id: string
  studentId: string
  alumniType: 'recent' | 'established'
  transitionDate: string
  graduationYear: number
  careerHistory: Position[]
  supportHistory: SupportEntry[]
  currentSupportCategory: 'receiving_support' | 'needs_extra_support' | 'no_support_needed'
  currentPosition: Position | null
  createdAt: string
  updatedAt: string
}
```

### Position Model
```javascript
{
  id: string
  positionType: 'job' | 'higher_study' | 'business' | 'other'
  organizationName: string
  positionTitle: string
  startDate: string
  endDate: string | null
  description: string
  isCurrent: boolean
  addedAt: string
}
```

### Document Model
```javascript
{
  id: string
  studentId: string
  fileName: string
  fileType: string
  category: string
  uploadDate: string
  fileSize: number
  fileUrl: string
}
```

### Application Model
```javascript
{
  id: string
  [application fields...]
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt: string | null
  reviewedBy: string | null
  reviewNotes: string
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Acceptance Criteria Testing Prework

1.1 WHEN the restructuring is complete THEN the system SHALL organize all client-side code under a `client/` directory
Thoughts: This is about the final directory structure. We can verify this by checking that all client files exist under the client/ directory after restructuring.
Testable: yes - example

1.2 WHEN organizing assets THEN the system SHALL create separate subdirectories for images, fonts, and other asset types under `client/assets/`
Thoughts: This is about directory structure. We can verify the directories exist.
Testable: yes - example

1.3 WHEN organizing CSS THEN the system SHALL separate styles into base, layout, components, and page-specific files under `client/css/`
Thoughts: This is about file organization. We can verify the CSS files exist in the correct locations.
Testable: yes - example

1.4 WHEN organizing JavaScript THEN the system SHALL create separate directories for API modules, page modules, component modules, and utility modules under `client/js/`
Thoughts: This is about directory structure. We can verify the directories exist.
Testable: yes - example

1.5 WHEN the directory structure is created THEN the system SHALL maintain the existing `index.html` file at the client root level
Thoughts: This is verifying a specific file exists at a specific location.
Testable: yes - example

2.1 WHEN creating API modules THEN the system SHALL implement a base HTTP client module (`http.js`) that handles common HTTP operations
Thoughts: This is about the existence and functionality of a specific module. We can verify the module exists and exports the required methods.
Testable: yes - example

2.2 WHEN implementing the HTTP client THEN the system SHALL provide methods for GET, POST, PUT, and DELETE operations
Thoughts: This is about the interface of the HTTP client. We can verify these methods exist and work correctly across all HTTP methods.
Testable: yes - property

2.3-2.8 WHEN creating domain-specific API modules THEN the system SHALL implement [specific]Api.js
Thoughts: These are all about verifying specific modules exist with the correct exports.
Testable: yes - example

3.1-3.9 WHEN creating page modules THEN the system SHALL implement [specific]Page.js
Thoughts: These are all about verifying specific modules exist and export a render function.
Testable: yes - example

4.1-4.7 WHEN creating component modules THEN the system SHALL implement [specific].js
Thoughts: These are all about verifying specific modules exist and export the required functions.
Testable: yes - example

5.1-5.5 WHEN creating utility modules THEN the system SHALL implement [specific].js
Thoughts: These are all about verifying specific modules exist and export pure functions.
Testable: yes - example

6.1-6.8 WHEN organizing CSS THEN the system SHALL create [specific].css files
Thoughts: These are all about verifying specific CSS files exist.
Testable: yes - example

7.1-7.5 WHEN restructuring the main app file...
Thoughts: These are about the structure and behavior of app.js. We can verify it imports modules and sets up routing correctly.
Testable: yes - example

8.1-8.8 WHEN restructuring is complete THEN the system SHALL maintain all [feature] features
Thoughts: This is about functional preservation. For any feature that existed before, it should still work after restructuring. We can test this by verifying that all original functionality still works.
Testable: yes - property

9.1-9.5 WHEN implementing modules THEN the system SHALL use proper module syntax
Thoughts: This is about code organization patterns. We can verify modules export correctly and dependencies are explicit.
Testable: yes - property

10.1-10.5 WHEN updating the HTML file THEN the system SHALL update references correctly
Thoughts: This is about the HTML file structure. We can verify all script and link tags point to correct paths and load successfully.
Testable: yes - example

### Property Reflection

After reviewing all testable properties, most acceptance criteria are structural validations (checking files exist, have correct exports, etc.) which are best tested as examples. The key properties that apply across multiple instances are:

1. **HTTP Method Completeness** (2.2): Verifying all HTTP methods work correctly
2. **Functional Preservation** (8.1-8.8): Ensuring all features work after restructuring
3. **Module Export Consistency** (9.1-9.5): Ensuring all modules follow consistent patterns

These properties provide unique validation value and cannot be reduced further without losing coverage.

### Correctness Properties

Property 1: HTTP client method completeness
*For any* HTTP method (GET, POST, PUT, DELETE), the HTTP client should provide a working implementation that can execute requests and handle responses
**Validates: Requirements 2.2**

Property 2: Feature preservation after restructuring
*For any* feature that existed in the original application (student management, department management, document management, alumni management, application management, marks/attendance, routing), that feature should continue to work identically after the restructuring is complete
**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8**

Property 3: Module export consistency
*For any* module in the restructured codebase, it should export its public interface in a consistent manner (either ES6 exports or namespaced globals) and all exported functions should be accessible to consuming code
**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

## Error Handling

### API Layer Error Handling

**HTTP Client Errors:**
- Network failures: Retry with exponential backoff
- Timeout errors: Display user-friendly message
- 4xx errors: Display validation errors to user
- 5xx errors: Log error and display generic message
- Parse errors: Log error and display data format message

**API Module Errors:**
- Wrap HTTP client errors with domain context
- Validate input parameters before making requests
- Return meaningful error objects with error codes
- Log errors for debugging

### Page Layer Error Handling

**Rendering Errors:**
- Catch and log rendering exceptions
- Display fallback UI on error
- Provide retry mechanism for failed renders
- Show user-friendly error messages

**Data Loading Errors:**
- Display loading skeletons during fetch
- Show error state if data fails to load
- Provide retry button
- Cache successful responses

### Component Layer Error Handling

**Component Errors:**
- Validate props/parameters before rendering
- Return safe fallback HTML on error
- Log component errors for debugging
- Prevent error propagation to parent

### Utility Layer Error Handling

**Utility Function Errors:**
- Validate input parameters
- Return safe default values on error
- Throw descriptive errors for invalid input
- Document error conditions

## Testing Strategy

### Manual Testing Approach

Since this is a restructuring project focused on code organization rather than new functionality, the testing strategy will emphasize manual verification and functional testing.

**Structural Verification:**
1. Verify all directories are created as specified
2. Verify all files are in correct locations
3. Verify all modules export expected interfaces
4. Verify HTML file references are updated correctly

**Functional Testing:**
1. Test each page renders correctly
2. Test all navigation works
3. Test all forms submit correctly
4. Test all CRUD operations work
5. Test all filters and search work
6. Test all modals and toasts work
7. Test responsive behavior on mobile
8. Test browser compatibility

**Integration Testing:**
1. Test page-to-page navigation
2. Test data flow from API to UI
3. Test component reusability across pages
4. Test utility function usage across modules

**Regression Testing:**
1. Compare functionality before and after restructuring
2. Test all existing features still work
3. Verify no data loss during migration
4. Verify performance is maintained or improved

### Testing Checklist

**Directory Structure:**
- [ ] `client/` directory exists
- [ ] `client/assets/` subdirectories exist
- [ ] `client/css/` files organized correctly
- [ ] `client/js/` subdirectories exist
- [ ] All files moved to correct locations

**API Layer:**
- [ ] HTTP client module exists and exports methods
- [ ] All domain API modules exist
- [ ] API modules use HTTP client correctly
- [ ] Error handling works in API layer

**Page Layer:**
- [ ] All page modules exist
- [ ] Each page module exports render function
- [ ] Pages render correctly
- [ ] Page navigation works
- [ ] Page-specific logic works

**Component Layer:**
- [ ] All component modules exist
- [ ] Components render correctly
- [ ] Components are reusable across pages
- [ ] Component interactions work

**Utility Layer:**
- [ ] All utility modules exist
- [ ] Utility functions work correctly
- [ ] Utilities are pure functions
- [ ] No side effects in utilities

**CSS Organization:**
- [ ] Base styles apply globally
- [ ] Layout styles work correctly
- [ ] Component styles are scoped
- [ ] Page styles load correctly
- [ ] No style conflicts

**Functional Preservation:**
- [ ] Dashboard displays correctly
- [ ] Student management works (add, edit, view, delete)
- [ ] Department management works
- [ ] Document management works
- [ ] Alumni management works
- [ ] Application management works
- [ ] Marks and attendance work
- [ ] Routing and navigation work
- [ ] All modals work
- [ ] All toasts work
- [ ] All forms validate correctly
- [ ] Search and filters work
- [ ] Pagination works
- [ ] Mobile responsive behavior works

## Migration Strategy

### Phase 1: Preparation
1. Create backup of current codebase
2. Create new directory structure
3. Set up empty module files
4. Update HTML file with new paths (commented out)

### Phase 2: Utility Layer Migration
1. Extract and move utility functions to `utils/` modules
2. Update utility function exports
3. Test utility functions independently
4. Update references in existing code

### Phase 3: API Layer Creation
1. Create HTTP client module
2. Extract data manager functions to API modules
3. Update API module exports
4. Test API modules with existing data layer
5. Update references in existing code

### Phase 4: Component Layer Extraction
1. Extract reusable components to `components/` modules
2. Update component exports
3. Test components independently
4. Update references in page code

### Phase 5: Page Layer Separation
1. Extract page rendering logic to `pages/` modules
2. Update page module exports
3. Test each page module
4. Update router to use new page modules

### Phase 6: CSS Organization
1. Split existing CSS into base, layout, components
2. Create page-specific CSS files
3. Update HTML to load CSS in correct order
4. Test styling across all pages

### Phase 7: Integration and Testing
1. Enable new HTML file paths
2. Test all pages and features
3. Fix any integration issues
4. Verify all functionality works
5. Test on multiple browsers and devices

### Phase 8: Cleanup
1. Remove old file structure
2. Update documentation
3. Remove commented code
4. Final testing pass

## Performance Considerations

### Module Loading
- Load critical modules first (router, utilities)
- Defer non-critical modules
- Consider code splitting for large pages
- Minimize global scope pollution

### CSS Loading
- Load base and layout CSS first
- Load component CSS before page CSS
- Consider critical CSS inlining
- Minimize CSS file size

### Asset Management
- Optimize images before moving to assets/
- Use appropriate image formats
- Consider lazy loading for images
- Compress fonts

### Caching Strategy
- Leverage browser caching for static assets
- Version CSS and JS files for cache busting
- Cache API responses where appropriate
- Use localStorage efficiently

## Browser Compatibility

**Target Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Polyfills Needed:**
- None (using modern browser features only)

**Fallbacks:**
- Provide fallback for ES6 modules if needed
- Graceful degradation for CSS features
- Alternative UI for unsupported features

## Security Considerations

### Input Validation
- Validate all user input in forms
- Sanitize HTML before rendering
- Prevent XSS attacks
- Validate file uploads

### Data Storage
- Encrypt sensitive data in localStorage
- Clear sensitive data on logout
- Implement session timeout
- Validate data before storage

### API Security
- Implement CSRF protection (future)
- Use HTTPS for all requests (future)
- Validate API responses
- Handle authentication tokens securely (future)

## Future Enhancements

### Backend Integration
- Replace localStorage with REST API
- Implement proper authentication
- Add real-time updates with WebSockets
- Implement file upload to server

### Build Process
- Add module bundler (Webpack/Vite)
- Implement CSS preprocessing (Sass/PostCSS)
- Add code minification
- Implement tree shaking

### Testing Infrastructure
- Add unit testing framework (Jest/Vitest)
- Add E2E testing (Playwright/Cypress)
- Implement CI/CD pipeline
- Add code coverage reporting

### Progressive Web App
- Add service worker
- Implement offline support
- Add app manifest
- Enable install prompt
