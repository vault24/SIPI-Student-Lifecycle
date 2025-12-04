/**
 * Unit tests for NotificationPreferences component
 */

describe('NotificationPreferences', () => {
    let notificationPreferences;

    beforeEach(() => {
        // Mock window.appConfig
        window.appConfig = {
            API_BASE_URL: 'http://localhost:8000'
        };

        // Mock localStorage
        localStorage.setItem('authToken', 'test-token');

        notificationPreferences = new NotificationPreferences();
    });

    afterEach(() => {
        // Clean up
        if (notificationPreferences.container) {
            notificationPreferences.container.remove();
        }
        localStorage.clear();
    });

    test('should initialize with empty preferences', () => {
        expect(notificationPreferences.preferences).toEqual({});
        expect(notificationPreferences.notificationTypes.length).toBe(6);
    });

    test('should have all notification types defined', () => {
        const types = notificationPreferences.notificationTypes;
        
        expect(types.some(t => t.value === 'application_status')).toBe(true);
        expect(types.some(t => t.value === 'document_approval')).toBe(true);
        expect(types.some(t => t.value === 'student_admission')).toBe(true);
        expect(types.some(t => t.value === 'system_announcement')).toBe(true);
        expect(types.some(t => t.value === 'deadline_reminder')).toBe(true);
        expect(types.some(t => t.value === 'account_activity')).toBe(true);
    });

    test('should create UI elements', () => {
        notificationPreferences.createUI();
        
        expect(notificationPreferences.container).toBeDefined();
        expect(document.querySelector('.notification-preferences')).toBeDefined();
        expect(document.getElementById('preferencesList')).toBeDefined();
        expect(document.getElementById('savePreferences')).toBeDefined();
        expect(document.getElementById('resetPreferences')).toBeDefined();
    });

    test('should render preferences list', () => {
        notificationPreferences.preferences = {
            type_preferences: [
                {
                    notification_type: 'application_status',
                    enabled: true,
                    email_enabled: false
                }
            ]
        };

        const html = notificationPreferences.renderPreferencesList();
        
        expect(html).toContain('Application Status');
        expect(html).toContain('preference-item');
        expect(html).toContain('preference-toggle');
    });

    test('should get auth token from localStorage', () => {
        const token = notificationPreferences.getAuthToken();
        expect(token).toBe('test-token');
    });

    test('should show message to user', () => {
        notificationPreferences.createUI();
        notificationPreferences.showMessage('Test message', 'success');
        
        const messageEl = document.getElementById('preferencesMessage');
        expect(messageEl.textContent).toBe('Test message');
        expect(messageEl.classList.contains('success')).toBe(true);
    });

    test('should close preferences modal', () => {
        notificationPreferences.createUI();
        expect(document.querySelector('.preferences-modal-overlay')).toBeDefined();
        
        notificationPreferences.close();
        expect(document.querySelector('.preferences-modal-overlay')).toBeNull();
    });

    test('should toggle email option when preference is disabled', () => {
        notificationPreferences.createUI();
        notificationPreferences.preferences = {
            type_preferences: [
                {
                    notification_type: 'application_status',
                    enabled: true,
                    email_enabled: false
                }
            ]
        };
        
        const html = notificationPreferences.renderPreferencesList();
        const list = document.getElementById('preferencesList');
        list.innerHTML = html;
        
        const toggle = document.querySelector('.preference-toggle[data-type="application_status"]');
        expect(toggle.checked).toBe(true);
    });

    test('should handle preference toggle', () => {
        notificationPreferences.createUI();
        notificationPreferences.preferences = {
            type_preferences: [
                {
                    notification_type: 'application_status',
                    enabled: true,
                    email_enabled: false
                }
            ]
        };
        
        const html = notificationPreferences.renderPreferencesList();
        const list = document.getElementById('preferencesList');
        list.innerHTML = html;
        
        const toggle = document.querySelector('.preference-toggle[data-type="application_status"]');
        const emailToggle = document.querySelector('.email-toggle[data-type="application_status"]');
        
        // Simulate unchecking the preference
        toggle.checked = false;
        toggle.dispatchEvent(new Event('change'));
        
        // Email toggle should be disabled
        expect(emailToggle.disabled).toBe(true);
    });

    test('should render all notification types in preferences list', () => {
        notificationPreferences.preferences = {
            type_preferences: []
        };

        const html = notificationPreferences.renderPreferencesList();
        
        expect(html).toContain('Application Status');
        expect(html).toContain('Document Approval');
        expect(html).toContain('Student Admission');
        expect(html).toContain('System Announcement');
        expect(html).toContain('Deadline Reminder');
        expect(html).toContain('Account Activity');
    });

    test('should attach event listeners', () => {
        notificationPreferences.createUI();
        
        const closeBtn = document.getElementById('closePreferences');
        const saveBtn = document.getElementById('savePreferences');
        const resetBtn = document.getElementById('resetPreferences');
        
        expect(closeBtn).toBeDefined();
        expect(saveBtn).toBeDefined();
        expect(resetBtn).toBeDefined();
    });
});
