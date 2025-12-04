/**
 * Notification Bell Component
 * Displays unread notification count and preview
 */

class NotificationBell {
    constructor() {
        this.unreadCount = 0;
        this.recentNotifications = [];
        this.bellElement = null;
        this.dropdownElement = null;
        this.apiBaseUrl = window.appConfig?.API_BASE_URL || 'http://localhost:8000';
        this.notificationCenter = null;
        this.updateInterval = null;
    }

    /**
     * Initialize the notification bell
     */
    async init() {
        this.createUI();
        await this.updateUnreadCount();
        this.attachEventListeners();
        this.startAutoUpdate();
    }

    /**
     * Create the notification bell UI
     */
    createUI() {
        const container = document.getElementById('notification-bell-container');
        if (!container) {
            console.warn('Notification bell container not found');
            return;
        }

        const html = `
            <div class="notification-bell-container">
                <button class="notification-bell" id="notificationBell" title="Notifications">
                    <svg class="bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span class="notification-badge" id="notificationBadge">0</span>
                </button>

                <div class="notification-dropdown" id="notificationDropdown">
                    <div class="dropdown-header">
                        <h3>Recent Notifications</h3>
                        <button class="view-all-btn" id="viewAllBtn">View All</button>
                    </div>
                    <div class="dropdown-content" id="dropdownContent">
                        <div class="loading">Loading...</div>
                    </div>
                    <div class="dropdown-footer">
                        <button class="mark-all-read-btn" id="markAllReadBtn">Mark All as Read</button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.bellElement = container;
        this.dropdownElement = document.getElementById('notificationDropdown');
    }

    /**
     * Update unread notification count
     */
    async updateUnreadCount() {
        try {
            const response = await fetch(
                `${this.apiBaseUrl}/api/notifications/unread_count/`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                this.unreadCount = data.unread_count || 0;
                this.updateBadge();
                await this.loadRecentNotifications();
            }
        } catch (error) {
            console.error('Error updating unread count:', error);
        }
    }

    /**
     * Load recent notifications for preview
     */
    async loadRecentNotifications() {
        try {
            const response = await fetch(
                `${this.apiBaseUrl}/api/notifications/?status=unread&limit=5`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                this.recentNotifications = data.results || data;
                this.renderDropdownContent();
            }
        } catch (error) {
            console.error('Error loading recent notifications:', error);
        }
    }

    /**
     * Update the notification badge
     */
    updateBadge() {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'flex' : 'none';
        }
    }

    /**
     * Render dropdown content
     */
    renderDropdownContent() {
        const content = document.getElementById('dropdownContent');
        
        if (!this.recentNotifications || this.recentNotifications.length === 0) {
            content.innerHTML = '<div class="empty-state">No new notifications</div>';
            return;
        }

        const html = this.recentNotifications.map(notif => `
            <div class="notification-preview" data-id="${notif.id}">
                <div class="preview-header">
                    <span class="preview-type">${this.formatType(notif.notification_type)}</span>
                    <span class="preview-time">${this.formatTime(notif.created_at)}</span>
                </div>
                <h4 class="preview-title">${this.escapeHtml(notif.title)}</h4>
                <p class="preview-message">${this.escapeHtml(notif.message.substring(0, 100))}${notif.message.length > 100 ? '...' : ''}</p>
            </div>
        `).join('');

        content.innerHTML = html;
        this.attachPreviewListeners();
    }

    /**
     * Attach listeners to notification previews
     */
    attachPreviewListeners() {
        document.querySelectorAll('.notification-preview').forEach(preview => {
            preview.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.markAsRead(id);
            });
        });
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const bell = document.getElementById('notificationBell');
        const viewAllBtn = document.getElementById('viewAllBtn');
        const markAllReadBtn = document.getElementById('markAllReadBtn');

        // Toggle dropdown
        bell?.addEventListener('click', () => {
            this.toggleDropdown();
        });

        // View all notifications
        viewAllBtn?.addEventListener('click', () => {
            this.openNotificationCenter();
        });

        // Mark all as read
        markAllReadBtn?.addEventListener('click', () => {
            this.markAllAsRead();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-bell-container')) {
                this.closeDropdown();
            }
        });
    }

    /**
     * Toggle dropdown visibility
     */
    toggleDropdown() {
        if (this.dropdownElement) {
            this.dropdownElement.classList.toggle('active');
        }
    }

    /**
     * Close dropdown
     */
    closeDropdown() {
        if (this.dropdownElement) {
            this.dropdownElement.classList.remove('active');
        }
    }

    /**
     * Open notification center
     */
    openNotificationCenter() {
        this.closeDropdown();
        
        if (!this.notificationCenter) {
            const NotificationCenterClass = window.NotificationCenter || 
                (typeof require !== 'undefined' ? require('./NotificationCenter') : null);
            
            if (NotificationCenterClass) {
                this.notificationCenter = new NotificationCenterClass();
                this.notificationCenter.init();
            }
        }
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(notificationId) {
        try {
            const response = await fetch(
                `${this.apiBaseUrl}/api/notifications/${notificationId}/mark_as_read/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                await this.updateUnreadCount();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead() {
        try {
            const response = await fetch(
                `${this.apiBaseUrl}/api/notifications/mark_all_as_read/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                await this.updateUnreadCount();
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    }

    /**
     * Format notification type for display
     */
    formatType(type) {
        const typeMap = {
            'application_status': 'Application',
            'document_approval': 'Document',
            'student_admission': 'Admission',
            'system_announcement': 'Announcement',
            'deadline_reminder': 'Deadline',
            'account_activity': 'Account'
        };
        return typeMap[type] || type;
    }

    /**
     * Format time for display
     */
    formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        
        return date.toLocaleDateString();
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get auth token from localStorage
     */
    getAuthToken() {
        return localStorage.getItem('authToken') || '';
    }

    /**
     * Start auto-update interval
     */
    startAutoUpdate() {
        this.updateInterval = setInterval(() => {
            this.updateUnreadCount();
        }, 30000); // Update every 30 seconds
    }

    /**
     * Stop auto-update interval
     */
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    /**
     * Destroy the notification bell
     */
    destroy() {
        this.stopAutoUpdate();
        const container = document.getElementById('notification-bell-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationBell;
}
