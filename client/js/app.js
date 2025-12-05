// Main Application Entry Point for SLMS
// This file only handles initialization and route registration

(function() {
    'use strict';

    // Initialize app on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 SLMS Application Starting...');
        
        // Note: Mock data initialization removed - now using backend API
        
        // Render layout components
        renderSidebar();
        renderNavbar('Dashboard');
        
        // Register all routes
        registerRoutes();
        
        // Initialize Lucide icons
        lucide.createIcons();
        
        // Initialize real-time notification manager if user is authenticated
        setTimeout(() => {
            const authToken = localStorage.getItem('authToken');
            if (authToken && window.RealTimeNotificationManager) {
                if (!window.realTimeNotificationManager) {
                    window.realTimeNotificationManager = new RealTimeNotificationManager();
                    window.realTimeNotificationManager.connect();
                    console.log('✅ Real-time notification manager connected');
                }
            }
        }, 500);
        
        console.log('✅ SLMS Application Ready - Connected to Backend API');
    });

    // Register all application routes
    function registerRoutes() {
        console.log('📝 Registering routes...');
        console.log('Available pages:', {
            DashboardPage: typeof DashboardPage,
            AddStudentPage: typeof AddStudentPage,
            StudentListPage: typeof StudentListPage,
            DocumentsPage: typeof DocumentsPage,
            MarksAttendancePage: typeof MarksAttendancePage,
            AlumniPage: typeof AlumniPage,
            DepartmentsPage: typeof DepartmentsPage
        });
        
        // Dashboard
        router.register('/', DashboardPage.render);
        
        // Student Management
        router.register('/add-student', AddStudentPage.render);
        router.register('/students', StudentListPage.render);
        router.register('/student/:id', StudentDetailsPage.render);
        router.register('/edit-student/:id', EditStudentPage.render);
        router.register('/download-documents', DownloadDocumentsPage.render);
        router.register('/document-viewer/:studentId/:documentType', DocumentViewerPage.render);
        
        // Documents
        router.register('/documents', DocumentsPage.render);
        
        // Marks & Attendance
        router.register('/marks', MarksAttendancePage.render);
        
        // Alumni Management
        router.register('/alumni', AlumniPage.render);
        router.register('/alumni/:id', AlumniDetailsPage.render);
        router.register('/edit-alumni/:id', EditAlumniPage.render);
        
        // Discontinued Students
        router.register('/discontinued', DiscontinuedStudentsPage.render);
        
        // Applications
        router.register('/apply', renderPublicApplicationForm); // From applications.js
        router.register('/applications', renderApplications); // From applications-admin.js
        router.register('/application/:id', renderApplicationDetails); // From applications-admin.js
        router.register('/application-documents/:applicationId', renderApplicationDocumentSelection); // From applicationDocumentSelectionPage.js
        router.register('/application-document-viewer/:applicationId/:documentType', renderApplicationDocumentViewer); // From applicationDocumentViewerPage.js
        
        // Admin & Auth
        router.register('/login', LoginPage.render);
        router.register('/admin', AdminDashboardPage.render);
        
        // Departments
        router.register('/departments', DepartmentsPage.render);
        router.register('/department/:id', DepartmentViewPage.render);
        
        console.log('✅ Routes registered');
    }

    // Global utility functions
    function logout() {
        if (window.authMiddleware) {
            window.authMiddleware.logout();
        } else {
            dataManager.logout();
            showToast('Logged out successfully', 'success');
            navigateTo('/login');
        }
    }

    // Export global functions
    window.logout = logout;
    window.renderDashboard = () => DashboardPage.render(); // For backward compatibility

})();
