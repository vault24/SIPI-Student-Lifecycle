/**
 * Application Configuration
 * 
 * This file contains environment-specific configuration for the frontend.
 * The API URL is determined based on the current environment.
 */

(function() {
    'use strict';

    // Determine the API base URL based on the current environment
    function getApiBaseUrl() {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        // If running on localhost, use localhost:8000
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }
        
        // If running on Cloudflare tunnel, use the same domain
        // Cloudflare will route /api/* to the backend
        // Make sure your Cloudflare tunnel is configured to route to localhost:8000
        return `${protocol}//${hostname}`;
    }

    // Export configuration
    window.appConfig = {
        // API Configuration
        API_BASE_URL: getApiBaseUrl(),
        API_TIMEOUT: 30000, // 30 seconds
        
        // Feature flags
        FEATURES: {
            ENABLE_DARK_MODE: true,
            ENABLE_NOTIFICATIONS: true,
        },
        
        // Logging
        DEBUG: window.location.hostname === 'localhost',
    };

    console.log('🔧 App Config Loaded:', {
        apiUrl: window.appConfig.API_BASE_URL,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        debug: window.appConfig.DEBUG,
    });

})();
