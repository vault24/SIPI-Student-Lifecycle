# Requirements Document

## Introduction

The Institute Student Lifecycle Management System (SLMS) is a comprehensive web-based frontend application designed to manage and track student information throughout their entire academic journey—from admission through graduation and into post-graduation life. This system provides a modern, intuitive interface for viewing, managing, and organizing student data, academic records, documents, and alumni information. The frontend will be built as a standalone UI that can later be integrated with backend APIs.

## Glossary

- **SLMS**: Student Lifecycle Management System - the complete web application
- **Student Record**: A complete set of information about a student including personal, academic, and contact details
- **Alumni**: Former students who have graduated from the institute
- **Document**: Digital files associated with students (NID, certificates, marksheets, etc.)
- **Dashboard**: The main overview interface showing system statistics and navigation
- **Admin User**: The person using the system to manage student information
- **Semester**: An academic term or period in the student's education
- **Department**: An academic division or field of study within the institute
- **Roll Number**: A unique identifier assigned to each student
- **Registration Number**: An official registration identifier for the student
- **NID**: National Identification Document

## Requirements

### Requirement 1

**User Story:** As an admin user, I want to view a comprehensive dashboard overview, so that I can quickly understand the current state of the student database and navigate to different modules.

#### Acceptance Criteria

1. WHEN the Admin User accesses the home page, THE SLMS SHALL display the system name "Institute Student Lifecycle Management System"
2. THE SLMS SHALL display overview cards showing Total Students count, Active Students count, Alumni count, and Documents count
3. THE SLMS SHALL provide navigation buttons or links to all major modules (Add Student, Student List, Documents, Marks & Attendance, Alumni)
4. THE SLMS SHALL include a hero section with a description of the system purpose
5. THE SLMS SHALL render the dashboard interface in a responsive layout for desktop and mobile devices

### Requirement 2

**User Story:** As an admin user, I want to add new student information through a form, so that I can register students in the system.

#### Acceptance Criteria

1. THE SLMS SHALL provide a form with input fields for Full Name, Roll Number, Registration Number, Semester, Department, Date of Birth, NID Number, Phone, Email, and Address
2. THE SLMS SHALL include a profile photo upload interface element
3. WHEN the Admin User enters data into form fields, THE SLMS SHALL display the entered values
4. THE SLMS SHALL provide a submit button to complete the form entry process
5. THE SLMS SHALL display the form in a clean card-based layout with proper field labels

### Requirement 3

**User Story:** As an admin user, I want to view a list of all students with search and filter capabilities, so that I can quickly find specific students or groups of students.

#### Acceptance Criteria

1. THE SLMS SHALL display a table showing Student Records with columns for Profile Photo, Name, Roll Number, Semester, and Status
2. THE SLMS SHALL provide a search bar interface for filtering by name, roll number, or semester
3. THE SLMS SHALL provide filter controls for semester, department, and status
4. WHEN the Admin User clicks a View or Edit button on a student row, THE SLMS SHALL navigate to the student details page
5. THE SLMS SHALL render the table in a responsive format that adapts to mobile screens

### Requirement 4

**User Story:** As an admin user, I want to view detailed information about a specific student, so that I can access all their personal, academic, and contact information in one place.

#### Acceptance Criteria

1. THE SLMS SHALL display student information organized in sections: Personal Info, Academic Info, Contact Info, Enrollment History, and Documents
2. THE SLMS SHALL provide action buttons for Upload Document, Edit, and Delete operations
3. THE SLMS SHALL display all student data fields in a readable card-based layout
4. THE SLMS SHALL show the student's profile photo prominently on the details page
5. THE SLMS SHALL include navigation to return to the student list

### Requirement 5

**User Story:** As an admin user, I want to manage student documents, so that I can upload, view, and organize important files associated with each student.

#### Acceptance Criteria

1. THE SLMS SHALL provide a document upload form interface with file selection capability
2. THE SLMS SHALL include a dropdown for document category selection (NID, Marksheet, Certificate, Attendance Sheet)
3. THE SLMS SHALL display a list of uploaded documents with preview icons
4. WHEN the Admin User views the documents list, THE SLMS SHALL show document name, category, and upload date
5. THE SLMS SHALL provide action buttons for viewing and deleting documents

### Requirement 6

**User Story:** As an admin user, I want to view and manage student marks and attendance, so that I can track academic performance throughout different semesters.

#### Acceptance Criteria

1. THE SLMS SHALL display a table showing courses with marks entry fields
2. THE SLMS SHALL provide semester-wise tabs for organizing marks and attendance by academic term
3. THE SLMS SHALL display attendance percentage for each student in a visual format
4. THE SLMS SHALL include a form interface for entering marks data
5. THE SLMS SHALL organize the marks and attendance interface in a clear tabular layout

