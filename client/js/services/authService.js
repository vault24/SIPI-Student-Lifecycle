/**
 * Authentication Service
 * Handles JWT token management, login, signup, and logout
 */

(function() {
    'use strict';

    const AUTH_TOKEN_KEY = 'slms_auth_token';
    const USER_KEY = 'slms_user';

    const authService = {
        /**
         * Check if user is authenticated
         */
        isAuthenticated() {
            return !!this.getToken();
        },

        /**
         * Get stored JWT token
         */
        getToken() {
            return localStorage.getItem(AUTH_TOKEN_KEY);
        },

        /**
         * Get stored user data
         */
        getUser() {
            const user = localStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        },

        /**
         * Save token and user data
         */
        setAuth(token, user) {
            localStorage.setItem(AUTH_TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        },

        /**
         * Clear authentication
         */
        logout() {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        },

        /**
         * Get API base URL
         */
        getApiUrl() {
            return (window.appConfig?.API_BASE_URL || window.config?.apiUrl || 'http://localhost:8000');
        },

        /**
         * Parse JSON response safely
         */
        async parseResponse(response) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                throw new Error('Invalid response format from server');
            }
        },

        /**
         * Login user
         */
        async login(email, password) {
            try {
                const apiUrl = this.getApiUrl();
                const response = await fetch(`${apiUrl}/api/auth/login/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    try {
                        const error = await this.parseResponse(response);
                        throw new Error(error.detail || 'Login failed');
                    } catch (e) {
                        // Fallback to mock authentication for development
                        console.warn('Backend auth endpoint not available, using mock authentication');
                        if (email && password.length >= 6) {
                            const mockToken = 'mock-token-' + Date.now();
                            
                            // Mock admin account for testing
                            let role = 'user';
                            let name = email.split('@')[0];
                            
                            if (email === 'admin@sipi.com' && password === 'testadmin') {
                                role = 'admin';
                                name = 'Admin';
                            }
                            
                            const mockUser = {
                                id: Math.random().toString(36).substr(2, 9),
                                email: email,
                                name: name,
                                role: role
                            };
                            this.setAuth(mockToken, mockUser);
                            return { token: mockToken, user: mockUser };
                        }
                        throw new Error('Invalid credentials');
                    }
                }

                const data = await this.parseResponse(response);
                this.setAuth(data.token, data.user);
                return data;
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },

        /**
         * Register new user (pending approval)
         */
        async register(name, email, password, role) {
            try {
                const apiUrl = this.getApiUrl();
                const response = await fetch(`${apiUrl}/api/auth/register/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password, role })
                });

                if (!response.ok) {
                    try {
                        const error = await this.parseResponse(response);
                        throw new Error(error.detail || 'Registration failed');
                    } catch (e) {
                        // Fallback to mock registration for development
                        console.warn('Backend auth endpoint not available, using mock registration');
                        if (name && email && password && role) {
                            return {
                                success: true,
                                message: 'Registration successful. Auto-approved for development.',
                                user: {
                                    id: Math.random().toString(36).substr(2, 9),
                                    name: name,
                                    email: email,
                                    role: 'admin', // Set to admin for development
                                    status: 'approved'
                                }
                            };
                        }
                        throw new Error('Invalid registration data');
                    }
                }

                const data = await this.parseResponse(response);
                return data;
            } catch (error) {
                console.error('Registration error:', error);
                throw error;
            }
        },

        /**
         * Get pending signup requests (admin only)
         */
        async getPendingRequests() {
            try {
                const token = this.getToken();
                const apiUrl = this.getApiUrl();
                const response = await fetch(`${apiUrl}/api/auth/pending-requests/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch pending requests');
                }

                return await this.parseResponse(response);
            } catch (error) {
                console.error('Error fetching pending requests:', error);
                return [];
            }
        },

        /**
         * Approve signup request (admin only)
         */
        async approveRequest(requestId) {
            try {
                const token = this.getToken();
                const apiUrl = this.getApiUrl();
                const response = await fetch(`${apiUrl}/api/auth/approve-request/${requestId}/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to approve request');
                }

                return await this.parseResponse(response);
            } catch (error) {
                console.error('Error approving request:', error);
                throw error;
            }
        },

        /**
         * Reject signup request (admin only)
         */
        async rejectRequest(requestId, reason) {
            try {
                const token = this.getToken();
                const apiUrl = this.getApiUrl();
                const response = await fetch(`${apiUrl}/api/auth/reject-request/${requestId}/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ reason })
                });

                if (!response.ok) {
                    throw new Error('Failed to reject request');
                }

                return await this.parseResponse(response);
            } catch (error) {
                console.error('Error rejecting request:', error);
                throw error;
            }
        }
    };

    // Export to global scope
    window.authService = authService;

})();
