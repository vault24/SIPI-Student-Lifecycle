/**
 * Authentication Middleware
 * Protects routes and redirects unauthenticated users to login
 */

(function() {
    'use strict';

    // Public routes that don't require authentication
    const PUBLIC_ROUTES = ['/login', '/apply'];

    /**
     * Check if user is authenticated
     */
    function isAuthenticated() {
        return authService && authService.isAuthenticated();
    }

    /**
     * Check if route is public
     */
    function isPublicRoute(route) {
        return PUBLIC_ROUTES.includes(route);
    }

    /**
     * Protect route - redirect to login if not authenticated
     */
    function protectRoute(route) {
        if (!isPublicRoute(route) && !isAuthenticated()) {
            navigateTo('/login');
            return false;
        }
        return true;
    }

    /**
     * Get current user
     */
    function getCurrentUser() {
        return authService ? authService.getUser() : null;
    }

    /**
     * Check if user has specific role
     */
    function hasRole(role) {
        const user = getCurrentUser();
        return user && user.role === role;
    }

    /**
     * Check if user is admin
     */
    function isAdmin() {
        return hasRole('admin');
    }

    /**
     * Logout user
     */
    function logout() {
        if (authService) {
            authService.logout();
        }
        navigateTo('/login');
    }

    // Export to global scope
    window.authMiddleware = {
        isAuthenticated,
        isPublicRoute,
        protectRoute,
        getCurrentUser,
        hasRole,
        isAdmin,
        logout
    };

})();
