# Design Document

## Overview

The SLMS frontend is a modern, single-page application (SPA) built with HTML, CSS (Tailwind CSS), and vanilla JavaScript. The application follows a component-based architecture with a focus on reusability, maintainability, and responsive design. The system uses client-side routing for navigation and localStorage for simulating data persistence (placeholder for future backend integration).

### Technology Stack

- **HTML5**: Semantic markup structure
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vanilla JavaScript**: Client-side logic and interactivity
- **Lucide Icons**: Modern icon library
- **Chart.js**: For dashboard visualizations (placeholder charts)

### Design Principles

- Mobile-first responsive design
- Component reusability
- Clean separation of concerns
- Accessibility compliance (WCAG 2.1 AA)
- Progressive enhancement

## Architecture

### Application Structure

```
slms-frontend/
├── index.html                 # Entry point / Dashboard
├── css/
│   └── styles.css            # Custom styles (if needed beyond Tailwind)
├── js/
│   ├── app.js                # Main application logic
│   ├── router.js             # Client-side routing
│   ├── components.js         # Reusable UI components
│   ├── data.js               # Mock data and localStorage management
│   └── utils.js              # Utility functions
├── pages/
│   ├── add-student.html      # Add new student form
│   ├── student-list.html     # Student list with search/filter
│   ├── student-details.html  # Individual student details
│   ├── documents.html        # Document management
│   ├── marks-attendance.html # Marks and attendance tracking
│   ├── alumni.html           # Alumni/post-graduation tracking
│   ├── login.html            # Admin login page
│   └── admin-dashboard.html  # Admin dashboard with stats
└── assets/
    ├── images/               # Placeholder images
    └── icons/                # Custom icons if needed
```

### Routing Strategy

