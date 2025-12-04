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
            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                ${createStatCard({ title: 'Total Alumni', value: stats.total, icon: 'graduation-cap', color: 'blue' })}
                ${createStatCard({ title: 'Recent Alumni', value: stats.recent, icon: 'user-plus', color: 'green' })}
                ${createStatCard({ title: 'Established Alumni', value: stats.established, icon: 'briefcase', color: 'purple' })}
                ${createStatCard({ title: 'Receiving Support', value: stats.bySupport.receiving_support, icon: 'heart', color: 'red' })}
                ${createStatCard({ title: 'Needs Support', value: stats.bySupport.needs_extra_support, icon: 'alert-circle', color: 'amber' })}
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Alumni Records</h2>
                </div>

                <!-- Filters -->
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <select id="filter-alumni-type" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">All Types</option>
                        <option value="recent">Recent Alumni</option>
                        <option value="established">Established Alumni</option>
                    </select>
                    <select id="filter-support" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">All Support Categories</option>
                        <option value="receiving_support">Receiving Support</option>
                        <option value="needs_extra_support">Needs Extra Support</option>
                        <option value="no_support_needed">No Support Needed</option>
                    </select>
                    <select id="filter-position" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">All Positions</option>
                        <option value="job">Job</option>
                        <option value="higher_study">Higher Study</option>
                        <option value="business">Business</option>
                        <option value="other">Other</option>
                    </select>
                    <select id="filter-year" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">All Years</option>
                        ${Object.keys(stats.byYear).sort().reverse().map(year => `<option value="${year}">${year}</option>`).join('')}
                    </select>
                    <input type="text" id="search-alumni" placeholder="Search alumni..." class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <!-- Alumni Grid -->
                <div id="alumni-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${renderAlumniCards(alumni)}
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
            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 class="text-red-800 font-semibold mb-2">Error Loading Alumni Page</h3>
                <p class="text-red-600">${error.message}</p>
                <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Reload Page
                </button>
            </div>
        `;
    }
}

async function renderAlumniCards(alumni) {
    if (alumni.length === 0) {
        return `
            <div class="col-span-full text-center py-12">
                <i data-lucide="graduation-cap" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                <p class="text-gray-500">No alumni records found</p>
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
            'recent': 'bg-amber-100 text-amber-800',
            'established': 'bg-green-100 text-green-800'
        };
        
        const supportColors = {
            'receiving_support': 'bg-blue-100 text-blue-800',
            'needs_extra_support': 'bg-red-100 text-red-800',
            'no_support_needed': 'bg-gray-100 text-gray-800'
        };
        
        const positionColors = {
            'job': 'bg-green-100 text-green-800',
            'higher_study': 'bg-blue-100 text-blue-800',
            'business': 'bg-purple-100 text-purple-800',
            'other': 'bg-gray-100 text-gray-800'
        };
        
        const currentPos = alum.currentPosition;
        
        return `
            <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow card-hover">
                <div class="flex items-start gap-4 mb-4">
                    <img src="${student.profilePhoto || 'https://via.placeholder.com/64'}" alt="${student.fullNameEnglish}" class="w-16 h-16 rounded-full">
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 truncate">${student.fullNameEnglish}</h3>
                        <p class="text-sm text-gray-500">${student.department?.name || 'N/A'}</p>
                        <p class="text-xs text-gray-400">Class of ${alum.graduationYear}</p>
                    </div>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${typeColors[alum.alumniType]}">
                            ${alum.alumniType === 'recent' ? 'Recent' : 'Established'}
                        </span>
                        ${alum.currentSupportCategory ? `
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${supportColors[alum.currentSupportCategory]}">
                                ${alum.currentSupportCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        ` : ''}
                    </div>
                    ${currentPos && currentPos.positionType ? `
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${positionColors[currentPos.positionType] || 'bg-gray-100 text-gray-800'}">
                                ${currentPos.positionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <i data-lucide="building" class="w-4 h-4"></i>
                            <span class="truncate">${currentPos.organizationName || 'N/A'}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <i data-lucide="briefcase" class="w-4 h-4"></i>
                            <span class="truncate">${currentPos.positionTitle || 'N/A'}</span>
                        </div>
                    ` : `
                        <div class="text-sm text-gray-500 italic">No career information added yet</div>
                    `}
                </div>
                
                <div class="flex gap-2">
                    <button onclick="viewAlumniDetails('${student.id}')" class="flex-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Details
                    </button>
                    <button onclick="editAlumni('${student.id}')" class="text-gray-600 hover:text-gray-700">
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
            graduationYear: document.getElementById('filter-year')?.value || '',
            search: document.getElementById('search-alumni')?.value || ''
        };
        
        // Remove empty filters
        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });
        
        const alumni = await dataManager.getAlumni(filters);
        
        grid.innerHTML = await renderAlumniCards(alumni);
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

// Export to global scope
window.AlumniPage = {
    render: renderAlumni
};

})();