### Requirement 7

**User Story:** As an admin user, I want to track alumni and post-graduation information, so that I can maintain contact with graduates and understand their career paths.

#### Acceptance Criteria

1. THE SLMS SHALL provide a form with fields for Current Status, Company/University, Position/Role, Start Date, and Contact Info
2. THE SLMS SHALL include a dropdown for Current Status with options: Job, Higher Study, Business, Other
3. THE SLMS SHALL display a list view of all alumni records
4. WHEN the Admin User views alumni information, THE SLMS SHALL show current employment or education status
5. THE SLMS SHALL organize alumni data in a searchable and filterable format

### Requirement 8

**User Story:** As an admin user, I want to log into the system, so that I can access the student management features securely.

#### Acceptance Criteria

1. THE SLMS SHALL provide a login page with input fields for Email and Password
2. THE SLMS SHALL include a "Forgot Password" link on the login page
3. THE SLMS SHALL display the login form in a centered, professional layout
4. THE SLMS SHALL provide a login button to submit credentials
5. THE SLMS SHALL render the login page with the system branding and styling

### Requirement 9

**User Story:** As an admin user, I want to view an admin dashboard with system statistics and visualizations, so that I can monitor overall system metrics and trends.

#### Acceptance Criteria

1. THE SLMS SHALL display statistic cards showing Total Students, Total Semesters, Total Documents, and Alumni Count
2. THE SLMS SHALL include placeholder chart interfaces for department-wise student ratio
3. THE SLMS SHALL include placeholder chart interfaces for semester-wise attendance overview
4. THE SLMS SHALL organize dashboard statistics in a grid layout
5. THE SLMS SHALL provide visual indicators and icons for each statistic card

### Requirement 10

**User Story:** As an admin user, I want to navigate through the system using a consistent navigation structure, so that I can easily access different modules and features.

#### Acceptance Criteria

1. THE SLMS SHALL provide a sidebar navigation menu with links to all major pages
2. THE SLMS SHALL include a top navbar with system branding and user profile menu
3. THE SLMS SHALL display a notifications icon in the navbar
4. WHEN the Admin User clicks navigation items, THE SLMS SHALL highlight the active page
5. THE SLMS SHALL render the navigation in a responsive format that collapses on mobile devices

### Requirement 11

**User Story:** As an admin user, I want to see loading states and modal dialogs for actions, so that I understand when the system is processing and can confirm important operations.

#### Acceptance Criteria

1. THE SLMS SHALL display loading skeleton interfaces while content is being prepared
2. THE SLMS SHALL provide modal popup interfaces for Delete confirmations
3. THE SLMS SHALL provide modal popup interfaces for Edit operations
4. THE SLMS SHALL provide modal popup interfaces for Upload operations
5. WHEN the Admin User triggers an action requiring confirmation, THE SLMS SHALL display an appropriate modal dialog

### Requirement 12

**User Story:** As an admin user, I want the interface to follow a modern, professional design system, so that the application is visually appealing and easy to use.

#### Acceptance Criteria

1. THE SLMS SHALL use a light theme with blue or indigo accent colors throughout the interface
2. THE SLMS SHALL implement Tailwind CSS or equivalent utility CSS framework for styling
3. THE SLMS SHALL include icons from Lucide or similar icon library
4. THE SLMS SHALL use card-based layouts for organizing content sections
5. THE SLMS SHALL maintain consistent spacing, typography, and color schemes across all pages

### Requirement 13

**User Story:** As an admin user, I want to view and manage students who have discontinued their studies, so that I can track students who left the institute and potentially reinstate them if they return.

#### Acceptance Criteria

1. THE SLMS SHALL provide a sidebar navigation menu item labeled "Discontinued Students" with a user-x icon positioned near the Alumni menu item
2. WHEN the Admin User navigates to the discontinued students page, THE SLMS SHALL display a list of all Student Records where status equals "discontinued"
3. THE SLMS SHALL display discontinued students in a table format with columns for Name, Roll Number, Department, Last Semester, and Reason
4. THE SLMS SHALL display a status badge in yellow or gray color for discontinued students
5. THE SLMS SHALL provide a View button for each discontinued student to access their full profile
6. THE SLMS SHALL provide a Reinstate button for each discontinued student to change their status back to "active"
7. THE SLMS SHALL include search and filter functionality for discontinued students by name, roll number, or department
8. WHEN the Admin User clicks the Reinstate button, THE SLMS SHALL display a confirmation modal before changing the student status
9. WHEN a student is reinstated, THE SLMS SHALL update the student status to "active" and display a success notification
10. THE SLMS SHALL highlight the Discontinued Students menu item when the page is active
