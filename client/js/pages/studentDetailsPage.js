// studentDetailsPage.js
// Student Details Page with Backend API Integration

(function() {
    'use strict';

async function renderStudentDetails(params) {
    renderNavbar('Student Details');
    
    // Show loading skeleton
    showLoadingSkeleton('main-content', 'card');
    
    try {
        // Fetch student data from API
        const student = await dataManager.getStudent(params.id);
        
        if (!student) {
            showErrorToast('Student not found');
            navigateTo('/students');
            return;
        }
        
        // Fetch related data
        const documents = await dataManager.getDocuments(student.id);
        const marks = await dataManager.getMarks(student.id);
        const attendance = await dataManager.getAttendance(student.id);
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <!-- Breadcrumb Navigation -->
            <div class="flex items-center gap-2 mb-6 text-sm">
                <button onclick="navigateTo('/students')" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    Students
                </button>
                <span class="text-gray-600">/</span>
                <span class="text-white font-medium">Details</span>
            </div>

            <!-- Hero Section with Student Info -->
            <div class="glass-card p-8 mb-8 animate-fade-in-up">
                <div class="flex flex-col md:flex-row gap-8">
                    <!-- Profile Photo -->
                    <div class="flex-shrink-0">
                        <img src="${student.profilePhoto || 'https://via.placeholder.com/160'}" alt="${student.fullNameEnglish}" class="w-40 h-40 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl">
                    </div>
                    
                    <!-- Student Info -->
                    <div class="flex-1">
                        <div class="mb-4">
                            <h1 class="text-4xl font-bold text-white mb-2">${student.fullNameEnglish}</h1>
                            <p class="text-gray-400 text-lg">${student.fullNameBangla || 'N/A'}</p>
                        </div>
                        
                        <!-- Quick Info -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div class="bg-white/10 rounded-lg p-3 border border-white/10">
                                <p class="text-xs text-gray-400 mb-1">Roll Number</p>
                                <p class="text-lg font-bold text-white">${student.currentRollNumber}</p>
                            </div>
                            <div class="bg-white/10 rounded-lg p-3 border border-white/10">
                                <p class="text-xs text-gray-400 mb-1">Semester</p>
                                <p class="text-lg font-bold text-white">${student.semester}</p>
                            </div>
                            <div class="bg-white/10 rounded-lg p-3 border border-white/10">
                                <p class="text-xs text-gray-400 mb-1">Department</p>
                                <p class="text-lg font-bold text-white">${student.department?.name || 'N/A'}</p>
                            </div>
                            <div class="bg-white/10 rounded-lg p-3 border border-white/10">
                                <p class="text-xs text-gray-400 mb-1">Status</p>
                                <span class="inline-block px-3 py-1 rounded-full text-xs font-bold ${student.status === 'active' ? 'bg-green-500/20 text-green-400' : student.status === 'graduated' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}">
                                    ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex flex-wrap gap-3">
                            <button onclick="editStudent('${student.id}')" class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all hover-lift">
                                <i data-lucide="edit" class="w-4 h-4"></i>
                                Edit
                            </button>
                            <button onclick="showDocumentSelectionModal('${student.id}')" class="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg transition-all hover-lift">
                                <i data-lucide="download" class="w-4 h-4"></i>
                                Download / Print
                            </button>
                            ${student.status === 'active' ? `
                            <button onclick="disconnectStudentConfirm('${student.id}')" class="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all hover-lift">
                                <i data-lucide="user-x" class="w-4 h-4"></i>
                                Disconnect
                            </button>
                            ` : ''}
                            <button onclick="deleteStudentConfirm('${student.id}')" class="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg transition-all border border-red-500/30">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Information Sections -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Personal Info -->
                <div class="glass-card overflow-hidden">
                    <button onclick="toggleSection('personal-info')" class="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <i data-lucide="user" class="w-5 h-5 text-white"></i>
                            </div>
                            <h3 class="text-lg font-bold text-white">Personal Information</h3>
                        </div>
                        <i data-lucide="chevron-down" id="personal-info-icon" class="w-5 h-5 text-gray-400 transition-transform"></i>
                    </button>
                    <div id="personal-info" class="px-6 pb-6">
                        <dl class="space-y-3">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Full Name (Bangla)</dt>
                            <dd class="text-sm text-gray-900">${student.fullNameBangla || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Full Name (English)</dt>
                            <dd class="text-sm text-gray-900">${student.fullNameEnglish}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Father's Name</dt>
                            <dd class="text-sm text-gray-900">${student.fatherName || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Father's NID</dt>
                            <dd class="text-sm text-gray-900">${student.fatherNID || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Mother's Name</dt>
                            <dd class="text-sm text-gray-900">${student.motherName || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Mother's NID</dt>
                            <dd class="text-sm text-gray-900">${student.motherNID || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
                            <dd class="text-sm text-gray-900">${formatDate(student.dateOfBirth, 'long')}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Birth Certificate No</dt>
                            <dd class="text-sm text-gray-900">${student.birthCertificateNo || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">NID Number</dt>
                            <dd class="text-sm text-gray-900">${student.nidNumber || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Gender</dt>
                            <dd class="text-sm text-gray-900">${student.gender || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Religion</dt>
                            <dd class="text-sm text-gray-900">${student.religion || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Blood Group</dt>
                            <dd class="text-sm text-gray-900">${student.bloodGroup || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Marital Status</dt>
                            <dd class="text-sm text-gray-900">${student.maritalStatus || 'N/A'}</dd>
                        </div>
                    </dl>
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="glass-card overflow-hidden">
                    <button onclick="toggleSection('contact-info')" class="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                                <i data-lucide="phone" class="w-5 h-5 text-white"></i>
                            </div>
                            <h3 class="text-lg font-bold text-white">Contact Information</h3>
                        </div>
                        <i data-lucide="chevron-down" id="contact-info-icon" class="w-5 h-5 text-gray-400 transition-transform"></i>
                    </button>
                    <div id="contact-info" class="px-6 pb-6">
                        <dl class="space-y-3">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Mobile (Student)</dt>
                            <dd class="text-sm text-gray-900">${student.mobileStudent}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Guardian Mobile</dt>
                            <dd class="text-sm text-gray-900">${student.guardianMobile || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Email</dt>
                            <dd class="text-sm text-gray-900">${student.email || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Emergency Contact</dt>
                            <dd class="text-sm text-gray-900">${student.emergencyContact || 'N/A'}</dd>
                        </div>
                    </dl>
                    </div>
                </div>

                <!-- Present Address -->
                <div class="glass-card overflow-hidden">
                    <button onclick="toggleSection('present-address')" class="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                <i data-lucide="map-pin" class="w-5 h-5 text-white"></i>
                            </div>
                            <h3 class="text-lg font-bold text-white">Present Address</h3>
                        </div>
                        <i data-lucide="chevron-down" id="present-address-icon" class="w-5 h-5 text-gray-400 transition-transform"></i>
                    </button>
                    <div id="present-address" class="px-6 pb-6">
                        <dl class="space-y-2">
                        ${student.presentAddress && typeof student.presentAddress === 'object' ? `
                            <div><dt class="text-xs font-medium text-gray-500">Division:</dt><dd class="text-sm text-gray-900">${student.presentAddress.division}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">District:</dt><dd class="text-sm text-gray-900">${student.presentAddress.district}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Sub-district:</dt><dd class="text-sm text-gray-900">${student.presentAddress.subDistrict}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Police Station:</dt><dd class="text-sm text-gray-900">${student.presentAddress.policeStation}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Post Office:</dt><dd class="text-sm text-gray-900">${student.presentAddress.postOffice}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Municipality/Union:</dt><dd class="text-sm text-gray-900">${student.presentAddress.municipality}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Village/Neighborhood:</dt><dd class="text-sm text-gray-900">${student.presentAddress.village}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Ward:</dt><dd class="text-sm text-gray-900">${student.presentAddress.ward}</dd></div>
                        ` : `<p class="text-sm text-gray-900">${student.address || 'N/A'}</p>`}
                    </dl>
                    </div>
                </div>

                <!-- Permanent Address -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button onclick="toggleSection('permanent-address')" class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div class="flex items-center gap-2">
                            <i data-lucide="home" class="w-5 h-5 text-blue-600"></i>
                            <h3 class="text-lg font-semibold text-gray-900">Permanent Address</h3>
                        </div>
                        <i data-lucide="chevron-down" id="permanent-address-icon" class="w-5 h-5 text-gray-400 transition-transform"></i>
                    </button>
                    <div id="permanent-address" class="px-6 pb-6">
                        <dl class="space-y-2">
                        ${student.permanentAddress && typeof student.permanentAddress === 'object' ? `
                            <div><dt class="text-xs font-medium text-gray-500">Division:</dt><dd class="text-sm text-gray-900">${student.permanentAddress.division}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">District:</dt><dd class="text-sm text-gray-900">${student.permanentAddress.district}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Sub-district:</dt><dd class="text-sm text-gray-900">${student.permanentAddress.subDistrict}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Police Station:</dt><dd class="text-sm text-gray-900">${student.permanentAddress.policeStation}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Post Office:</dt><dd class="text-sm text-gray-900">${student.permanentAddress.postOffice}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Municipality/Union:</dt><dd class="text-sm text-gray-900">${student.permanentAddress.municipality}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Village/Neighborhood:</dt><dd class="text-sm text-gray-900">${student.permanentAddress.village}</dd></div>
                            <div><dt class="text-xs font-medium text-gray-500">Ward:</dt><dd class="text-sm text-gray-900">${student.permanentAddress.ward}</dd></div>
                        ` : `<p class="text-sm text-gray-900">${student.address || 'N/A'}</p>`}
                    </dl>
                    </div>
                </div>

                <!-- Educational Background -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button onclick="toggleSection('educational-background')" class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div class="flex items-center gap-2">
                            <i data-lucide="graduation-cap" class="w-5 h-5 text-blue-600"></i>
                            <h3 class="text-lg font-semibold text-gray-900">Educational Background</h3>
                        </div>
                        <i data-lucide="chevron-down" id="educational-background-icon" class="w-5 h-5 text-gray-400 transition-transform"></i>
                    </button>
                    <div id="educational-background" class="px-6 pb-6">
                        <dl class="space-y-3">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Highest Exam</dt>
                            <dd class="text-sm text-gray-900">${student.highestExam || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Board</dt>
                            <dd class="text-sm text-gray-900">${student.board || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Group</dt>
                            <dd class="text-sm text-gray-900">${student.group || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Passing Year</dt>
                            <dd class="text-sm text-gray-900">${student.passingYear || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">GPA</dt>
                            <dd class="text-sm text-gray-900">${student.gpa || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Institution</dt>
                            <dd class="text-sm text-gray-900">${student.institutionName || 'N/A'}</dd>
                        </div>
                    </dl>
                    </div>
                </div>

                <!-- Current Academic Info -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button onclick="toggleSection('current-academic')" class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div class="flex items-center gap-2">
                            <i data-lucide="book-open" class="w-5 h-5 text-blue-600"></i>
                            <h3 class="text-lg font-semibold text-gray-900">Current Academic Information</h3>
                        </div>
                        <i data-lucide="chevron-down" id="current-academic-icon" class="w-5 h-5 text-gray-400 transition-transform"></i>
                    </button>
                    <div id="current-academic" class="px-6 pb-6">
                        <dl class="space-y-3">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Roll Number</dt>
                            <dd class="text-sm text-gray-900">${student.currentRollNumber}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Registration Number</dt>
                            <dd class="text-sm text-gray-900">${student.currentRegistrationNumber}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Current Semester</dt>
                            <dd class="text-sm text-gray-900">
                                Semester ${student.semester}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Department</dt>
                            <dd class="text-sm text-gray-900">${student.department?.name || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Session</dt>
                            <dd class="text-sm text-gray-900">${student.session || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Shift</dt>
                            <dd class="text-sm text-gray-900">${student.shift || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Group</dt>
                            <dd class="text-sm text-gray-900">${student.currentGroup || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Enrollment Date</dt>
                            <dd class="text-sm text-gray-900">${formatDate(student.enrollmentDate, 'long')}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Status</dt>
                            <dd class="text-sm"><span class="badge badge-${student.status === 'active' ? 'success' : student.status === 'graduated' ? 'info' : 'warning'}">${student.status}</span></dd>
                        </div>
                    </dl>

                    </div>
                </div>

                <!-- Semester Results -->
                <div class="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <i data-lucide="award" class="w-5 h-5 text-blue-600"></i>
                            Semester Results
                        </h3>
                        <button onclick="updateSemesterResults('${student.id}')" class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                            <i data-lucide="edit" class="w-4 h-4"></i>
                            Update Results
                        </button>
                    </div>
                    ${student.semesterResults && student.semesterResults.length > 0 ? `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${student.semesterResults.map(result => {
                            const referredSubjects = result.referredSubjects || [];
                            const hasReferred = referredSubjects.length > 0;
                            return `
                            <div class="border ${hasReferred ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg p-4">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm font-medium text-gray-700">Semester ${result.semester}</span>
                                    <span class="text-xs text-gray-500">${result.cgpa ? 'CGPA: ' + result.cgpa : ''}</span>
                                </div>
                                <div class="text-2xl font-bold ${hasReferred ? 'text-red-600' : 'text-blue-600'}">GPA: ${result.gpa}</div>
                                ${hasReferred ? `
                                    <div class="mt-3 pt-3 border-t border-red-200">
                                        <p class="text-xs font-semibold text-red-700 mb-1">
                                            <i data-lucide="alert-circle" class="w-3 h-3 inline"></i>
                                            Referred: ${referredSubjects.length} Subject${referredSubjects.length > 1 ? 's' : ''}
                                        </p>
                                        <ul class="text-xs text-red-600 space-y-1">
                                            ${referredSubjects.map(sub => `<li>• ${sub}</li>`).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                            </div>
                        `}).join('')}
                    </div>
                    ` : `
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <i data-lucide="inbox" class="w-12 h-12 mx-auto text-gray-400 mb-3"></i>
                        <p class="text-gray-600 font-medium mb-2">No Results Available</p>
                        <p class="text-sm text-gray-500 mb-4">Semester results have not been added yet.</p>
                        <button onclick="updateSemesterResults('${student.id}')" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                            Add Results
                        </button>
                    </div>
                    `}
                </div>

                <!-- Semester Attendance -->
                <div class="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <i data-lucide="calendar-check" class="w-5 h-5 text-green-600"></i>
                            Semester Attendance
                        </h3>
                        <button onclick="updateSemesterAttendance('${student.id}')" class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                            <i data-lucide="edit" class="w-4 h-4"></i>
                            Update Attendance
                        </button>
                    </div>
                    ${student.semesterAttendance && student.semesterAttendance.length > 0 ? `
                    <div class="space-y-4">
                        ${student.semesterAttendance.map(attendance => `
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-sm font-semibold text-gray-800">Semester ${attendance.semester}</span>
                                    <span class="px-3 py-1 rounded-full text-sm font-medium ${
                                        attendance.averageAttendance >= 80 ? 'bg-green-100 text-green-800' :
                                        attendance.averageAttendance >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }">
                                        Average: ${attendance.averageAttendance.toFixed(2)}%
                                    </span>
                                </div>
                                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    ${attendance.subjects.map(subject => `
                                        <div class="bg-gray-50 rounded-lg p-3">
                                            <div class="text-xs text-gray-600 mb-1">${subject.name}</div>
                                            <div class="flex items-center justify-between">
                                                <span class="text-lg font-bold ${
                                                    subject.percentage >= 80 ? 'text-green-600' :
                                                    subject.percentage >= 60 ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }">${subject.percentage}%</span>
                                                <span class="text-xs text-gray-500">${subject.present}/${subject.total}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ` : `
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <i data-lucide="calendar" class="w-12 h-12 mx-auto text-gray-400 mb-3"></i>
                        <p class="text-gray-600 font-medium mb-2">No Attendance Available</p>
                        <p class="text-sm text-gray-500 mb-4">Semester attendance records have not been added yet.</p>
                        <button onclick="updateSemesterAttendance('${student.id}')" class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                            Add Attendance
                        </button>
                    </div>
                    `}
                </div>

                <!-- Documents -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <i data-lucide="file-text" class="w-5 h-5"></i>
                            Documents (${documents.length})
                        </h3>
                        <button onclick="uploadDocument('${student.id}')" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <i data-lucide="upload" class="w-4 h-4 inline"></i> Upload
                        </button>
                    </div>
                    <div class="space-y-2">
                        ${documents.length > 0 ? documents.slice(0, 5).map(doc => `
                            <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded border border-gray-100">
                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                    <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <i data-lucide="file-text" class="w-5 h-5 text-blue-600"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate">${doc.fileName}</p>
                                        <p class="text-xs text-gray-500">${doc.category} â€¢ ${formatFileSize(doc.fileSize)}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2 flex-shrink-0">
                                    <button onclick="viewDocument('${doc.id}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg flex items-center gap-1.5 transition-colors">
                                        <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                                        <span>View</span>
                                    </button>
                                    <a href="${doc.fileUrl}" download="${doc.fileName}" class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg flex items-center gap-1.5 transition-colors">
                                        <i data-lucide="download" class="w-3.5 h-3.5"></i>
                                        <span>Download</span>
                                    </a>
                                </div>
                            </div>
                        `).join('') : '<p class="text-sm text-gray-500">No documents uploaded</p>'}
                        ${documents.length > 5 ? `
                            <button onclick="navigateTo('/documents')" class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 mt-2">
                                View All ${documents.length} Documents â†’
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
        
        lucide.createIcons();
        
    } catch (error) {
        handleAPIError(error);
        renderErrorState(params.id);
    }
}

function renderErrorState(studentId) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm p-12 text-center">
                <i data-lucide="alert-circle" class="w-16 h-16 mx-auto mb-4 text-red-500"></i>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Unable to Load Student Details</h2>
                <p class="text-gray-600 mb-6">There was an error loading the student information.</p>
                <div class="flex gap-3 justify-center">
                    <button onclick="navigateTo('/students')" class="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        Back to Students
                    </button>
                    <button onclick="StudentDetailsPage.render({id: '${studentId}'})" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                        <i data-lucide="refresh-cw" class="w-5 h-5 inline mr-2"></i>
                        Retry
                    </button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function editStudent(id) {
    navigateTo(`/edit-student/${id}`);
}

// Disconnect Student Functions
async function disconnectStudentConfirm(studentId) {
    try {
        const student = await dataManager.getStudent(studentId);
        if (!student) {
            showErrorToast('Student not found');
            return;
        }

    // Generate math challenge
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let correctAnswer;
    switch(operator) {
        case '+': correctAnswer = num1 + num2; break;
        case '-': correctAnswer = num1 - num2; break;
        case '×': correctAnswer = num1 * num2; break;
    }

    // Create math challenge modal
    const modalContainer = document.getElementById('modal-container');
    const modalId = generateUUID();
    
    const modal = document.createElement('div');
    modal.id = `modal-${modalId}`;
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 fade-in">
            <div class="flex items-start gap-4 mb-4">
                <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <i data-lucide="alert-triangle" class="w-6 h-6 text-orange-600"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Disconnect Student from Studies</h3>
                    <p class="text-gray-600 mb-4">Are you sure you want to disconnect <strong>${student.fullNameEnglish}</strong> from studies?</p>
                    
                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                        <p class="text-sm font-medium text-gray-700 mb-2">Please solve this math problem to confirm:</p>
                        <p class="text-2xl font-bold text-gray-900 text-center mb-3">${num1} ${operator} ${num2} = ?</p>
                        <input type="number" id="math-answer-${modalId}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg" placeholder="Enter answer">
                        <p id="math-error-${modalId}" class="text-red-600 text-sm mt-2 hidden">Incorrect answer. Please try again.</p>
                    </div>
                </div>
            </div>
            <div class="flex gap-3 justify-end">
                <button onclick="closeModal('${modalId}')" class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    Cancel
                </button>
                <button onclick="verifyMathAndShowReasonForm('${modalId}', '${studentId}', ${correctAnswer})" class="px-4 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
                    Continue
                </button>
            </div>
        </div>
    `;
    
        modalContainer.appendChild(modal);
        lucide.createIcons();
        
        // Focus on input
        setTimeout(() => {
            document.getElementById(`math-answer-${modalId}`).focus();
        }, 100);
    } catch (error) {
        handleAPIError(error);
    }
}

function verifyMathAndShowReasonForm(modalId, studentId, correctAnswer) {
    const answerInput = document.getElementById(`math-answer-${modalId}`);
    const errorMsg = document.getElementById(`math-error-${modalId}`);
    const userAnswer = parseInt(answerInput.value);
    
    if (userAnswer !== correctAnswer) {
        errorMsg.classList.remove('hidden');
        answerInput.classList.add('border-red-500');
        answerInput.value = '';
        answerInput.focus();
        return;
    }
    
    // Close math challenge modal
    closeModal(modalId);
    
    // Show reason form modal
    setTimeout(() => showDisconnectReasonForm(studentId), 300);
}

async function showDisconnectReasonForm(studentId) {
    try {
        const student = await dataManager.getStudent(studentId);
        if (!student) return;
    
    const modalContainer = document.getElementById('modal-container');
    const modalId = generateUUID();
    
    const modal = document.createElement('div');
    modal.id = `modal-${modalId}`;
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 fade-in my-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Disconnect Student - Reason Form</h3>
            <form id="disconnect-form-${modalId}">
                <div class="space-y-4">
                    <!-- Disconnection Reason -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Disconnection Reason <span class="text-red-500">*</span>
                        </label>
                        <textarea 
                            id="disconnect-reason-${modalId}" 
                            rows="3" 
                            required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter the reason for disconnection..."
                        ></textarea>
                    </div>
                    
                    <!-- Drop Semester -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Drop Semester <span class="text-red-500">*</span>
                        </label>
                        <select 
                            id="drop-semester-${modalId}" 
                            required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="">Select semester</option>
                            ${student.semester > 1 ? `<option value="${student.semester - 1}">Semester ${student.semester - 1} (Previous)</option>` : ''}
                            <option value="${student.semester}">Semester ${student.semester} (Current)</option>
                        </select>
                    </div>
                    
                    <!-- Guardian Contacted -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Guardian Contacted? <span class="text-red-500">*</span>
                        </label>
                        <div class="flex gap-4">
                            <label class="flex items-center">
                                <input type="radio" name="guardian-contacted-${modalId}" value="yes" required class="mr-2">
                                <span class="text-sm text-gray-700">Yes</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="guardian-contacted-${modalId}" value="no" required class="mr-2">
                                <span class="text-sm text-gray-700">No</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Additional Notes -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes (Optional)
                        </label>
                        <textarea 
                            id="additional-notes-${modalId}" 
                            rows="2" 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Any additional information..."
                        ></textarea>
                    </div>
                </div>
                
                <div class="flex gap-3 justify-end mt-6">
                    <button type="button" onclick="closeModal('${modalId}')" class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
                        Confirm Disconnect
                    </button>
                </div>
            </form>
        </div>
    `;
    
        modalContainer.appendChild(modal);
        lucide.createIcons();
        
        // Handle form submission
        const form = document.getElementById(`disconnect-form-${modalId}`);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const reason = document.getElementById(`disconnect-reason-${modalId}`).value;
            const dropSemester = document.getElementById(`drop-semester-${modalId}`).value;
            const guardianContacted = document.querySelector(`input[name="guardian-contacted-${modalId}"]:checked`).value;
            const notes = document.getElementById(`additional-notes-${modalId}`).value;
            
            disconnectStudent(studentId, {
                reason,
                dropSemester: parseInt(dropSemester),
                guardianContacted: guardianContacted === 'yes',
                notes,
                disconnectedAt: new Date().toISOString()
            });
            
            closeModal(modalId);
        });
    } catch (error) {
        handleAPIError(error);
    }
}

async function disconnectStudent(studentId, disconnectInfo) {
    try {
        await dataManager.disconnectStudies(
            studentId,
            disconnectInfo.reason,
            disconnectInfo.dropSemester
        );
        
        showSuccessToast('Student disconnected from studies');
        // Redirect to discontinued students page
        setTimeout(() => {
            navigateTo('/discontinued');
        }, 1500);
    } catch (error) {
        handleAPIError(error);
    }
}

// Export helper functions
window.disconnectStudentConfirm = disconnectStudentConfirm;
window.verifyMathAndShowReasonForm = verifyMathAndShowReasonForm;
window.showDisconnectReasonForm = showDisconnectReasonForm;
window.disconnectStudent = disconnectStudent;

// Export to global scope
window.StudentDetailsPage = {
    render: renderStudentDetails
};

})();
