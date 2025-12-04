// alumniDetailsPage.js
// Extracted from app.js

(function() {
    'use strict';

function renderAlumniDetails(params) {
    const alumni = dataManager.getAlumniById(params.id);
    
    if (!alumni) {
        showToast('Alumni record not found', 'error');
        navigateTo('/alumni');
        return;
    }
    
    const student = dataManager.getStudent(alumni.studentId);
    
    if (!student) {
        showToast('Student not found', 'error');
        navigateTo('/alumni');
        return;
    }
    
    renderNavbar('Alumni Profile');
    
    // Get alumni-specific data
    const currentPos = alumni.currentPosition;
    const careerHistory = alumni.careerHistory || [];
    const supportHistory = alumni.supportHistory || [];
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-6">
                <button onclick="navigateTo('/alumni')" class="text-gray-600 hover:text-gray-900">
                    <i data-lucide="arrow-left" class="w-6 h-6"></i>
                </button>
                <h2 class="text-2xl font-bold text-gray-900">Alumni Profile</h2>
            </div>

            <!-- Profile Section -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div class="flex flex-col md:flex-row gap-6">
                    <img src="${student.profilePhoto}" alt="${student.fullName}" class="w-32 h-32 rounded-full">
                    <div class="flex-1">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">${student.fullName}</h3>
                        <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <span class="flex items-center gap-1">
                                <i data-lucide="graduation-cap" class="w-4 h-4"></i>
                                ${student.department}
                            </span>
                            <span class="flex items-center gap-1">
                                <i data-lucide="calendar" class="w-4 h-4"></i>
                                Class of ${alumni.graduationYear}
                            </span>
                            <span class="flex items-center gap-1">
                                <i data-lucide="hash" class="w-4 h-4"></i>
                                ${student.rollNumber}
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 rounded-full text-sm font-medium ${alumni.alumniType === 'recent' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}">
                                ${alumni.alumniType === 'recent' ? 'Recent Alumni' : 'Established Alumni'}
                            </span>
                            <span class="px-3 py-1 rounded-full text-sm font-medium ${
                                alumni.currentSupportCategory === 'receiving_support' ? 'bg-blue-100 text-blue-800' :
                                alumni.currentSupportCategory === 'needs_extra_support' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }">
                                ${alumni.currentSupportCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <button onclick="addCareerPosition('${alumni.id}')" class="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                            Add Career
                        </button>
                        <button onclick="updateSupportCategory('${alumni.id}')" class="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i data-lucide="heart" class="w-4 h-4"></i>
                            Update Support
                        </button>
                    </div>
                </div>
            </div>

            <!-- Alumni-Specific Information -->
            <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Alumni Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p class="text-sm text-gray-600">Transition Date</p>
                        <p class="text-sm font-medium text-gray-900">${formatDate(alumni.transitionDate, 'long')}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Alumni Type</p>
                        <p class="text-sm font-medium text-gray-900">${alumni.alumniType === 'recent' ? 'Recent Alumni' : 'Established Alumni'}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Support Status</p>
                        <p class="text-sm font-medium text-gray-900">${alumni.currentSupportCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                </div>
            </div>

            <!-- Career History -->
            ${careerHistory.length > 0 ? `
                <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i data-lucide="briefcase" class="w-5 h-5 text-blue-600"></i>
                        Career History
                    </h3>
                    <div class="space-y-4">
                        ${careerHistory.map(pos => `
                            <div class="border-l-4 ${pos.isCurrent ? 'border-green-500' : 'border-gray-300'} pl-4 py-2">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <h4 class="font-semibold text-gray-900">${pos.positionTitle}</h4>
                                        <p class="text-sm text-gray-600">${pos.organizationName}</p>
                                        <p class="text-xs text-gray-500 mt-1">
                                            ${formatDate(pos.startDate, 'short')} - ${pos.endDate ? formatDate(pos.endDate, 'short') : 'Present'}
                                        </p>
                                        ${pos.description ? `<p class="text-sm text-gray-700 mt-2">${pos.description}</p>` : ''}
                                    </div>
                                    <span class="px-2 py-1 rounded-full text-xs font-medium ${
                                        pos.positionType === 'job' ? 'bg-green-100 text-green-800' :
                                        pos.positionType === 'higher_study' ? 'bg-blue-100 text-blue-800' :
                                        pos.positionType === 'business' ? 'bg-purple-100 text-purple-800' :
                                        'bg-gray-100 text-gray-800'
                                    }">
                                        ${pos.positionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : `
                <div class="bg-white rounded-xl shadow-sm p-6 mb-6 text-center">
                    <i data-lucide="briefcase" class="w-12 h-12 mx-auto mb-3 text-gray-400"></i>
                    <p class="text-gray-600 mb-4">No career information added yet</p>
                    <button onclick="addCareerPosition('${alumni.id}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        Add First Career Position
                    </button>
                </div>
            `}

            <!-- Complete Student Data (Preserved from Student Record) -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <i data-lucide="user" class="w-5 h-5 text-blue-600"></i>
                    Complete Student Record (Preserved)
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <p class="text-sm text-gray-600">Full Name</p>
                        <p class="text-sm font-medium text-gray-900">${student.fullName}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Roll Number</p>
                        <p class="text-sm font-medium text-gray-900">${student.rollNumber}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Registration Number</p>
                        <p class="text-sm font-medium text-gray-900">${student.registrationNumber}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Department</p>
                        <p class="text-sm font-medium text-gray-900">${student.department}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Date of Birth</p>
                        <p class="text-sm font-medium text-gray-900">${formatDate(student.dateOfBirth, 'long')}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Phone</p>
                        <p class="text-sm font-medium text-gray-900">${student.phone || student.mobileStudent || 'N/A'}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Email</p>
                        <p class="text-sm font-medium text-gray-900">${student.email || 'N/A'}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Enrollment Date</p>
                        <p class="text-sm font-medium text-gray-900">${formatDate(student.enrollmentDate, 'long')}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Status</p>
                        <p class="text-sm"><span class="badge badge-info">${student.status}</span></p>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <button onclick="navigateTo('/student/${student.id}')" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Complete Student Profile â†’
                    </button>
                </div>
            </div>

            <!-- Support History -->
            ${supportHistory.length > 1 ? `
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i data-lucide="heart" class="w-5 h-5 text-blue-600"></i>
                        Support History
                    </h3>
                    <div class="space-y-3">
                        ${supportHistory.slice().reverse().map(support => `
                            <div class="border-l-4 border-blue-500 pl-4 py-2">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <p class="font-medium text-gray-900">${support.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                                        <p class="text-xs text-gray-500">${formatDate(support.changedAt, 'long')} by ${support.changedBy}</p>
                                        ${support.notes ? `<p class="text-sm text-gray-700 mt-1">${support.notes}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    lucide.createIcons();
}

function editAlumni(id) {
    navigateTo(`/edit-alumni/${id}`);
}

// Export helper functions
window.renderAlumniDetails = renderAlumniDetails;

// Edit Alumni Page

    // Export to global scope
    window.AlumniDetailsPage = {
        render: renderAlumniDetails
    };

})();
