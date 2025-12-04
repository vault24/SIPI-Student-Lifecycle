/**
 * Unit tests for NotificationCenter component
 */

describe('NotificationCenter', () => {
    let notificationCenter;

    beforeEach(() => {
        // Mock window.appConfig
        window.appConfig = {
            API_BASE_URL: 'http://localhost:8000'
        };

        // Mock localStorage
        localStorage.setItem('authToken', 'test-token');

        notificationCenter = new NotificationCenter();
    });

    afterEach(() => {
        // Clean up
        if (notificationCenter.container) {
            notificationCenter.container.remove();
        }
        localStorage.clear();
    });

    test('should initialize with empty notifications', () => {
        expect(notificationCenter.notifications).toEqual([]);
        expect(notificationCenter.currentFilter).toBe('all');
        expect(notificationCenter.searchQuery).toBe('');
    });

    test('should create UI elements', () => {
        notificationCenter.createUI();
        
        expect(notificationCenter.container).toBeDefined();
        expect(document.querySelector('.notification-center')).toBeDefined();
        expect(document.getElementById('notificationSearch')).toBeDefined();
        expect(document.getElementById('statusFilter')).toBeDefined();
        expect(document.getElementById('typeFilter')).toBeDefined();
    });

    test('should format notification type correctly', () => {
        const formatted = notificationCenter.formatType('application_status');
        expect(formatted).toBe('Application');

        const formatted2 = notificationCenter.formatType('document_approval');
        expect(formatted2).toBe('Document');
    });

    test('should format time correctly', () => {
        const now = new Date();
        const timeStr = now.toISOString();
        
        const formatted = notificationCenter.formatTime(timeStr);
        expect(formatted).toBe('Just now');
    });

    test('should escape HTML to prevent XSS', () => {
        const dangerous = '<script>alert("xss")</script>';
        const escaped = notificationCenter.escapeHtml(dangerous);
        
        expect(escaped).not.toContain('<script>');
        expect(escaped).toContain('&lt;');
    });

    test('should get auth token from localStorage', () => {
        const token = notificationCenter.getAuthToken();
        expect(token).toBe('test-token');
    });

    test('should render empty state when no notifications', () => {
        notificationCenter.createUI();
        notificationCenter.notifications = [];
        notificationCenter.renderNotifications();
        
        const listContainer = document.getElementById('notificationList');
        expect(listContainer.textContent).toContain('No notifications');
    });

    test('should render notifications list', () => {
        notificationCenter.createUI();
        notificationCenter.notifications = [
            {
                id: 1,
                title: 'Test Notification',
                message: 'Test message',
                notification_type: 'application_status',
                status: 'unread',
                created_at: new Date().toISOString()
            }
        ];
        notificationCenter.renderNotifications();
        
        const listContainer = document.getElementById('notificationList');
        expect(listContainer.textContent).toContain('Test Notification');
        expect(listContainer.textContent).toContain('Test message');
    });

    test('should update search query', () => {
        notificationCenter.createUI();
        const searchInput = document.getElementById('notificationSearch');
        
        searchInput.value = 'test query';
        searchInput.dispatchEvent(new Event('input'));
        
        expect(notificationCenter.searchQuery).toBe('test query');
    });

    test('should update status filter', () => {
        notificationCenter.createUI();
        const statusFilter = document.getElementById('statusFilter');
        
        statusFilter.value = 'read';
        statusFilter.dispatchEvent(new Event('change'));
        
        expect(notificationCenter.currentFilter).toBe('read');
    });

    test('should update type filter', () => {
        notificationCenter.createUI();
        const typeFilter = document.getElementById('typeFilter');
        
        typeFilter.value = 'document_approval';
        typeFilter.dispatchEvent(new Event('change'));
        
        expect(notificationCenter.currentType).toBe('document_approval');
    });

    test('should close notification center', () => {
        notificationCenter.createUI();
        expect(document.querySelector('.notification-center')).toBeDefined();
        
        notificationCenter.close();
        expect(document.querySelector('.notification-center')).toBeNull();
    });
});
