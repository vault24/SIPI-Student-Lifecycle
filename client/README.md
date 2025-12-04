# Client Directory Structure

This directory contains the restructured frontend code for the SIPI Student Lifecycle Management System (SLMS).

## Directory Structure

```
client/
├── index.html                 # Main HTML entry point (to be moved here)
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

## Architecture

The application follows a layered architecture:

1. **Presentation Layer**: Page modules and UI components
2. **API Layer**: Data fetching and HTTP communication
3. **Utility Layer**: Reusable helper functions
4. **Styling Layer**: Organized CSS with proper cascading

## Module Organization

### API Layer
- `http.js`: Base HTTP client for all API calls
- Domain-specific API modules wrap the HTTP client

### Page Layer
- Each page has its own module with a `render()` function
- Pages use API modules for data and components for UI

### Component Layer
- Reusable UI components that can be used across pages
- Components return HTML strings or DOM elements

### Utility Layer
- Pure functions for common operations
- No side effects or global state dependencies

## Implementation Status

This structure is currently being populated with code from the original monolithic application. See the tasks.md file in `.kiro/specs/frontend-restructure/` for implementation progress.
