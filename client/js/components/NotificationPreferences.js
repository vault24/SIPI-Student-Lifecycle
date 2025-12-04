/**
 * Notification Preferences Component
 * Allows users to manage their notification settings
 */

class NotificationPreferences {
    constructor() {
        this.preferences = {};
        this.container = null;
        this.apiBaseUrl = window.appConfig?.API_BASE_URL || 'http://localhost:8000';
        this.notificationTypes = [
            { value: 'application_status', label: 'Application Status' },
            { value: 'document_approval', label: 'Document Approval' },
            { value: 'student_admission', label: 'Student Admission' },
            { value: 'system_announcement', label: 'System Announcement' },
            { value: 'deadline_reminder', label: 'Deadline Reminder' },
            { value: 'account_activity', label: 'Account Activity' }
        ];
    }

    /**
     * Initialize the preferences component
     */
    async init() {
        await this.loadPreferences();
        this.createUI();
        this.attachEventListeners();
    }

    /**
     * Load user preferences from API
     */
    async loadPreferences() {
        try {
            const response = await fetch(
                `${this.apiBaseUrl}/api/notification-preferences/my_preferences/`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                this.preferences = data;
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }

    /**
     * Create the preferences UI
     */
    createUI() {
        const html = `
            <div class="notification-preferences">
                <div class="preferences-header">
                    <h2>Notification Preferences</h2>
                    <button class="close-btn" id="closePreferences">&times;</button>
                </div>

                <div class="preferences-content">
                    <div class="preferences-section">
                        <h3>Notification Types</h3>
                        <p class="section-description">Choose which notifications you want to receive</p>
                        
                        <div class="preferences-list" id="preferencesList">
                            ${this.renderPreferencesList()}
                        </div>
                    </div>

                    <div class="preferences-actions">
                        <button class="btn btn-primary" id="savePreferences">Save Preferences</button>
                        <button class="btn btn-secondary" id="resetPreferences">Reset to Default</button>
                    </div>

                    <div class="preferences-message" id="preferencesMessage"></div>
                </div>
            </div>
        `;

        this.container = document.createElement('div');
        this.container.className = 'preferences-modal-overlay';
        this.container.innerHTML = html;
        document.body.appendChild(this.container);
    }

    /**
     * Render preferences list
     */
    renderPreferencesList() {
        const typePreferences = this.preferences.type_preferences || [];
        
        return this.notificationTypes.map(type => {
            const pref = typePreferences.find(p => p.notification_type === type.value);
            const enabled = pref ? pref.enabled : true;
            const emailEnabled = pref ? pref.email_enabled : false;

            return `
                <div class="preference-item" data-type="${type.value}">
                    <div class="preference-header">
                        <label class="preference-label">
                            <input 
                                type="checkbox" 
                                class="preference-toggle" 
                                data-type="${type.value}"
                                ${enabled ? 'checked' : ''}
                            >
                            <span class="preference-name">${type.label}</span>
                        </label>
                    </div>
                    
                    <div class="preference-options">
                        <label class="email-option">
                            <input 
                                type="checkbox" 
                                class="email-toggle" 
                                data-type="${type.value}"
                                ${emailEnabled ? 'checked' : ''}
                                ${!enabled ? 'disabled' : ''}
                            >
                            <span>Also send via email</span>
                        </label>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Close button
        document.getElementById('closePreferences')?.addEventListener('click', () => {
            this.close();
        });

        // Save preferences
        document.getElementById('savePreferences')?.addEventListener('click', () => {
            this.savePreferences();
        });

        // Reset preferences
        document.getElementById('resetPreferences')?.addEventListener('click', () => {
            this.resetPreferences();
        });

        // Toggle preference
        document.querySelectorAll('.preference-toggle').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const type = e.target.dataset.type;
                const emailToggle = document.querySelector(`.email-toggle[data-type="${type}"]`);
                
                if (!e.target.checked && emailToggle) {
                    emailToggle.checked = false;
                    emailToggle.disabled = true;
                } else if (emailToggle) {
                    emailToggle.disabled = false;
                }
            });
        });

        // Close on overlay click
        this.container?.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
    }

    /**
     * Save preferences to API
     */
    async savePreferences() {
        try {
            const updates = [];
            
            document.querySelectorAll('.preference-toggle').forEach(toggle => {
                const type = toggle.dataset.type;
                const enabled = toggle.checked;
                const emailToggle = document.querySelector(`.email-toggle[data-type="${type}"]`);
                const emailEnabled = emailToggle ? emailToggle.checked : false;

                updates.push({
                    notification_type: type,
                    enabled: enabled,
                    email_enabled: emailEnabled
                });
            });

            // Save each preference
            for (const update of updates) {
                const response = await fetch(
                    `${this.apiBaseUrl}/api/notification-preferences/update/`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${this.getAuthToken()}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(update)
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to save preferences');
                }
            }

            this.showMessage('Preferences saved successfully!', 'success');
            await this.loadPreferences();
        } catch (error) {
            console.error('Error saving preferences:', error);
            this.showMessage('Failed to save preferences', 'error');
        }
    }

    /**
     * Reset preferences to default
     */
    async resetPreferences() {
        if (!confirm('Are you sure you want to reset to default preferences?')) {
            return;
        }

        try {
            // Reset all to enabled, email disabled
            const updates = this.notificationTypes.map(type => ({
                notification_type: type.value,
                enabled: true,
                email_enabled: false
            }));

            for (const update of updates) {
                const response = await fetch(
                    `${this.apiBaseUrl}/api/notification-preferences/update/`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${this.getAuthToken()}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(update)
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to reset preferences');
                }
            }

            this.showMessage('Preferences reset to default!', 'success');
            await this.loadPreferences();
            
            // Refresh UI
            const list = document.getElementById('preferencesList');
            if (list) {
                list.innerHTML = this.renderPreferencesList();
                this.attachEventListeners();
            }
        } catch (error) {
            console.error('Error resetting preferences:', error);
            this.showMessage('Failed to reset preferences', 'error');
        }
    }

    /**
     * Show message to user
     */
    showMessage(message, type) {
        const messageEl = document.getElementById('preferencesMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `preferences-message ${type}`;
            
            setTimeout(() => {
                messageEl.textContent = '';
                messageEl.className = 'preferences-message';
            }, 3000);
        }
    }

    /**
     * Get auth token from localStorage
     */
    getAuthToken() {
        return localStorage.getItem('authToken') || '';
    }

    /**
     * Close the preferences modal
     */
    close() {
        if (this.container) {
            this.container.remove();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationPreferences;
}
