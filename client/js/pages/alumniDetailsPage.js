// alumniDetailsPage.js
// Extracted from app.js

(function() {
    'use strict';

async function renderAlumniDetails(params) {
    const alumni = await dataManager.getAlumniById(params.id);
    
    if (!alumni) {
        showToast('Alumni record not found', 'error');
        navigateTo('/alumni');
        return;
    }
    
    // Alumni object contains nested student data
    const student = alumni.student;
    
    if (!student) {
        showToast('Student data not found', 'error');
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
            <!-- Header with Back Button -->
            <div class="flex items-center gap-4 mb-8">
                <button onclick="navigateTo('/alumni')" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <i data-lucide="arrow-left" class="w-6 h-6 text-gray-600 dark:text-gray-400"></i>
                </button>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Alumni Profile</h2>
            </div>

            <!-- Premium Profile Section -->
            <div class="glass-card p-8 mb-8">
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="flex-shrink-0">
                        <img src="${student.profilePhoto || '/assets/images/default-avatar.png'}" alt="${student.fullNameEnglish}" class="w-32 h-32 rounded-2xl object-cover shadow-lg">
                    </div>
                    <div class="flex-1">
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">${student.fullNameEnglish}</h3>
                        <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                            <span class="flex items-center gap-2">
                                <i data-lucide="graduation-cap" class="w-4 h-4 text-blue-600"></i>
                                ${student.department?.name || 'N/A'}
                            </span>
                            <span class="flex items-center gap-2">
                                <i data-lucide="calendar" class="w-4 h-4 text-green-600"></i>
                                Class of ${alumni.graduationYear}
                            </span>
                            <span class="flex items-center gap-2">
                                <i data-lucide="hash" class="w-4 h-4 text-purple-600"></i>
                                ${student.currentRollNumber || 'N/A'}
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-2 mb-6">
                            <span class="px-4 py-2 rounded-full text-sm font-semibold ${alumni.alumniType === 'recent' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}">
                                ${alumni.alumniType === 'recent' ? 'Recent Alumni' : 'Established Alumni'}
                            </span>
                            <span class="px-4 py-2 rounded-full text-sm font-semibold ${
                                alumni.currentSupportCategory === 'receiving_support' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                alumni.currentSupportCategory === 'needs_extra_support' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }">
                                ${alumni.currentSupportCategory ? alumni.currentSupportCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'No Support Needed'}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-3">
                        <button onclick="addCareerPosition('${alumni.student.id}')" class="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg text-white px-4 py-3 rounded-lg transition-all font-semibold transform hover:scale-105">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                            Add Career
                        </button>
                        <button onclick="updateSupportCategory('${alumni.student.id}')" class="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white px-4 py-3 rounded-lg transition-all font-semibold transform hover:scale-105">
                            <i data-lucide="heart" class="w-4 h-4"></i>
                            Update Support
                        </button>
                    </div>
                </div>
            </div>

            <!-- Alumni-Specific Information -->
            <div class="glass-card p-8 mb-8 border-l-4 border-purple-500">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <i data-lucide="info" class="w-5 h-5 text-purple-600"></i>
                    Alumni Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Transition Date</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">${formatDate(alumni.transitionDate, 'long')}</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Alumni Type</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">${alumni.alumniType === 'recent' ? 'Recent Alumni' : 'Established Alumni'}</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Support Status</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">${alumni.currentSupportCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                </div>
            </div>

            <!-- Career History -->
            ${careerHistory.length > 0 ? `
                <div class="glass-card p-8 mb-8 border-l-4 border-blue-500">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <i data-lucide="briefcase" class="w-5 h-5 text-blue-600"></i>
                        Career History
                    </h3>
                    <div class="space-y-4">
                        ${careerHistory.map(pos => `
                            <div class="border-l-4 ${pos.isCurrent ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'} pl-6 py-4 bg-gradient-to-r ${pos.isCurrent ? 'from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700' : 'from-gray-50 to-gray-50 dark:from-gray-800 dark:to-gray-800'} rounded-lg">
                                <div class="flex items-start justify-between gap-4">
                                    <div class="flex-1">
                                        <h4 class="font-bold text-gray-900 dark:text-white text-lg">${pos.positionTitle}</h4>
                                        <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">${pos.organizationName}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                            ${formatDate(pos.startDate, 'short')} - ${pos.endDate ? formatDate(pos.endDate, 'short') : 'Present'}
                                        </p>
                                        ${pos.description ? `<p class="text-sm text-gray-700 dark:text-gray-300 mt-3">${pos.description}</p>` : ''}
                                    </div>
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                        pos.positionType === 'job' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                        pos.positionType === 'higher_study' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                        pos.positionType === 'business' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                    }">
                                        ${pos.positionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : `
                <div class="glass-card p-12 mb-8 text-center">
                    <i data-lucide="briefcase" class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600"></i>
                    <p class="text-gray-600 dark:text-gray-400 mb-6 text-lg">No career information added yet</p>
                    <button onclick="addCareerPosition('${alumni.student.id}')" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white rounded-lg transition-all font-semibold transform hover:scale-105">
                        Add First Career Position
                    </button>
                </div>
            `}

            <!-- Complete Student Data (Preserved from Student Record) -->
            <div class="glass-card p-8 mb-8 border-l-4 border-indigo-500">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <i data-lucide="user" class="w-5 h-5 text-indigo-600"></i>
                    Complete Student Record
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Full Name</p>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">${student.fullNameEnglish}</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-green-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Roll Number</p>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">${student.currentRollNumber || 'N/A'}</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-purple-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Registration Number</p>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">${student.currentRegistrationNumber || 'N/A'}</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-cyan-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Department</p>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">${student.department?.name || 'N/A'}</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-amber-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Date of Birth</p>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">${formatDate(student.dateOfBirth, 'long')}</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-red-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Phone</p>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">${student.mobileStudent || student.mobileParent || 'N/A'}</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-pink-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Email</p>
                        <p class="text-sm font-bold text-gray-900 dark:text-white truncate">${student.email || 'N/A'}</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-teal-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Semester</p>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">${student.semester || 'N/A'}</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-indigo-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Status</p>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">${student.status}</p>
                    </div>
                </div>
                <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button onclick="navigateTo('/student/${student.id}')" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors flex items-center gap-2">
                        View Complete Student Profile â†’
                    </button>
                </div>
            </div>

            <!-- Support History -->
            ${supportHistory.length > 0 ? `
                <div class="glass-card p-8 border-l-4 border-red-500">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <i data-lucide="heart" class="w-5 h-5 text-red-600"></i>
                        Support History
                    </h3>
                    <div class="space-y-4">
                        ${supportHistory.slice().reverse().map(support => `
                            <div class="border-l-4 border-red-500 pl-6 py-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <p class="font-bold text-gray-900 dark:text-white text-lg">${support.newCategory ? support.newCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown'}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">${formatDate(support.date, 'long')}</p>
                                        ${support.notes ? `<p class="text-sm text-gray-700 dark:text-gray-300 mt-3">${support.notes}</p>` : ''}
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
