// alumniPage.js
// Alumni Page with Backend API Integration

(function() {
    'use strict';

async function renderAlumni() {
    try {
        renderNavbar('Alumni Management');
        
        // Show loading skeleton
        showLoadingSkeleton('main-content', 'stats', 5);
        
        // Fetch data from API
        const stats = await dataManager.getAlumniStats();
        const alumni = await dataManager.getAlumni();
        
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <!-- Premium Hero Stats Section -->
            <div class="mb-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div class="glass-card p-6 hover-lift animate-fade-in-up">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shadow-md">
                                <i data-lucide="graduation-cap" class="w-7 h-7 text-blue-600"></i>
                            </div>
                        </div>
                        <h3 class="text-3xl font-bold text-blue-600">${stats.total}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Alumni</p>
                    </div>
                    
                    <div class="glass-card p-6 hover-lift animate-fade-in-up" style="animation-delay: 0.1s">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center shadow-md">
                                <i data-lucide="user-plus" class="w-7 h-7 text-green-600"></i>
                            </div>
                        </div>
                        <h3 class="text-3xl font-bold text-green-600">${stats.recent}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Recent Alumni</p>
                    </div>
                    
                    <div class="glass-card p-6 hover-lift animate-fade-in-up" style="animation-delay: 0.2s">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center shadow-md">
                                <i data-lucide="briefcase" class="w-7 h-7 text-purple-600"></i>
                            </div>
                        </div>
                        <h3 class="text-3xl font-bold text-purple-600">${stats.established}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Established Alumni</p>
                    </div>
                    
                    <div class="glass-card p-6 hover-lift animate-fade-in-up" style="animation-delay: 0.3s">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center shadow-md">
                                <i data-lucide="heart" class="w-7 h-7 text-red-600"></i>
                            </div>
                        </div>
                        <h3 class="text-3xl font-bold text-red-600">${stats.bySupport.receiving_support}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Receiving Support</p>
                    </div>
                    
                    <div class="glass-card p-6 hover-lift animate-fade-in-up" style="animation-delay: 0.4s">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center shadow-md">
                                <i data-lucide="alert-circle" class="w-7 h-7 text-amber-600"></i>
                            </div>
                        </div>
                        <h3 class="text-3xl font-bold text-amber-600">${stats.bySupport.needs_extra_support}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Needs Support</p>
                    </div>
                </div>
            </div>

            <!-- Main Content Card -->
            <div class="glass-card p-6 md:p-8">
                <!-- Header with Title -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Alumni Records</h2>
                        <p class="text-gray-600 dark:text-gray-400">Manage and track alumni information</p>
                    </div>
                </div>

                <!-- Premium Filters Section -->
                <div class="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-100 dark:border-gray-600">
                    <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Filter Alumni</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div class="relative">
                            <select id="filter-alumni-type" class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm font-medium transition-all">
                                <option value="">All Types</option>
                                <option value="recent">Recent Alumni</option>
                                <option value="established">Established Alumni</option>
                            </select>
                        </div>
                        <div class="relative">
                            <select id="filter-support" class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm font-medium transition-all">
                                <option value="">All Support Categories</option>
                                <option value="receiving_support">Receiving Support</option>
                                <option value="needs_extra_support">Needs Extra Support</option>
                                <option value="no_support_needed">No Support Needed</option>
                            </select>
                        </div>
                        <div class="relative">
                            <select id="filter-position" class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm font-medium transition-all">
                                <option value="">All Positions</option>
                                <option value="job">Job</option>
                                <option value="higher_study">Higher Study</option>
                                <option value="business">Business</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="relative">
                            <select id="filter-year" class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm font-medium transition-all">
                                <option value="">All Years</option>
                                ${Object.keys(stats.byYear).sort().reverse().map(year => `<option value="${year}">${year}</option>`).join('')}
                            </select>
                        </div>
                        <div class="relative">
                            <input type="text" id="search-alumni" placeholder="Search alumni..." class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm font-medium transition-all">
                        </div>
                    </div>
                </div>

                <!-- Alumni Grid -->
                <div id="alumni-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${renderAlumniCategoryBoxes(alumni)}
                </div>
            </div>
        `;
        
        lucide.createIcons();
        
        // Add event listeners
        document.getElementById('filter-alumni-type').addEventListener('change', updateAlumniList);
        document.getElementById('filter-support').addEventListener('change', updateAlumniList);
        document.getElementById('filter-position').addEventListener('change', updateAlumniList);
        document.getElementById('filter-year').addEventListener('change', updateAlumniList);
        document.getElementById('search-alumni').addEventListener('input', debounce(updateAlumniList, 300));
    } catch (error) {
        console.error('Error rendering alumni page:', error);
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="glass-card p-6 border-l-4 border-red-500">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i data-lucide="alert-circle" class="w-6 h-6 text-red-600"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Alumni Page</h3>
                        <p class="text-red-700 dark:text-red-300 mb-4">${error.message}</p>
                        <button onclick="location.reload()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium">
                            Reload Page
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

function renderAlumniCategoryBoxes(alumni) {
    if (alumni.length === 0) {
        return `
            <div class="col-span-full text-center py-12">
                <i data-lucide="graduation-cap" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                <p class="text-gray-500">No alumni records found</p>
            </div>
        `;
    }

    // Group alumni by support category
    const supportGroups = {
        'receiving_support': [],
        'needs_extra_support': [],
        'no_support_needed': []
    };
    
    // Group alumni by position type
    const positionGroups = {
        'job': [],
        'higher_study': [],
        'business': [],
        'other': []
    };
    
    alumni.forEach(alum => {
        const supportCategory = alum.currentSupportCategory || 'no_support_needed';
        const positionType = alum.currentPosition?.positionType || 'other';
        
        if (supportGroups[supportCategory]) {
            supportGroups[supportCategory].push(alum);
        }
        if (positionGroups[positionType]) {
            positionGroups[positionType].push(alum);
        }
    });

    // Render support category boxes
    const supportBoxes = [
        renderSupportCategoryBox('receiving_support', supportGroups['receiving_support']),
        renderSupportCategoryBox('needs_extra_support', supportGroups['needs_extra_support']),
        renderSupportCategoryBox('no_support_needed', supportGroups['no_support_needed'])
    ];
    
    // Render position type boxes
    const positionBoxes = [
        renderPositionTypeBox('job', positionGroups['job']),
        renderPositionTypeBox('higher_study', positionGroups['higher_study']),
        renderPositionTypeBox('business', positionGroups['business']),
        renderPositionTypeBox('other', positionGroups['other'])
    ];
    
    return supportBoxes.concat(positionBoxes).join('');
}

function renderSupportCategoryBox(supportCategory, alumni) {
    const supportLabels = {
        'receiving_support': 'Receiving Support',
        'needs_extra_support': 'Needs Extra Support',
        'no_support_needed': 'No Support Needed'
    };
    
    const supportGradients = {
        'receiving_support': 'from-blue-600 to-cyan-600',
        'needs_extra_support': 'from-red-600 to-pink-600',
        'no_support_needed': 'from-green-600 to-teal-600'
    };
    
    const supportIconColors = {
        'receiving_support': 'bg-blue-100 text-blue-600',
        'needs_extra_support': 'bg-red-100 text-red-600',
        'no_support_needed': 'bg-green-100 text-green-600'
    };
    
    const supportIcons = {
        'receiving_support': 'heart',
        'needs_extra_support': 'alert-circle',
        'no_support_needed': 'check-circle'
    };

    const label = supportLabels[supportCategory];
    const gradient = supportGradients[supportCategory];
    const iconColorClass = supportIconColors[supportCategory];
    const icon = supportIcons[supportCategory];

    return `
        <div class="glass-card p-6 hover-lift border-l-4 border-blue-500 animate-fade-in-up">
            <!-- Category Header with Gradient Background -->
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 ${iconColorClass} rounded-lg flex items-center justify-center shadow-md">
                        <i data-lucide="${icon}" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900 dark:text-white">${label}</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Support Category</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent">${alumni.length}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Alumni</div>
                </div>
            </div>

            <!-- Alumni List Preview -->
            <div class="space-y-2 mb-4 max-h-48 overflow-y-auto">
                ${alumni.slice(0, 5).map(alum => {
                    const student = alum.student;
                    return `
                        <div class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors" onclick="viewAlumniDetails('${alum.student.id}')">
                            <img src="${student.profilePhoto || 'https://via.placeholder.com/32'}" alt="${student.fullNameEnglish}" class="w-8 h-8 rounded-full object-cover">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">${student.fullNameEnglish}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${alum.graduationYear}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
                ${alumni.length > 5 ? `
                    <div class="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                        +${alumni.length - 5} more alumni
                    </div>
                ` : ''}
            </div>

            <!-- View All Button with Gradient -->
            <button onclick="filterBySupport('${supportCategory}')" 
                class="w-full bg-gradient-to-r ${gradient} hover:shadow-lg text-white py-2.5 rounded-lg transition-all font-medium text-sm transform hover:scale-105">
                View All (${alumni.length})
            </button>
        </div>
    `;
}

function renderPositionTypeBox(positionType, alumni) {
    const positionLabels = {
        'job': 'Job',
        'higher_study': 'Higher Study',
        'business': 'Business',
        'other': 'Other'
    };
    
    const positionGradients = {
        'job': 'from-green-600 to-emerald-600',
        'higher_study': 'from-blue-600 to-indigo-600',
        'business': 'from-purple-600 to-pink-600',
        'other': 'from-gray-600 to-slate-600'
    };
    
    const positionIconColors = {
        'job': 'bg-green-100 text-green-600',
        'higher_study': 'bg-blue-100 text-blue-600',
        'business': 'bg-purple-100 text-purple-600',
        'other': 'bg-gray-100 text-gray-600'
    };
    
    const positionIcons = {
        'job': 'briefcase',
        'higher_study': 'book-open',
        'business': 'trending-up',
        'other': 'user'
    };

    const label = positionLabels[positionType];
    const gradient = positionGradients[positionType];
    const iconColorClass = positionIconColors[positionType];
    const icon = positionIcons[positionType];

    return `
        <div class="glass-card p-6 hover-lift border-l-4 border-purple-500 animate-fade-in-up">
            <!-- Category Header -->
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 ${iconColorClass} rounded-lg flex items-center justify-center shadow-md">
                        <i data-lucide="${icon}" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900 dark:text-white">${label}</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Position Type</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent">${alumni.length}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Alumni</div>
                </div>
            </div>

            <!-- Alumni List Preview -->
            <div class="space-y-2 mb-4 max-h-48 overflow-y-auto">
                ${alumni.slice(0, 5).map(alum => {
                    const student = alum.student;
                    return `
                        <div class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors" onclick="viewAlumniDetails('${alum.student.id}')">
                            <img src="${student.profilePhoto || 'https://via.placeholder.com/32'}" alt="${student.fullNameEnglish}" class="w-8 h-8 rounded-full object-cover">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">${student.fullNameEnglish}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${alum.graduationYear}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
                ${alumni.length > 5 ? `
                    <div class="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                        +${alumni.length - 5} more alumni
                    </div>
                ` : ''}
            </div>

            <!-- View All Button with Gradient -->
            <button onclick="filterByPosition('${positionType}')" 
                class="w-full bg-gradient-to-r ${gradient} hover:shadow-lg text-white py-2.5 rounded-lg transition-all font-medium text-sm transform hover:scale-105">
                View All (${alumni.length})
            </button>
        </div>
    `;
}



function renderAlumniCards(alumni) {
    if (alumni.length === 0) {
        return `
            <div class="col-span-full text-center py-12">
                <i data-lucide="graduation-cap" class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600"></i>
                <p class="text-gray-500 dark:text-gray-400">No alumni records found</p>
            </div>
        `;
    }
    
    // Fetch all student details for alumni
    // Note: alum.student is already a student object from the API, so we don't need to fetch it again
    const students = alumni.map(alum => alum.student);
    
    return alumni.map((alum, index) => {
        const student = students[index];
        if (!student || !alum) return '';
        
        const typeColors = {
            'recent': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
            'established': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
        
        const supportColors = {
            'receiving_support': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'needs_extra_support': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'no_support_needed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        };
        
        const positionColors = {
            'job': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'higher_study': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'business': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            'other': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        };
        
        const currentPos = alum.currentPosition;
        
        return `
            <div class="glass-card p-6 hover-lift animate-fade-in-up">
                <div class="flex items-start gap-4 mb-4">
                    <img src="${student.profilePhoto || 'https://via.placeholder.com/64'}" alt="${student.fullNameEnglish}" class="w-16 h-16 rounded-full object-cover shadow-md">
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 dark:text-white truncate">${student.fullNameEnglish}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${student.department?.name || 'N/A'}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-500">Class of ${alum.graduationYear}</p>
                    </div>
                </div>
                
                <div class="space-y-3 mb-4">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${typeColors[alum.alumniType]}">
                            ${alum.alumniType === 'recent' ? 'Recent' : 'Established'}
                        </span>
                        ${alum.currentSupportCategory ? `
                            <span class="px-3 py-1 rounded-full text-xs font-semibold ${supportColors[alum.currentSupportCategory]}">
                                ${alum.currentSupportCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        ` : ''}
                    </div>
                    ${currentPos && currentPos.positionType ? `
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="px-3 py-1 rounded-full text-xs font-semibold ${positionColors[currentPos.positionType] || positionColors.other}">
                                    ${currentPos.positionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <i data-lucide="building-2" class="w-4 h-4 flex-shrink-0"></i>
                                <span class="truncate">${currentPos.organizationName || 'N/A'}</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <i data-lucide="briefcase" class="w-4 h-4 flex-shrink-0"></i>
                                <span class="truncate">${currentPos.positionTitle || 'N/A'}</span>
                            </div>
                        </div>
                    ` : `
                        <div class="text-sm text-gray-500 dark:text-gray-400 italic">No career information added yet</div>
                    `}
                </div>
                
                <div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button onclick="viewAlumniDetails('${alum.student.id}')" class="flex-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                        View Details
                    </button>
                    <button onclick="editAlumni('${alum.student.id}')" class="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

async function updateAlumniList() {
    const grid = document.getElementById('alumni-grid');
    
    // Show loading
    grid.innerHTML = `
        <div class="col-span-full flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    `;
    
    try {
        const filters = {
            alumniType: document.getElementById('filter-alumni-type')?.value || '',
            currentSupportCategory: document.getElementById('filter-support')?.value || '',
            positionType: document.getElementById('filter-position')?.value || '',
            graduationYear: document.getElementById('filter-year')?.value || '',
            search: document.getElementById('search-alumni')?.value || ''
        };
        
        // Check if any filter is active
        const hasActiveFilter = filters.alumniType || filters.currentSupportCategory || filters.positionType || filters.graduationYear || filters.search;
        
        // Remove empty filters
        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });
        
        const alumni = await dataManager.getAlumni(filters);
        
        // If a filter is active, show individual alumni cards; otherwise show category boxes
        if (hasActiveFilter) {
            grid.innerHTML = renderAlumniCards(alumni);
        } else {
            grid.innerHTML = renderAlumniCategoryBoxes(alumni);
        }
        lucide.createIcons();
    } catch (error) {
        handleAPIError(error);
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i data-lucide="alert-circle" class="w-16 h-16 mx-auto mb-4 text-red-500"></i>
                <p class="text-gray-500">Failed to load alumni</p>
            </div>
        `;
        lucide.createIcons();
    }
}

async function filterBySupport(supportCategory) {
    // Set the support filter dropdown
    const supportFilter = document.getElementById('filter-support');
    if (supportFilter) supportFilter.value = supportCategory;
    
    // Clear position filter
    const positionFilter = document.getElementById('filter-position');
    if (positionFilter) positionFilter.value = '';
    
    // Trigger update
    await updateAlumniList();
}

async function filterByPosition(positionType) {
    // Set the position filter dropdown
    const positionFilter = document.getElementById('filter-position');
    if (positionFilter) positionFilter.value = positionType;
    
    // Clear support filter
    const supportFilter = document.getElementById('filter-support');
    if (supportFilter) supportFilter.value = '';
    
    // Trigger update
    await updateAlumniList();
}

async function addCareerPosition(alumniId) {
    showFormModal({
        title: 'Add Career Position',
        fields: [
            { id: 'positionType', label: 'Position Type', type: 'select', required: true, options: [
                { value: 'job', label: 'Job' },
                { value: 'higher_study', label: 'Higher Study' },
                { value: 'business', label: 'Business' },
                { value: 'other', label: 'Other' }
            ]},
            { id: 'organizationName', label: 'Organization/University', type: 'text', required: true, placeholder: 'Enter organization name' },
            { id: 'positionTitle', label: 'Position/Role Title', type: 'text', required: true, placeholder: 'Enter position title' },
            { id: 'startDate', label: 'Start Date', type: 'date', required: true },
            { id: 'endDate', label: 'End Date (Optional)', type: 'date', required: false },
            { id: 'isCurrent', label: 'Is Current Position?', type: 'select', required: false, options: [
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' }
            ]},
            { id: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Enter position description' }
        ],
        onSubmit: async (formData) => {
            try {
                const positionData = {
                    positionType: formData.positionType,
                    organizationName: formData.organizationName,
                    positionTitle: formData.positionTitle,
                    startDate: formData.startDate,
                    endDate: formData.endDate || null,
                    isCurrent: formData.isCurrent === 'true',
                    description: formData.description || ''
                };
                
                await dataManager.addCareerPosition(alumniId, positionData);
                showSuccessToast('Career position added successfully');
                navigateTo(`/alumni/${alumniId}`);
            } catch (error) {
                handleAPIError(error);
            }
        }
    });
}

async function updateSupportCategory(alumniId) {
    try {
        const alumni = await dataManager.getAlumniById(alumniId);
        
        showFormModal({
            title: 'Update Support Category',
            fields: [
                { id: 'category', label: 'Support Category', type: 'select', required: true, options: [
                    { value: 'receiving_support', label: 'Receiving Support' },
                    { value: 'needs_extra_support', label: 'Needs Extra Support' },
                    { value: 'no_support_needed', label: 'No Support Needed' }
                ]},
                { id: 'notes', label: 'Notes', type: 'textarea', required: false, placeholder: 'Enter reason for change' }
            ],
            onSubmit: async (formData) => {
                try {
                    await dataManager.updateSupportCategory(alumniId, formData.category, formData.notes);
                    showSuccessToast('Support category updated successfully');
                    navigateTo(`/alumni/${alumniId}`);
                } catch (error) {
                    handleAPIError(error);
                }
            }
        });
    } catch (error) {
        handleAPIError(error);
    }
}

function viewAlumniDetails(id) {
    navigateTo(`/alumni/${id}`);
}

async function deleteAlumniConfirm(id) {
    try {
        const alumni = await dataManager.getAlumniById(id);
        if (!alumni) {
            showErrorToast('Alumni record not found');
            return;
        }
        
        const student = await dataManager.getStudent(alumni.student);
        
        showConfirmModal({
            title: 'Delete Alumni Record',
            message: `Are you sure you want to delete the alumni record for ${student.fullNameEnglish}? This action cannot be undone.`,
            confirmText: 'Delete',
            type: 'danger',
            onConfirm: async () => {
                try {
                    // Note: Backend may not support alumni deletion
                    // This would need to be implemented in the backend
                    showErrorToast('Alumni deletion not yet supported');
                    // await dataManager.deleteAlumni(id);
                    // showSuccessToast('Alumni record deleted successfully');
                    // navigateTo('/alumni');
                } catch (error) {
                    handleAPIError(error);
                }
            }
        });
    } catch (error) {
        handleAPIError(error);
    }
}

// Export helper functions
window.viewAlumniDetails = viewAlumniDetails;
window.deleteAlumniConfirm = deleteAlumniConfirm;
window.addCareerPosition = addCareerPosition;
window.updateSupportCategory = updateSupportCategory;
window.filterBySupport = filterBySupport;
window.filterByPosition = filterByPosition;

// Export to global scope
window.AlumniPage = {
    render: renderAlumni
};

})();
