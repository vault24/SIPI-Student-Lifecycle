# Design Document: Dashboard Restructure

## Overview

This design document outlines the restructuring of the dashboard pages to consolidate analytics features. The main Dashboard will be enhanced with Semester-wise Attendance Overview and Department-wise Student Distribution charts, while the Admin Dashboard will be simplified to focus on essential administrative functions. This eliminates duplication and provides users with comprehensive analytics on the primary dashboard.

## Architecture

The restructuring follows a component-based architecture:

```
Dashboard Layer
├── Main Dashboard (dashboardPage.js)
│   ├── Premium Stat Cards
│   ├── Quick Actions
│   ├── Semester-wise Attendance Chart
│   ├── Department-wise Distribution Chart
│   └── Recent Activity
│
└── Admin Dashboard (adminDashboardPage.js)
    ├── Premium Stat Cards
    ├── Quick Actions (Essential only)
    └── [Charts removed]
```

## Components and Interfaces

### 1. Chart Components

#### AttendanceChart Component
- **Purpose**: Renders semester-wise attendance overview as a bar chart
- **Input**: Array of semesters and corresponding attendance percentages
- **Output**: Rendered Chart.js bar chart
- **Dependencies**: Chart.js library

#### DepartmentDistributionChart Component
- **Purpose**: Renders department-wise student distribution as a pie chart
- **Input**: Array of department names and student counts
- **Output**: Rendered Chart.js pie chart
- **Dependencies**: Chart.js library

### 2. Data Fetching

#### Dashboard Data Service
- **getAttendanceData()**: Fetches semester-wise attendance statistics from backend
- **getDepartmentDistribution()**: Fetches department-wise student counts from backend
- **getAdminStats()**: Fetches essential admin statistics

### 3. UI Components

#### Main Dashboard Layout
```
┌─────────────────────────────────────────┐
│ Hero Section with Gradient              │
├─────────────────────────────────────────┤
│ Stat Cards (4 columns)                  │
├─────────────────────────────────────────┤
│ Quick Actions (4 buttons)               │
├─────────────────────────────────────────┤
│ Charts Row (2 columns)                  │
│ ├─ Attendance Chart                     │
│ └─ Department Distribution Chart        │
├─────────────────────────────────────────┤
│ Recent Activity                         │
└─────────────────────────────────────────┘
```

#### Admin Dashboard Layout
```
┌─────────────────────────────────────────┐
│ Stat Cards (4 columns)                  │
├─────────────────────────────────────────┤
│ Quick Actions (3 buttons - Essential)   │
└─────────────────────────────────────────┘
```

## Data Models

### AttendanceData
```javascript
{
  semesters: ['Sem 1', 'Sem 2', ..., 'Sem 8'],
  attendancePercentages: [85, 88, 82, 90, 87, 89, 84, 86]
}
```

### DepartmentDistribution
```javascript
{
  departments: ['CSE', 'ECE', 'ME', 'CE'],
  studentCounts: [150, 120, 100, 80]
}
```

### DashboardStats
```javascript
{
  students: {
    total: number,
    active: number
  },
  alumni: {
    total: number
  },
  documents: {
    total: number
  }
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Attendance Chart Data Completeness
*For any* valid attendance data fetch, the rendered attendance chart SHALL display exactly 8 semesters with corresponding attendance percentages between 0 and 100.
**Validates: Requirements 1.4**

### Property 2: Department Distribution Chart Accuracy
*For any* valid department distribution data, the sum of all student counts in the pie chart SHALL equal the total number of students in the system.
**Validates: Requirements 1.5**

### Property 3: Admin Dashboard Feature Removal
*For any* admin dashboard render, the page SHALL NOT contain the Semester-wise Attendance Overview chart or Department-wise Student Distribution chart elements.
**Validates: Requirements 2.2, 2.3**

### Property 4: Main Dashboard Chart Presence
*For any* main dashboard render, the page SHALL contain both the Semester-wise Attendance Overview chart and the Department-wise Student Distribution chart.
**Validates: Requirements 1.1, 1.2**

### Property 5: Chart Styling Consistency
*For any* chart rendered on the main dashboard, the chart container SHALL use the glass-card styling class and maintain consistent spacing with other dashboard elements.
**Validates: Requirements 1.3**

### Property 6: Error Handling for Missing Data
*For any* dashboard render where chart data is unavailable, the system SHALL display a graceful error message or placeholder instead of breaking the page layout.
**Validates: Requirements 3.4**

## Error Handling

### Chart Rendering Errors
- If Chart.js library fails to load, display a fallback message
- If chart data is null or undefined, render a placeholder with "Data unavailable" message
- If API calls fail, catch errors and display user-friendly error messages

### Data Fetching Errors
- Implement retry logic for failed API calls
- Display loading skeletons while data is being fetched
- Show error toast notifications if data cannot be retrieved

### Graceful Degradation
- Charts should not block page rendering if data is unavailable
- Admin dashboard should remain functional even if stat cards fail to load
- Main dashboard should display all available content even if one chart fails

## Testing Strategy

### Unit Testing
- Test chart component initialization with various data inputs
- Test data transformation functions for attendance and department data
- Test error handling when data is missing or malformed
- Test that admin dashboard does not render removed charts

### Property-Based Testing
- **Property 1**: Generate random attendance data and verify chart displays all 8 semesters with valid percentages
- **Property 2**: Generate random department distributions and verify pie chart sum equals total students
- **Property 3**: Render admin dashboard and verify absence of attendance and distribution charts
- **Property 4**: Render main dashboard and verify presence of both charts
- **Property 5**: Render charts and verify glass-card styling is applied
- **Property 6**: Test with missing/null data and verify graceful error handling

### Testing Framework
- Use Jest for unit testing
- Use fast-check for property-based testing
- Minimum 100 iterations per property test
- Mock Chart.js for unit tests to avoid DOM dependencies

### Integration Testing
- Test full dashboard page load with real API calls
- Verify charts render correctly with backend data
- Test navigation between main dashboard and admin dashboard
- Verify no console errors or warnings during rendering