The application uses hash-based routing (#/page-name) to enable navigation without server requests:

- `#/` or `#/dashboard` → Home Dashboard
- `#/add-student` → Add New Student
- `#/students` → Student List
- `#/student/:id` → Student Details
- `#/documents` → Documents Page
- `#/marks` → Marks & Attendance
- `#/alumni` → Alumni Page
- `#/login` → Login Page
- `#/admin` → Admin Dashboard

## Components and Interfaces

### 1. Layout Components

#### Sidebar Navigation
```javascript
Component: Sidebar
Props: activeRoute, userInfo
Features:
- Collapsible on mobile (hamburger menu)
- Active route highlighting
- Icon + text labels
- Links to all major pages
- User profile section at bottom
```

#### Top Navbar
```javascript
Component: Navbar
Props: pageTitle, showNotifications, userProfile
Features:
- System branding/logo
- Page title
- Notifications icon with badge
- User profile dropdown menu
- Responsive hamburger toggle for sidebar
```

### 2. Dashboard Components

#### Stat Card
```javascript
Component: StatCard
Props: {
  title: string,
  value: number,
  icon: string,
  color: string,
  trend: { value: number, direction: 'up'|'down' }
}
Features:
- Large number display
- Icon with colored background
- Optional trend indicator
- Hover effects
```

#### Chart Container
```javascript
Component: ChartContainer
Props: {
  title: string,
  chartType: 'bar'|'pie'|'line',
  data: array,
  height: number
}
Features:
- Chart.js integration
- Responsive sizing
- Legend display
- Placeholder data visualization
```

### 3. Form Components

#### Input Field
```javascript
Component: InputField
Props: {
  label: string,
  type: string,
  id: string,
  placeholder: string,
  required: boolean,
  value: string
}
Features:
- Label with required indicator
- Validation styling (error states)
- Help text support
- Icon support (prefix/suffix)
```

#### File Upload
```javascript
Component: FileUpload
Props: {
  label: string,
  accept: string,
  multiple: boolean,
  preview: boolean
}
Features:
- Drag and drop zone
- File preview (images)
- File size display
- Remove file button
```

#### Dropdown Select
```javascript
Component: Dropdown
Props: {
  label: string,
  options: array,
  value: string,
  placeholder: string
}
Features:
- Searchable options
- Custom styling
- Keyboard navigation
- Clear button
```

### 4. Data Display Components

#### Data Table
```javascript
Component: DataTable
Props: {
  columns: array,
  data: array,
  actions: array,
  pagination: boolean,
  sortable: boolean
}
Features:
- Sortable columns
- Row actions (view, edit, delete)
- Pagination controls
- Responsive (card view on mobile)
- Loading skeleton state
```

#### Student Card
```javascript
Component: StudentCard
Props: {
  student: object,
  showActions: boolean
}
Features:
- Profile photo
- Key student info
- Status badge
- Action buttons
- Click to view details
```

### 5. Modal Components

#### Confirmation Modal
```javascript
Component: ConfirmModal
Props: {
  title: string,
  message: string,
  confirmText: string,
  cancelText: string,
  onConfirm: function,
  onCancel: function,
  type: 'danger'|'warning'|'info'
}
Features:
- Backdrop overlay
- Icon based on type
- Confirm/cancel buttons
- Keyboard support (ESC to close)
```

#### Form Modal
```javascript
Component: FormModal
Props: {
  title: string,
  fields: array,
  onSubmit: function,
  onCancel: function
}
Features:
- Dynamic form generation
- Validation
- Submit/cancel buttons
- Scrollable content
```

### 6. UI Feedback Components

#### Loading Skeleton
```javascript
Component: Skeleton
Props: {
  type: 'card'|'table'|'list',
  count: number
}
Features:
- Animated shimmer effect
- Matches content layout
- Multiple skeleton types
```

#### Toast Notification
```javascript
Component: Toast
Props: {
  message: string,
  type: 'success'|'error'|'warning'|'info',
  duration: number
}
Features:
- Auto-dismiss
- Slide-in animation
- Icon based on type
- Close button
```

## Data Models

### Student Model
```javascript
{
  id: string (UUID),
  fullName: string,
  rollNumber: string,
  registrationNumber: string,
  semester: number,
  department: string,
  dateOfBirth: string (ISO date),
  nidNumber: string,
  phone: string,
  email: string,
  address: string,
  profilePhoto: string (base64 or URL),
  status: 'active' | 'inactive' | 'graduated',
  enrollmentDate: string (ISO date),
  createdAt: string (ISO timestamp),
  updatedAt: string (ISO timestamp)
}
```

### Document Model
```javascript
{
  id: string (UUID),
  studentId: string,
  fileName: string,
  fileType: string,
  category: 'NID' | 'Marksheet' | 'Certificate' | 'Attendance Sheet' | 'Other',
  uploadDate: string (ISO timestamp),
  fileSize: number (bytes),
  fileUrl: string (placeholder)
}
```

### Marks Model
```javascript
{
  id: string (UUID),
  studentId: string,
  semester: number,
  courses: [
    {
      courseCode: string,
      courseName: string,
      credits: number,
      marks: number,
      grade: string
    }
  ],
  gpa: number,
  cgpa: number
}
```

### Attendance Model
```javascript
{
  id: string (UUID),
  studentId: string,
  semester: number,
  courses: [
    {
      courseCode: string,
      courseName: string,
      totalClasses: number,
      attendedClasses: number,
      percentage: number
    }
  ],
  overallPercentage: number
}
```

### Alumni Model
```javascript
{
  id: string (UUID),
  studentId: string,
  currentStatus: 'Job' | 'Higher Study' | 'Business' | 'Other',
  companyOrUniversity: string,
  positionOrRole: string,
  startDate: string (ISO date),
  contactInfo: {
    phone: string,
    email: string,
    linkedin: string
  },
  graduationYear: number,
  updatedAt: string (ISO timestamp)
}
```

### Mock Data Storage

All data will be stored in localStorage with the following keys:
- `slms_students`: Array of student records
- `slms_documents`: Array of document records
- `slms_marks`: Array of marks records
- `slms_attendance`: Array of attendance records
- `slms_alumni`: Array of alumni records
- `slms_current_user`: Current logged-in user info

## Page Designs

### 1. Home Page (Dashboard Intro)

**Layout:**
- Full-width hero section with gradient background
- System name and tagline
- 4-column grid of stat cards (responsive to 2 cols on tablet, 1 col on mobile)
- Quick action buttons
- Recent activity section

**Components Used:**
- Navbar
- Sidebar
- StatCard (x4)
- Button components
- Activity list

### 2. Add New Student Page

**Layout:**
- Page header with title and breadcrumb
- Form container (max-width centered)
- Multi-section form with visual grouping:
  - Personal Information
  - Academic Information
  - Contact Information
- Profile photo upload (left side with preview)
- Form actions (Save, Cancel buttons)

**Components Used:**
- Navbar
- Sidebar
- InputField (multiple)
- Dropdown (semester, department)
- FileUpload (profile photo)
- Button components

**Validation:**
- Required field indicators
- Real-time validation feedback
- Form submission prevention if invalid

### 3. Student List Page

**Layout:**
- Page header with title
- Search and filter bar (sticky)
- Filter chips (active filters)
- Data table with pagination
- Mobile: Card-based list view

**Components Used:**
- Navbar
- Sidebar
- Search input
- Dropdown filters (semester, department, status)
- DataTable
- Pagination
- StudentCard (mobile view)

**Features:**
- Real-time search filtering
- Multi-criteria filtering
- Sort by columns
- Bulk actions (future enhancement)

### 4. Student Details Page

**Layout:**
- Page header with student name and back button
- Profile section (photo + key info)
- Tabbed interface:
  - Overview (all sections visible)
  - Documents
  - Academic Records
  - Enrollment History
- Action buttons (Edit, Delete, Upload Document)

**Components Used:**
- Navbar
- Sidebar
- Tabs
- Info cards (sectioned)
- Button components
- Document list
- Timeline (enrollment history)

### 5. Documents Page

**Layout:**
- Page header with upload button
- Filter by category
- Grid view of documents (card-based)
- Each card shows: icon, name, category, date, size
- Actions: View, Download, Delete

**Components Used:**
- Navbar
- Sidebar
- FileUpload (in modal)
- Document cards
- Filter dropdown
- ConfirmModal (delete)

### 6. Marks & Attendance Page

**Layout:**
- Page header with student selector dropdown
- Semester tabs
- Split view:
  - Left: Marks table with courses
  - Right: Attendance summary with percentage bars
- Add/Edit marks button
- Export button (UI only)

**Components Used:**
- Navbar
- Sidebar
- Tabs (semesters)
- DataTable (marks)
- Progress bars (attendance)
- FormModal (add/edit marks)

### 7. Alumni / Post-Graduation Page

**Layout:**
- Page header with "Add Alumni Record" button
- Filter bar (status, year, department)
- Grid view of alumni cards
- Each card shows: photo, name, current status, company/university
- Click to view full details

**Components Used:**
- Navbar
- Sidebar
- Alumni cards
- Filter controls
- FormModal (add/edit alumni)
- Detail view modal

### 8. Admin Login Page

**Layout:**
- Centered login card
- System logo and name
- Email and password fields
- Remember me checkbox
- Login button
- Forgot password link
- Background: Gradient or subtle pattern

**Components Used:**
- InputField (email, password)
- Checkbox
- Button
- Link

**Features:**
- Form validation
- Password visibility toggle
- Enter key submission

### 9. Admin Dashboard Page

**Layout:**
- Page header with date range selector
- 4-column stat cards (Total Students, Semesters, Documents, Alumni)
- 2-column chart section:
  - Left: Department-wise student ratio (pie chart)
  - Right: Semester-wise attendance (bar chart)
- Recent activities table
- Quick actions panel

**Components Used:**
- Navbar
- Sidebar
- StatCard (x4)
- ChartContainer (x2)
- DataTable (recent activities)
- Button components

## Design System

### Color Palette

**Primary Colors:**
- Primary Blue: `#3B82F6` (blue-500)
- Primary Dark: `#1E40AF` (blue-800)
- Primary Light: `#DBEAFE` (blue-100)

**Secondary Colors:**
- Indigo: `#6366F1` (indigo-500)
- Purple: `#8B5CF6` (purple-500)

**Semantic Colors:**
- Success: `#10B981` (green-500)
- Warning: `#F59E0B` (amber-500)
- Error: `#EF4444` (red-500)
- Info: `#3B82F6` (blue-500)

**Neutral Colors:**
- Gray 50-900 (Tailwind default scale)
- White: `#FFFFFF`
- Black: `#000000`

### Typography

**Font Family:**
- Primary: `Inter, system-ui, sans-serif`
- Monospace: `'Courier New', monospace` (for codes/numbers)

**Font Sizes:**
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

**Font Weights:**
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing

Using Tailwind's default spacing scale (0.25rem increments):
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### Border Radius

- sm: 0.25rem (4px)
- md: 0.375rem (6px)
- lg: 0.5rem (8px)
- xl: 0.75rem (12px)
- 2xl: 1rem (16px)
- full: 9999px (circular)

### Shadows

- sm: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- md: `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- lg: `0 10px 15px -3px rgb(0 0 0 / 0.1)`
- xl: `0 20px 25px -5px rgb(0 0 0 / 0.1)`

### Icons

Using Lucide Icons library:
- Size: 20px (default), 24px (large), 16px (small)
- Stroke width: 2px
- Color: Inherit from parent or semantic colors

**Common Icons:**
- Home: `home`
- Users: `users`
- User: `user`
- Plus: `plus`
- Edit: `edit`
- Trash: `trash`
- Search: `search`
- Filter: `filter`
- Upload: `upload`
- Download: `download`
- File: `file-text`
- Chart: `bar-chart`
- Bell: `bell`
- Settings: `settings`
- Logout: `log-out`

## Responsive Breakpoints

Following Tailwind CSS defaults:
- sm: 640px (mobile landscape)
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)
- 2xl: 1536px (extra large)

### Responsive Behavior

**Sidebar:**
- Desktop (lg+): Always visible, fixed position
- Tablet/Mobile (< lg): Hidden by default, overlay when opened

**Tables:**
- Desktop: Full table view
- Mobile: Card-based list view

**Stat Cards:**
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column

**Forms:**
- Desktop: 2-column layout where appropriate
- Mobile: Single column

## Error Handling

### Form Validation Errors
- Display inline error messages below fields
- Red border on invalid fields
- Prevent form submission
- Focus on first error field

### Network Errors (Future)
- Toast notification for failed operations
- Retry button
- Fallback to cached data

### Not Found States
- Empty state illustrations
- Helpful message
- Action button (e.g., "Add First Student")

### Loading States
- Skeleton screens for initial load
- Spinner for actions
- Disable buttons during processing
- Progress indicators for uploads

## Testing Strategy

### Manual Testing Checklist

**Responsive Testing:**
- Test all pages at breakpoints: 375px, 768px, 1024px, 1440px
- Verify sidebar collapse/expand
- Check table to card transitions
- Verify form layouts

**Navigation Testing:**
- Test all navigation links
- Verify active route highlighting
- Test browser back/forward buttons
- Verify breadcrumb navigation

**Form Testing:**
- Test all input types
- Verify validation messages
- Test file upload UI
- Test form submission
- Test cancel/reset functionality

**Component Testing:**
- Test modal open/close
- Test dropdown interactions
- Test tab switching
- Test pagination
- Test search and filter

**Accessibility Testing:**
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader compatibility
- Color contrast ratios (WCAG AA)
- Focus indicators
- ARIA labels

**Browser Testing:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Test Data

Create mock data sets:
- 50+ student records with varied data
- Multiple documents per student
- Marks and attendance for multiple semesters
- Alumni records with different statuses
- Ensure data covers edge cases (long names, special characters, etc.)

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading:**
   - Load images on demand
   - Defer non-critical JavaScript
   - Load chart library only on dashboard pages

2. **Code Splitting:**
   - Separate JS files per page
   - Load only required components

3. **Asset Optimization:**
   - Compress images
   - Use SVG for icons
   - Minify CSS and JS for production

4. **Caching:**
   - Cache static assets
   - Use localStorage efficiently
   - Implement service worker (future enhancement)

5. **Rendering:**
   - Virtual scrolling for large lists
   - Debounce search inputs
   - Throttle scroll events

### Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## Accessibility

### WCAG 2.1 AA Compliance

**Keyboard Navigation:**
- All interactive elements accessible via keyboard
- Logical tab order
- Visible focus indicators
- Skip to main content link

**Screen Readers:**
- Semantic HTML elements
- ARIA labels for icons and buttons
- ARIA live regions for dynamic content
- Alt text for images

**Visual:**
- Color contrast ratio ≥ 4.5:1 for text
- Color contrast ratio ≥ 3:1 for UI components
- Text resizable up to 200%
- No information conveyed by color alone

**Forms:**
- Labels associated with inputs
- Error messages announced
- Required fields indicated
- Help text available

## Future Enhancements

1. **Backend Integration:**
   - Replace localStorage with API calls
   - Real authentication
   - File upload to server
   - Real-time updates

2. **Advanced Features:**
   - Bulk operations
   - Advanced search with filters
   - Export to PDF/Excel
   - Email notifications
   - Print-friendly views

3. **Progressive Web App:**
   - Service worker for offline support
   - Install prompt
   - Push notifications

4. **Analytics:**
   - User behavior tracking
   - Performance monitoring
   - Error logging

5. **Internationalization:**
   - Multi-language support
   - Date/time localization
   - RTL support
