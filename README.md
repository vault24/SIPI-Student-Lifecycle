# Institute Student Lifecycle Management System (SLMS)

A modern, comprehensive frontend web application for managing student information throughout their entire academic journey—from admission through graduation and into post-graduation life.

## Features

### 📊 Dashboard
- Overview statistics (Total Students, Active Students, Alumni, Documents)
- Quick action buttons for common tasks
- Recent activity feed

### 👥 Student Management
- Add new students with comprehensive information
- View and search all students
- Filter by semester, department, and status
- Detailed student profiles with all information
- Edit and delete student records

### 📄 Document Management
- Upload and organize student documents
- Categorize documents (NID, Marksheet, Certificate, Attendance Sheet, etc.)
- Filter documents by category
- View and delete documents

### 📚 Marks & Attendance
- Track student marks by semester and course
- View GPA and CGPA calculations
- Monitor attendance percentages
- Visual progress bars for attendance tracking

### 🎓 Alumni Tracking
- Maintain post-graduation records
- Track employment and higher education status
- Filter alumni by status and graduation year
- Contact information management

### 🔐 Admin Features
- Secure login interface
- Admin dashboard with analytics
- Department-wise student distribution charts
- Semester-wise attendance overview
- Recent activities tracking

## Technology Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - Client-side logic
- **Lucide Icons** - Modern icon library
- **Chart.js** - Data visualization
- **LocalStorage** - Client-side data persistence

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No server or backend required - runs entirely in the browser

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. That's it! The application will automatically initialize with mock data

### Usage

1. **Login**: Use any email and password to access the system (mock authentication)
2. **Navigate**: Use the sidebar to access different modules
3. **Add Students**: Click "Add Student" to register new students
4. **Manage Data**: Use the various pages to view, edit, and manage student information
5. **Upload Documents**: Add documents for students through the Documents page
6. **Track Progress**: Monitor marks and attendance in the dedicated section
7. **Alumni Records**: Maintain post-graduation information

## Project Structure

```
slms-frontend/
├── index.html              # Main entry point
├── css/
│   └── styles.css         # Custom styles
├── js/
│   ├── app.js             # Main application logic and page renderers
│   ├── router.js          # Client-side routing
│   ├── components.js      # Reusable UI components
│   ├── data.js            # Data management and mock data
│   └── utils.js           # Utility functions
├── pages/                 # Page templates (loaded dynamically)
└── README.md             # This file
```

## Features in Detail

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile devices
- Responsive tables that transform to cards on small screens
- Touch-friendly interface

### Data Management
- All data stored in browser's localStorage
- Automatic mock data generation on first load
- CRUD operations for all entities
- Data persistence across sessions

### User Interface
- Clean, modern design with blue/indigo color scheme
- Card-based layouts
- Smooth transitions and animations
- Toast notifications for user feedback
- Modal dialogs for confirmations and forms
- Loading skeletons for better UX

### Search and Filtering
- Real-time search across student records
- Multi-criteria filtering (semester, department, status)
- Category-based document filtering
- Alumni filtering by status and year

### Accessibility
- Keyboard navigation support
- Focus indicators
- Semantic HTML
- ARIA labels where needed
- High contrast ratios

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend API integration
- Real authentication and authorization
- File upload to server
- Export to PDF/Excel
- Email notifications
- Advanced analytics
- Bulk operations
- Print-friendly views
- Progressive Web App (PWA) features

## License

This project is created for educational and demonstration purposes.

## Support

For issues or questions, please refer to the project documentation or contact the development team.

---

**Note**: This is a frontend-only application. All data is stored locally in the browser and will be lost if you clear your browser's localStorage. For production use, integrate with a backend API for persistent data storage.
