// Utility functions for SLMS

// Generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Date formatting
function formatDate(dateString, format = 'long') {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    if (format === 'short') {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } else if (format === 'long') {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } else if (format === 'time') {
        return date.toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (format === 'relative') {
        return getRelativeTime(date);
    }
    
    return date.toLocaleDateString();
}

// Get relative time (e.g., "2 hours ago")
function getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    
    return formatDate(date, 'short');
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Form validation
const validators = {
    required(value) {
        return value && value.trim() !== '';
    },
    
    email(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    
    phone(value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
    },
    
    minLength(value, length) {
        return value && value.length >= length;
    },
    
    maxLength(value, length) {
        return value && value.length <= length;
    },
    
    number(value) {
        return !isNaN(value) && value !== '';
    },
    
    date(value) {
        const date = new Date(value);
        return date instanceof Date && !isNaN(date);
    }
};

// Validate form field
function validateField(value, rules) {
    const errors = [];
    
    for (const rule in rules) {
        if (rule === 'required' && rules[rule]) {
            if (!validators.required(value)) {
                errors.push('This field is required');
            }
        } else if (rule === 'email' && rules[rule]) {
            if (value && !validators.email(value)) {
                errors.push('Please enter a valid email address');
            }
        } else if (rule === 'phone' && rules[rule]) {
            if (value && !validators.phone(value)) {
                errors.push('Please enter a valid phone number');
            }
        } else if (rule === 'minLength') {
            if (value && !validators.minLength(value, rules[rule])) {
                errors.push(`Minimum length is ${rules[rule]} characters`);
            }
        } else if (rule === 'maxLength') {
            if (value && !validators.maxLength(value, rules[rule])) {
                errors.push(`Maximum length is ${rules[rule]} characters`);
            }
        } else if (rule === 'number' && rules[rule]) {
            if (value && !validators.number(value)) {
                errors.push('Please enter a valid number');
            }
        } else if (rule === 'date' && rules[rule]) {
            if (value && !validators.date(value)) {
                errors.push('Please enter a valid date');
            }
        }
    }
    
    return errors;
}

// Validate entire form
function validateForm(formData, validationRules) {
    const errors = {};
    let isValid = true;
    
    for (const field in validationRules) {
        const fieldErrors = validateField(formData[field], validationRules[field]);
        if (fieldErrors.length > 0) {
            errors[field] = fieldErrors;
            isValid = false;
        }
    }
    
    return { isValid, errors };
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Escape HTML entities
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Truncate text
function truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}

// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Convert to title case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Deep clone object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Check if object is empty
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// Sort array of objects
function sortBy(array, key, order = 'asc') {
    return array.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (order === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });
}

// Filter array by search term
function filterBySearch(array, searchTerm, fields) {
    if (!searchTerm) return array;
    
    const term = searchTerm.toLowerCase();
    return array.filter(item => {
        return fields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(term);
        });
    });
}

// Group array by key
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
}

// Get unique values from array
function unique(array) {
    return [...new Set(array)];
}

// Paginate array
function paginate(array, page, pageSize) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
        data: array.slice(start, end),
        total: array.length,
        page,
        pageSize,
        totalPages: Math.ceil(array.length / pageSize)
    };
}

// Download data as JSON
function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

// Get query parameters from URL
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    });
    
    return params;
}

// Set query parameters in URL
function setQueryParams(params) {
    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    
    const newUrl = `${window.location.pathname}?${queryString}${window.location.hash}`;
    window.history.pushState({}, '', newUrl);
}

// Export utility functions
window.utils = {
    generateUUID,
    formatDate,
    getRelativeTime,
    formatFileSize,
    debounce,
    throttle,
    validateField,
    validateForm,
    sanitizeHTML,
    escapeHTML,
    truncateText,
    capitalize,
    toTitleCase,
    deepClone,
    isEmpty,
    sortBy,
    filterBySearch,
    groupBy,
    unique,
    paginate,
    downloadJSON,
    copyToClipboard,
    getQueryParams,
    setQueryParams
};

// Make individual functions globally available
window.generateUUID = generateUUID;
window.formatDate = formatDate;
window.formatFileSize = formatFileSize;
window.debounce = debounce;
window.validateForm = validateForm;
