/**
 * Notification Center Component
 * Displays and manages user notifications
 */

class NotificationCenter {
    constructor() {
        this.notifications = [];
        this.currentFilter = 'all';
        this.currentType = null;
        this.searchQuery = '';
        this.container = null;
        this.apiBaseUrl = window.appConfig?.API_BASE_URL || 'http://localhost:8000';
    }

    /**
     * Initialize the notification center
     */
    async init() {
        this.createUI();
        await this.loadNotifications();
        this.attachEventListeners();
    }

    /**
     * Create the notification center UI
     */
    createUI() {
        const html = `
            <div class="notification-center">
                <div class="notification-center-header">
                    <h2>Notifications</h2>
                    <button class="close-btn" id="closeNotificationCenter">&times;</button>
                </div>

                <div class="notification-center-controls">
                    <div class="search-box">
                        <input 
                            type="text" 
                            id="notificationSearch" 
                            placeholder="Search notifications..."
                            class="search-input"
                        >
                    </div>

                    <div class="filter-controls">
                        <select id="statusFilter" class="filter-select">
                            <option value="all">All Status</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="archived">Archived</option>
                        </select>

                        <select id="typeFilter" class="filter-select">
                            <option value="">All Types</option>
                            <option value="application_status">Application Status</option>
                            <option value="document_approval">Document Approval</option>
                            <option value="student_admission">Student Admission</option>
                            <option value="system_announcement">System Announcement</option>
                            <option value="deadline_reminder">Deadline Reminder</option>
                            <option value="account_activity">Account Activity</option>
                        </select>

                        <button id="markAllAsRead" class="action-btn">Mark All as Read</button>
                    </div>
                </div>

                <div class="notification-list" id="notificationList">
                    <div class="loading">Loading notifications...</div>
                </div>
            </div>
        `;

        this.container = document.createElement('div');
        this.container.innerHTML = html;
        document.body.appendChild(this.container);
    }

    /**
     * Load notifications from API
     */
    async loadNotifications() {
        try {
            const params = new URLSearchParams();
            
            if (this.currentFilter !== 'all') {
                params.append('status', this.currentFilter);
            }
            
            if (this.currentType) {
                params.append('type', this.currentType);
            }
            
            if (this.searchQuery) {
                params.append('search', this.searchQuery);
            }

            const response = await fetch(
                `${this.apiBaseUrl}/api/notifications/?${params.toString()}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to load notifications');
            }

            const data = await response.json();
            this.notifications = data.results || data;
            this.renderNotifications();
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.showError('Failed to load notifications');
        }
    }

    /**
     * Render notifications in the list
     */
    renderNotifications() {
        const listContainer = document.getElementById('notificationList');
        
        if (!this.notifications || this.notifications.length === 0) {
            listContainer.innerHTML = '<div class="empty-state">No notifications</div>';
            return;
        }

        const html = this.notifications.map(notif => `
            <div class="notification-item ${notif.status}" data-id="${notif.id}">
                <div class="notification-content">
                    <div class="notification-header">
                        <h3 class="notification-title">${this.escapeHtml(notif.title)}</h3>
                        <span class="notification-type">${this.formatType(notif.notification_type)}</span>
                    </div>
                    <p class="notification-message">${this.escapeHtml(notif.message)}</p>
                    <div class="notification-meta">
                        <span class="notification-time">${this.formatTime(notif.created_at)}</span>
                        <span class="notification-status">${notif.status}</span>
                    </div>
                </div>
                <div class="notification-actions">
                    ${notif.status === 'unread' ? `
                        <button class="action-btn mark-read" data-id="${notif.id}">Mark as Read</button>
                    ` : ''}
                    <button class="action-btn archive" data-id="${notif.id}">Archive</button>
                    <button class="action-btn delete" data-id="${notif.id}">Delete</button>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = html;
        this.attachNotificationActions();
    }

    /**
     * Attach event listeners to notification actions
     */
    attachNotificationActions() {
        // Mark as read
        document.querySelectorAll('.notification-actions .mark-read').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.markAsRead(id);
            });
        });

        // Archive
        document.querySelectorAll('.notification-actions .archive').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.archiveNotification(id);
            });
        });

        // Delete
        document.querySelectorAll('.notification-actions .delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.deleteNotification(id);
            });
        });
    }

    /**
     * Attach event listeners to controls
     */
    attachEventListeners() {
        // Close button
        document.getElementById('closeNotificationCenter')?.addEventListener('click', () => {
            this.close();
        });

        // Search
        document.getElementById('notificationSearch')?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.loadNotifications();
        });

        // Status filter
        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.loadNotifications();
        });

        // Type filter
        document.getElementById('typeFilter')?.addEventListener('change', (e) => {
            this.currentType = e.target.value || null;
            this.loadNotifications();
        });

        // Mark all as read
        document.getElementById('markAllAsRead')?.addEventListener('click', () => {
            this.markAllAsRead();
        });
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
                await this.loadNotifications();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    /**
     * Archive a notification
     */
    async archiveNotification(notificationId) {
        try {
            const response = await fetch(
                `${this.apiBaseUrl}/api/notifications/${notificationId}/archive/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                await this.loadNotifications();
            }
        } catch (error) {
            console.error('Error archiving notification:', error);
        }
    }

    /**
     * Delete a notification
     */
    async deleteNotification(notificationId) {
        try {
            const response = await fetch(
                `${this.apiBaseUrl}/api/notifications/${notificationId}/soft_delete/`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                await this.loadNotifications();
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
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
                await this.loadNotifications();
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
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
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
     * Show error message
     */
    showError(message) {
        const listContainer = document.getElementById('notificationList');
        if (listContainer) {
            listContainer.innerHTML = `<div class="error-state">${this.escapeHtml(message)}</div>`;
        }
    }

    /**
     * Get auth token from localStorage
     */
    getAuthToken() {
        return localStorage.getItem('authToken') || '';
    }

    /**
     * Close the notification center
     */
    close() {
        if (this.container) {
            this.container.remove();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationCenter;
}
