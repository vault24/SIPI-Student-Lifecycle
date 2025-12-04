/**
 * Unit tests for NotificationBell component
 */

describe('NotificationBell', () => {
    let notificationBell;

    beforeEach(() => {
        // Mock window.appConfig
        window.appConfig = {
            API_BASE_URL: 'http://localhost:8000'
        };

        // Mock localStorage
        localStorage.setItem('authToken', 'test-token');

        notificationBell = new NotificationBell();
    });

    afterEach(() => {
        // Clean up
        if (notificationBell.bellElement) {
            notificationBell.bellElement.remove();
        }
        notificationBell.stopAutoUpdate();
        localStorage.clear();
    });

    test('should initialize with zero unread count', () => {
        expect(notificationBell.unreadCount).toBe(0);
        expect(notificationBell.recentNotifications).toEqual([]);
    });

    test('should create UI elements', () => {
        notificationBell.createUI();
        
        expect(notificationBell.bellElement).toBeDefined();
        expect(document.querySelector('.notification-bell')).toBeDefined();
        expect(document.getElementById('notificationBadge')).toBeDefined();
        expect(document.getElementById('notificationDropdown')).toBeDefined();
    });

    test('should update badge with unread count', () => {
        notificationBell.createUI();
        notificationBell.unreadCount = 5;
        notificationBell.updateBadge();
        
        const badge = document.getElementById('notificationBadge');
        expect(badge.textContent).toBe('5');
        expect(badge.style.display).not.toBe('none');
    });

    test('should hide badge when unread count is zero', () => {
        notificationBell.createUI();
        notificationBell.unreadCount = 0;
        notificationBell.updateBadge();
        
        const badge = document.getElementById('notificationBadge');
        expect(badge.style.display).toBe('none');
    });

    test('should format notification type correctly', () => {
        const formatted = notificationBell.formatType('application_status');
        expect(formatted).toBe('Application');

        const formatted2 = notificationBell.formatType('system_announcement');
        expect(formatted2).toBe('Announcement');
    });

    test('should format time correctly', () => {
        const now = new Date();
        const timeStr = now.toISOString();
        
        const formatted = notificationBell.formatTime(timeStr);
        expect(formatted).toBe('Just now');
    });

    test('should escape HTML to prevent XSS', () => {
        const dangerous = '<img src=x onerror="alert(1)">';
        const escaped = notificationBell.escapeHtml(dangerous);
        
        expect(escaped).not.toContain('onerror');
        expect(escaped).toContain('&lt;');
    });

    test('should get auth token from localStorage', () => {
        const token = notificationBell.getAuthToken();
        expect(token).toBe('test-token');
    });

    test('should toggle dropdown visibility', () => {
        notificationBell.createUI();
        const dropdown = document.getElementById('notificationDropdown');
        
        notificationBell.toggleDropdown();
        expect(dropdown.classList.contains('active')).toBe(true);
        
        notificationBell.toggleDropdown();
        expect(dropdown.classList.contains('active')).toBe(false);
    });

    test('should close dropdown', () => {
        notificationBell.createUI();
        const dropdown = document.getElementById('notificationDropdown');
        dropdown.classList.add('active');
        
        notificationBell.closeDropdown();
        expect(dropdown.classList.contains('active')).toBe(false);
    });

    test('should render empty state when no notifications', () => {
        notificationBell.createUI();
        notificationBell.recentNotifications = [];
        notificationBell.renderDropdownContent();
        
        const content = document.getElementById('dropdownContent');
        expect(content.textContent).toContain('No new notifications');
    });

    test('should render notification previews', () => {
        notificationBell.createUI();
        notificationBell.recentNotifications = [
            {
                id: 1,
                title: 'Test Notification',
                message: 'This is a test notification message',
                notification_type: 'application_status',
                created_at: new Date().toISOString()
            }
        ];
        notificationBell.renderDropdownContent();
        
        const content = document.getElementById('dropdownContent');
        expect(content.textContent).toContain('Test Notification');
        expect(content.textContent).toContain('This is a test notification');
    });

    test('should start auto-update interval', () => {
        notificationBell.startAutoUpdate();
        expect(notificationBell.updateInterval).toBeDefined();
        
        notificationBell.stopAutoUpdate();
        expect(notificationBell.updateInterval).toBeNull();
    });

    test('should destroy notification bell', () => {
        notificationBell.createUI();
        expect(document.querySelector('.notification-bell-container')).toBeDefined();
        
        notificationBell.destroy();
        expect(document.querySelector('.notification-bell-container')).toBeNull();
    });
});
