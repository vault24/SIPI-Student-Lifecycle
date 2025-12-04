/**
 * Error Handler Module
 * 
 * Centralized error processing and user feedback
 * Handles API errors, displays toast notifications, and manages special cases
 */

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(message, status, details) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.details = details;
    }
}

/**
 * Handle API errors with user feedback
 * @param {Error} error - Error object from API call
 * @param {Object} options - Options for error handling
 */
function handleAPIError(error, options = {}) {
    const {
        showToast = true,
        logToConsole = true,
        redirectOn401 = true,
    } = options;

    // Log to console for debugging
    if (logToConsole) {
        console.error('API Error:', error);
    }

    // Get user-friendly error message
    const message = getErrorMessage(error);

    // Show toast notification
    if (showToast) {
        showErrorToast(message);
    }

    // Handle special cases
    if (error.status === 401 && redirectOn401) {
        // Unauthorized - redirect to login
        setTimeout(() => {
            localStorage.removeItem('auth_token');
            window.location.href = '#/login';
        }, 2000);
    } else if (error.status === 403) {
        // Forbidden - show access denied message
        showErrorToast("You don't have permission to perform this action");
    }

    return message;
}

/**
 * Convert error to user-friendly message
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
function getErrorMessage(error) {
    // Network errors
    if (error.message.includes('Network error')) {
        return 'Unable to connect to the server. Please check your internet connection and try again.';
    }

    // Timeout errors
    if (error.message.includes('timeout')) {
        return 'The request is taking longer than expected. Please try again.';
    }

    // HTTP status-based messages
    if (error.status) {
        switch (error.status) {
            case 400:
                // Validation error - return specific message
                if (error.details) {
                    return formatValidationErrors(error.details);
                }
                return error.message || 'Invalid request. Please check your input.';
            
            case 401:
                return 'Your session has expired. Please log in again.';
            
            case 403:
                return "You don't have permission to perform this action.";
            
            case 404:
                return 'The requested resource was not found.';
            
            case 409:
                return error.message || 'This action conflicts with existing data.';
            
            case 500:
            case 502:
            case 503:
                return 'Something went wrong on our end. Please try again later.';
            
            default:
                return error.message || 'An unexpected error occurred.';
        }
    }

    // Default message
    return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Format validation errors from API
 * @param {Object} details - Error details object
 * @returns {string} - Formatted error message
 */
function formatValidationErrors(details) {
    if (typeof details === 'string') {
        return details;
    }

    if (typeof details === 'object') {
        const errors = [];
        for (const [field, messages] of Object.entries(details)) {
            if (Array.isArray(messages)) {
                errors.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
                errors.push(`${field}: ${messages}`);
            }
        }
        return errors.length > 0 ? errors.join('\n') : 'Validation error occurred';
    }

    return 'Validation error occurred';
}

/**
 * Show error toast notification
 * @param {string} message - Error message to display
 * @param {number} duration - Duration in milliseconds (default: 5000)
 */
function showErrorToast(message, duration = 5000) {
    showToast(message, 'error', duration);
}

/**
 * Show success toast notification
 * @param {string} message - Success message to display
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showSuccessToast(message, duration = 3000) {
    showToast(message, 'success', duration);
}

/**
 * Show warning toast notification
 * @param {string} message - Warning message to display
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
function showWarningToast(message, duration = 4000) {
    showToast(message, 'warning', duration);
}

/**
 * Show info toast notification
 * @param {string} message - Info message to display
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showInfoToast(message, duration = 3000) {
    showToast(message, 'info', duration);
}

/**
 * Generic toast notification function
 * @param {string} message - Message to display
 * @param {string} type - Toast type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-in`;
    
    // Set colors based on type
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    };

    // Set icons based on type
    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle',
        info: 'info',
    };

    toast.innerHTML = `
        <div class="${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[500px]">
            <i data-lucide="${icons[type]}" class="w-5 h-5 flex-shrink-0"></i>
            <span class="flex-1">${message}</span>
            <button onclick="this.closest('.toast').remove()" class="flex-shrink-0 hover:opacity-75">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;

    // Add to container
    container.appendChild(toast);

    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Auto-dismiss after duration
    setTimeout(() => {
        toast.classList.add('animate-slide-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Display field-specific validation errors on a form
 * @param {Object} errors - Object with field names as keys and error messages as values
 * @param {string} formId - ID of the form element
 */
function displayFieldErrors(errors, formId) {
    // Clear existing errors
    clearFieldErrors(formId);

    if (!errors || typeof errors !== 'object') {
        return;
    }

    const form = document.getElementById(formId);
    if (!form) {
        console.warn(`Form with ID "${formId}" not found`);
        return;
    }

    let firstErrorField = null;

    for (const [fieldName, messages] of Object.entries(errors)) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) {
            continue;
        }

        // Add error class to field
        field.classList.add('border-red-500', 'focus:ring-red-500');

        // Create error message element
        const errorMessages = Array.isArray(messages) ? messages : [messages];
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-red-500 text-sm mt-1';
        errorDiv.textContent = errorMessages.join(', ');

        // Insert error message after field
        field.parentNode.insertBefore(errorDiv, field.nextSibling);

        // Track first error field for scrolling
        if (!firstErrorField) {
            firstErrorField = field;
        }
    }

    // Scroll to first error field
    if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
    }
}

/**
 * Clear field-specific validation errors from a form
 * @param {string} formId - ID of the form element
 */
function clearFieldErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        return;
    }

    // Remove error classes from fields
    const errorFields = form.querySelectorAll('.border-red-500');
    errorFields.forEach(field => {
        field.classList.remove('border-red-500', 'focus:ring-red-500');
    });

    // Remove error message elements
    const errorMessages = form.querySelectorAll('.field-error');
    errorMessages.forEach(msg => msg.remove());
}

// Export error handler functions
window.APIError = APIError;
window.handleAPIError = handleAPIError;
window.getErrorMessage = getErrorMessage;
window.showErrorToast = showErrorToast;
window.showSuccessToast = showSuccessToast;
window.showWarningToast = showWarningToast;
window.showInfoToast = showInfoToast;
window.showToast = showToast;
window.displayFieldErrors = displayFieldErrors;
window.clearFieldErrors = clearFieldErrors;
