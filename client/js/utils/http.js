/**
 * HTTP Client Module
 * 
 * Low-level HTTP request handling for API communication
 * Handles authentication, timeouts, and response parsing
 */

// Configuration - Use dynamic API URL from config.js
// Falls back to localhost if config not loaded
const API_BASE_URL = (window.appConfig?.API_BASE_URL || 'http://localhost:8000') + '/api';
const DEFAULT_TIMEOUT = window.appConfig?.API_TIMEOUT || 30000; // 30 seconds

/**
 * Core HTTP request function
 * @param {string} url - API endpoint (relative to base URL)
 * @param {Object} options - Request options
 * @returns {Promise<any>} - Parsed response data
 */
async function request(url, options = {}) {
    const {
        method = 'GET',
        body = null,
        headers = {},
        timeout = DEFAULT_TIMEOUT,
        params = null,
    } = options;

    // Build full URL with query parameters
    let fullUrl = `${API_BASE_URL}${url}`;
    if (params) {
        const queryString = new URLSearchParams(params).toString();
        fullUrl += `?${queryString}`;
    }

    // Get authentication token from localStorage
    const authToken = localStorage.getItem('auth_token');

    // Build headers
    const requestHeaders = {
        ...headers,
    };

    // Add auth token if available
    if (authToken) {
        requestHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    // Add Content-Type for JSON requests
    if (body && !(body instanceof FormData)) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(fullUrl, {
            method,
            headers: requestHeaders,
            body: body instanceof FormData ? body : (body ? JSON.stringify(body) : null),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle different response statuses
        if (!response.ok) {
            await handleErrorResponse(response);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return null;
        }

        // Parse JSON response
        return await response.json();

    } catch (error) {
        clearTimeout(timeoutId);

        // Handle timeout
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - please try again');
        }

        // Handle network errors
        if (error.message === 'Failed to fetch') {
            throw new Error('Network error - please check your connection');
        }

        throw error;
    }
}

/**
 * Handle error responses from API
 * @param {Response} response - Fetch response object
 */
async function handleErrorResponse(response) {
    let errorMessage = 'An error occurred';
    let errorDetails = null;

    try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.detail || errorMessage;
        errorDetails = errorData.details || errorData;
    } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.details = errorDetails;
    throw error;
}

/**
 * GET request
 * @param {string} url - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<any>}
 */
async function get(url, options = {}) {
    return await request(url, {
        ...options,
        method: 'GET',
    });
}

/**
 * POST request
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Request options
 * @returns {Promise<any>}
 */
async function post(url, data, options = {}) {
    return await request(url, {
        ...options,
        method: 'POST',
        body: data,
    });
}

/**
 * PUT request
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Request options
 * @returns {Promise<any>}
 */
async function put(url, data, options = {}) {
    return await request(url, {
        ...options,
        method: 'PUT',
        body: data,
    });
}

/**
 * PATCH request
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Request options
 * @returns {Promise<any>}
 */
async function patch(url, data, options = {}) {
    return await request(url, {
        ...options,
        method: 'PATCH',
        body: data,
    });
}

/**
 * DELETE request
 * @param {string} url - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<any>}
 */
async function del(url, options = {}) {
    return await request(url, {
        ...options,
        method: 'DELETE',
    });
}

/**
 * Upload file with FormData
 * @param {string} url - API endpoint
 * @param {FormData} formData - Form data with file
 * @param {Object} options - Request options
 * @returns {Promise<any>}
 */
async function upload(url, formData, options = {}) {
    return await request(url, {
        ...options,
        method: 'POST',
        body: formData,
    });
}

// Export HTTP client
const http = {
    request,
    get,
    post,
    put,
    patch,
    del,
    delete: del, // Alias for delete
    upload,
};

// Make available globally
window.http = http;
