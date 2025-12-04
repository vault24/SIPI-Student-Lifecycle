# Requirements Document: Dashboard Restructure

## Introduction

This feature involves restructuring the dashboard pages to consolidate analytics and reporting features. The "Semester-wise Attendance Overview" and "Department-wise Student Distribution" charts currently exist only in the Admin Dashboard and need to be transferred to the main Dashboard. The Admin Dashboard will be cleaned up to contain only essential administrative features, reducing duplication and improving user experience.

## Glossary

- **Dashboard**: The main landing page accessible to all authenticated users, showing system overview and key metrics
- **Admin Dashboard**: A specialized dashboard for administrative users with advanced analytics and management features
- **Semester-wise Attendance Overview**: A bar chart showing average attendance percentages across all 8 semesters
- **Department-wise Student Distribution**: A pie chart showing the number of students distributed across different departments
- **Premium Components**: Enhanced UI components with gradients, animations, and modern styling

## Requirements

### Requirement 1

**User Story:** As a user, I want to see comprehensive analytics on the main dashboard, so that I can quickly understand system-wide attendance and department distribution without navigating to a separate admin page.

#### Acceptance Criteria

1. WHEN the main dashboard loads THEN the system SHALL display the Semester-wise Attendance Overview chart below the quick actions section
2. WHEN the main dashboard loads THEN the system SHALL display the Department-wise Student Distribution chart alongside the attendance chart
3. WHEN viewing the charts THEN the system SHALL render them with consistent styling matching the premium dashboard design
4. WHEN the page loads THEN the system SHALL fetch real attendance data from the backend for all semesters
5. WHEN the page loads THEN the system SHALL fetch real department distribution data from the backend

### Requirement 2

**User Story:** As an admin, I want the Admin Dashboard to focus on essential administrative functions, so that I can quickly access critical management features without visual clutter.

#### Acceptance Criteria

1. WHEN the admin dashboard loads THEN the system SHALL display only essential admin features (Add Student, Upload Documents, View All Students)
2. WHEN the admin dashboard loads THEN the system SHALL remove the Semester-wise Attendance Overview chart
3. WHEN the admin dashboard loads THEN the system SHALL remove the Department-wise Student Distribution chart
4. WHEN the admin dashboard loads THEN the system SHALL remove the Recent Activities table
5. WHEN the admin dashboard loads THEN the system SHALL maintain a clean, focused layout with only critical quick action buttons

### Requirement 3

**User Story:** As a developer, I want the code to be well-organized and maintainable, so that future modifications are straightforward and the codebase remains clean.

#### Acceptance Criteria

1. WHEN reviewing the code THEN the system SHALL have no duplicate chart rendering logic between dashboard pages
2. WHEN reviewing the code THEN the system SHALL have reusable chart components for attendance and department distribution
3. WHEN the dashboard pages are loaded THEN the system SHALL properly initialize all chart libraries and dependencies
4. WHEN the pages render THEN the system SHALL handle errors gracefully if chart data is unavailable
