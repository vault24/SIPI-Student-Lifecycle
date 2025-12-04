/**
 * Loading State Module
 * 
 * Manages loading indicators, skeletons, and progress bars
 * Provides consistent loading UI patterns across the application
 */

/**
 * Show loading skeleton
 * @param {string} containerId - ID of container element
 * @param {string} type - Skeleton type (table, card, form, stats, list)
 * @param {number} count - Number of skeleton items (default: 1)
 */
function showLoadingSkeleton(containerId, type = 'table', count = 1) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container with ID "${containerId}" not found`);
        return;
    }

    let skeletonHTML = '';

    switch (type) {
        case 'table':
            skeletonHTML = createTableSkeleton(count);
            break;
        case 'card':
            skeletonHTML = createCardSkeleton(count);
            break;
        case 'form':
            skeletonHTML = createFormSkeleton();
            break;
        case 'stats':
            skeletonHTML = createStatsSkeleton(count);
            break;
        case 'list':
            skeletonHTML = createListSkeleton(count);
            break;
        default:
            skeletonHTML = createGenericSkeleton();
    }

    container.innerHTML = `<div class="loading-skeleton" data-skeleton-type="${type}">${skeletonHTML}</div>`;
}

/**
 * Hide loading skeleton
 * @param {string} containerId - ID of container element
 */
function hideLoadingSkeleton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    const skeleton = container.querySelector('.loading-skeleton');
    if (skeleton) {
        skeleton.remove();
    }
}

/**
 * Create table skeleton
 * @param {number} rows - Number of rows
 * @returns {string} - HTML string
 */
function createTableSkeleton(rows = 5) {
    return `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="animate-pulse">
                <!-- Header -->
                <div class="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                
                <!-- Table -->
                <div class="space-y-3">
                    ${Array(rows).fill(0).map(() => `
                        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div class="flex-1 space-y-2">
                                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div class="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Create card skeleton
 * @param {number} count - Number of cards
 * @returns {string} - HTML string
 */
function createCardSkeleton(count = 1) {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${Array(count).fill(0).map(() => `
                <div class="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="h-3 bg-gray-200 rounded"></div>
                        <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div class="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Create form skeleton
 * @returns {string} - HTML string
 */
function createFormSkeleton() {
    return `
        <div class="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div class="space-y-6">
                ${Array(5).fill(0).map(() => `
                    <div>
                        <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div class="h-10 bg-gray-200 rounded"></div>
                    </div>
                `).join('')}
                <div class="flex gap-4">
                    <div class="h-10 bg-gray-200 rounded w-32"></div>
                    <div class="h-10 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create stats skeleton
 * @param {number} count - Number of stat cards
 * @returns {string} - HTML string
 */
function createStatsSkeleton(count = 4) {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${Array(count).fill(0).map(() => `
                <div class="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                    <div class="flex items-center justify-between mb-4">
                        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Create list skeleton
 * @param {number} items - Number of list items
 * @returns {string} - HTML string
 */
function createListSkeleton(items = 5) {
    return `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="animate-pulse space-y-4">
                ${Array(items).fill(0).map(() => `
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Create generic skeleton
 * @returns {string} - HTML string
 */
function createGenericSkeleton() {
    return `
        <div class="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div class="space-y-4">
                <div class="h-6 bg-gray-200 rounded w-1/3"></div>
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                <div class="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
        </div>
    `;
}

/**
 * Set button loading state
 * @param {HTMLElement|string} button - Button element or ID
 * @param {boolean} loading - Loading state
 * @param {string} loadingText - Text to show while loading (optional)
 */
function setButtonLoading(button, loading = true, loadingText = 'Loading...') {
    const btn = typeof button === 'string' ? document.getElementById(button) : button;
    if (!btn) {
        console.warn('Button not found');
        return;
    }

    if (loading) {
        // Store original content
        btn.dataset.originalContent = btn.innerHTML;
        btn.dataset.originalDisabled = btn.disabled;

        // Set loading state
        btn.disabled = true;
        btn.innerHTML = `
            <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>${loadingText}</span>
            </span>
        `;
    } else {
        // Restore original state
        if (btn.dataset.originalContent) {
            btn.innerHTML = btn.dataset.originalContent;
            btn.disabled = btn.dataset.originalDisabled === 'true';
            delete btn.dataset.originalContent;
            delete btn.dataset.originalDisabled;
        }
    }
}

/**
 * Show centered spinner
 * @param {string} containerId - ID of container element
 * @param {string} message - Optional message to display
 */
function showSpinner(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container with ID "${containerId}" not found`);
        return;
    }

    container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12">
            <svg class="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-600">${message}</p>
        </div>
    `;
}

/**
 * Show progress bar
 * @param {string} containerId - ID of container element
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} message - Optional message to display
 */
function showProgressBar(containerId, progress, message = 'Uploading...') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container with ID "${containerId}" not found`);
        return;
    }

    const percentage = Math.min(100, Math.max(0, progress));

    container.innerHTML = `
        <div class="py-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">${message}</span>
                <span class="text-sm font-medium text-gray-700">${percentage}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
            </div>
        </div>
    `;
}

/**
 * Hide spinner or progress bar
 * @param {string} containerId - ID of container element
 */
function hideSpinner(containerId) {
    hideLoadingSkeleton(containerId);
}

// Export loading state functions
window.showLoadingSkeleton = showLoadingSkeleton;
window.hideLoadingSkeleton = hideLoadingSkeleton;
window.setButtonLoading = setButtonLoading;
window.showSpinner = showSpinner;
window.showProgressBar = showProgressBar;
window.hideSpinner = hideSpinner;
