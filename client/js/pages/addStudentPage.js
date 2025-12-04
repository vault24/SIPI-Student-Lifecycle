// addStudentPage.js
// Add Student Page with Backend API Integration

(function() {
    'use strict';

async function renderAddStudent() {
    renderNavbar('Add New Student');
    
    const mainContent = document.getElementById('main-content');
    
    // Show loading while fetching departments
    showLoadingSkeleton('main-content', 'form');
    
    try {
        // Fetch departments from API
        const departments = await dataManager.getDepartments();
        
        mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <!-- Hero Section -->
            <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl animate-fade-in-up">
                <div class="flex items-start justify-between">
                    <div>
                        <h1 class="text-3xl font-bold mb-2">Add New Student</h1>
                        <p class="text-blue-100">Complete the form below to register a new student in the system</p>
                    </div>
                    <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <i data-lucide="user-plus" class="w-8 h-8 text-white"></i>
                    </div>
                </div>
            </div>
            
            <div class="glass-card p-8">
                <form id="add-student-form" class="space-y-8">
                    <!-- Personal Information -->
                    <div class="border-b border-white/10 pb-6">
                        <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <i data-lucide="user" class="w-5 h-5 text-white"></i>
                            </div>
                            Personal Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name (Bangla) <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="fullNameBangla" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="à¦ªà§‚à¦°à§à¦£ à¦¨à¦¾à¦®">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name (English) <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="fullNameEnglish" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter full name">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Father's Name <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="fatherName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter father's name">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Father's NID No <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="fatherNID" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter father's NID number">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Mother's Name <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="motherName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter mother's name">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Mother's NID No <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="motherNID" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter mother's NID number">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth <span class="text-red-500">*</span>
                                </label>
                                <input type="date" id="dateOfBirth" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Birth Certificate No <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="birthCertificateNo" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter birth certificate number">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    NID (Optional)
                                </label>
                                <input type="text" id="nidNumber" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter NID number">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Gender <span class="text-red-500">*</span>
                                </label>
                                <select id="gender" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Religion (Optional)
                                </label>
                                <input type="text" id="religion" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter religion">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Blood Group (Optional)
                                </label>
                                <select id="bloodGroup" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Marital Status (Optional)
                                </label>
                                <select id="maritalStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Contact & Address -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="map-pin" class="w-5 h-5 text-blue-600"></i>
                            Contact & Address
                        </h3>
                        
                        <!-- Present Address -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-3">
                                Present Address <span class="text-red-500">*</span>
                            </label>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Division <span class="text-red-500">*</span></label>
                                    <input type="text" id="presentDivision" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., Dhaka">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">District <span class="text-red-500">*</span></label>
                                    <input type="text" id="presentDistrict" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., Dhaka">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Sub-district <span class="text-red-500">*</span></label>
                                    <input type="text" id="presentSubDistrict" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., Mirpur">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Police Station <span class="text-red-500">*</span></label>
                                    <input type="text" id="presentPoliceStation" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., Mirpur">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Post Office <span class="text-red-500">*</span></label>
                                    <input type="text" id="presentPostOffice" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., Mirpur-10">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Municipality/Union/City Corporation <span class="text-red-500">*</span></label>
                                    <input type="text" id="presentMunicipality" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="Enter area type">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Village/Neighborhood <span class="text-red-500">*</span></label>
                                    <input type="text" id="presentVillage" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="Enter village/area">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Ward Number <span class="text-red-500">*</span></label>
                                    <input type="text" id="presentWard" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., 01">
                                </div>
                            </div>
                        </div>

                        <!-- Permanent Address -->
                        <div class="mb-4">
                            <div class="flex items-center gap-3 mb-3">
                                <label class="block text-sm font-medium text-gray-700">
                                    Permanent Address <span class="text-red-500">*</span>
                                </label>
                                <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" id="sameAsPresent" onchange="copyPresentToPermanent()" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                                    <span>Same as Present Address</span>
                                </label>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Division <span class="text-red-500">*</span></label>
                                    <input type="text" id="permanentDivision" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., Dhaka">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">District <span class="text-red-500">*</span></label>
                                    <input type="text" id="permanentDistrict" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., Dhaka">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Sub-district <span class="text-red-500">*</span></label>
                                    <input type="text" id="permanentSubDistrict" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., Mirpur">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Police Station <span class="text-red-500">*</span></label>
                                    <input type="text" id="permanentPoliceStation" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., Mirpur">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Post Office <span class="text-red-500">*</span></label>
                                    <input type="text" id="permanentPostOffice" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., Mirpur-10">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Municipality/Union/City Corporation <span class="text-red-500">*</span></label>
                                    <input type="text" id="permanentMunicipality" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="Enter area type">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Village/Neighborhood <span class="text-red-500">*</span></label>
                                    <input type="text" id="permanentVillage" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="Enter village/area">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Ward Number <span class="text-red-500">*</span></label>
                                    <input type="text" id="permanentWard" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="e.g., 01">
                                </div>
                            </div>
                        </div>

                        <!-- Contact Information -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile No (Student) <span class="text-red-500">*</span>
                                </label>
                                <input type="tel" id="mobileStudent" required pattern="[0-9]{11}" maxlength="11" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="01XXXXXXXXX (11 digits)">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Guardian Mobile <span class="text-red-500">*</span>
                                </label>
                                <input type="tel" id="guardianMobile" required pattern="[0-9]{11}" maxlength="11" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="01XXXXXXXXX (11 digits)">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Email (Optional)
                                </label>
                                <input type="email" id="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter email address">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Emergency Contact Name & Number <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="emergencyContact" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Name: 01XXXXXXXXX">
                            </div>
                        </div>
                    </div>

                    <!-- Educational Background -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="graduation-cap" class="w-5 h-5 text-blue-600"></i>
                            Educational Background
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Highest Exam Passed <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="highestExam" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., SSC">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Board <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="board" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Dhaka">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Group <span class="text-red-500">*</span>
                                </label>
                                <select id="group" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Group</option>
                                    <option value="Science">Science</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Business Studies">Business Studies</option>
                                    <option value="Technical">Technical</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Roll No <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="rollNumber" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter roll number">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Registration No <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="registrationNumber" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter registration number">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Passing Year <span class="text-red-500">*</span>
                                </label>
                                <input type="number" id="passingYear" required min="2000" max="2099" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="YYYY">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    GPA <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="gpa" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., 5.00">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Institution Name (Optional)
                                </label>
                                <input type="text" id="institutionName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter institution name">
                            </div>
                        </div>
                        
                        <!-- Additional Qualifications -->
                        <div class="mt-4">
                            <div class="flex items-center justify-between mb-3">
                                <label class="block text-sm font-medium text-gray-700">
                                    Additional Qualifications (Optional)
                                </label>
                                <button type="button" onclick="addQualification()" class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                    Add More
                                </button>
                            </div>
                            <div id="additional-qualifications" class="space-y-3">
                                <!-- Additional qualifications will be added here -->
                            </div>
                        </div>
                    </div>

                    <!-- Current Academic Information -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="book-open" class="w-5 h-5 text-blue-600"></i>
                            Current Academic Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Roll Number <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="currentRollNumber" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Current roll number">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Registration Number <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="currentRegistrationNumber" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Current registration number">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Semester <span class="text-red-500">*</span>
                                </label>
                                <select id="semester" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Semester</option>
                                    ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}">Semester ${s}</option>`).join('')}
                                    <option value="alumni">Alumni (Graduated)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Department <span class="text-red-500">*</span>
                                </label>
                                <select id="department" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Department</option>
                                    ${departments.map(dept => `<option value="${dept.id}">${dept.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Session <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="session" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., 2023-2024">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Shift <span class="text-red-500">*</span>
                                </label>
                                <select id="shift" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Shift</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Day">Day</option>
                                    <option value="Evening">Evening</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Group <span class="text-red-500">*</span>
                                </label>
                                <select id="currentGroup" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Group</option>
                                    <option value="A">Group A</option>
                                    <option value="B">Group B</option>
                                    <option value="C">Group C</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Documents -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="file-text" class="w-5 h-5 text-blue-600"></i>
                            Documents Upload
                        </h3>
                        <p class="text-sm text-gray-600 mb-4">Upload documents (Image/PDF, max 1MB each)</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Passport-size Photo <span class="text-red-500">*</span>
                                </label>
                                <input type="file" id="passportPhoto" required accept="image/*" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    SSC Marksheet <span class="text-red-500">*</span>
                                </label>
                                <input type="file" id="sscMarksheet" required accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    SSC Certificate <span class="text-red-500">*</span>
                                </label>
                                <input type="file" id="sscCertificate" required accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Birth Certificate <span class="text-red-500">*</span>
                                </label>
                                <input type="file" id="birthCertificateDoc" required accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Student NID Copy (Optional)
                                </label>
                                <input type="file" id="nidCopy" accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Father's NID (Front) <span class="text-red-500">*</span>
                                </label>
                                <input type="file" id="fatherNIDFront" required accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Father's NID (Back) <span class="text-red-500">*</span>
                                </label>
                                <input type="file" id="fatherNIDBack" required accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Mother's NID (Front) <span class="text-red-500">*</span>
                                </label>
                                <input type="file" id="motherNIDFront" required accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Mother's NID (Back) <span class="text-red-500">*</span>
                                </label>
                                <input type="file" id="motherNIDBack" required accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Testimonial (Optional)
                                </label>
                                <input type="file" id="testimonial" accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Medical Certificate (Optional)
                                </label>
                                <input type="file" id="medicalCertificate" accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Quota Document (Optional)
                                </label>
                                <input type="file" id="quotaDocument" accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Extra Certificates (Optional)
                                </label>
                                <input type="file" id="extraCertificates" multiple accept="image/*,.pdf" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex gap-4 justify-end pt-4 border-t border-gray-200">
                        <button type="button" onclick="navigateTo('/students')" class="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" class="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
                            <i data-lucide="save" class="w-5 h-5"></i>
                            Save Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
        lucide.createIcons();
        
        // Handle form submission
        document.getElementById('add-student-form').addEventListener('submit', handleAddStudent);
        
    } catch (error) {
        handleAPIError(error);
        renderErrorState();
    }
}

function renderErrorState() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm p-12 text-center">
                <i data-lucide="alert-circle" class="w-16 h-16 mx-auto mb-4 text-red-500"></i>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Unable to Load Form</h2>
                <p class="text-gray-600 mb-6">There was an error loading the student form.</p>
                <button onclick="AddStudentPage.render()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                    <i data-lucide="refresh-cw" class="w-5 h-5 inline mr-2"></i>
                    Retry
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// Helper function to convert date format from DD-MM-YYYY or other formats to YYYY-MM-DD
function convertDateToISO(dateString) {
    if (!dateString) return '';
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }
    
    // Try to parse DD-MM-YYYY format
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        const parts = dateString.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    // Try to parse DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const parts = dateString.split('/');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    // If it's a Date object or other format, try to convert
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
    } catch (e) {
        // Fall through
    }
    
    return dateString;
}

async function handleAddStudent(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Validate file sizes
    const fileInputs = ['passportPhoto', 'sscMarksheet', 'sscCertificate', 'birthCertificateDoc', 'nidCopy', 'fatherNIDFront', 'fatherNIDBack', 'motherNIDFront', 'motherNIDBack', 'testimonial', 'medicalCertificate', 'quotaDocument'];
    for (const inputId of fileInputs) {
        const file = document.getElementById(inputId)?.files[0];
        if (file && file.size > 1024 * 1024) { // 1MB
            showErrorToast(`${inputId} must be less than 1MB`);
            return;
        }
    }
    
    // Collect additional qualifications
    const additionalQualifications = [];
    document.querySelectorAll('.qualification-item').forEach(item => {
        const exam = item.querySelector('[name="qual-exam"]')?.value;
        const board = item.querySelector('[name="qual-board"]')?.value;
        const year = item.querySelector('[name="qual-year"]')?.value;
        const gpa = item.querySelector('[name="qual-gpa"]')?.value;
        if (exam && board && year && gpa) {
            additionalQualifications.push({ exam, board, year, gpa });
        }
    });
    
    const formData = {
        // Personal Information
        fullNameBangla: document.getElementById('fullNameBangla').value,
        fullNameEnglish: document.getElementById('fullNameEnglish').value,
        fullName: document.getElementById('fullNameEnglish').value, // For compatibility
        fatherName: document.getElementById('fatherName').value,
        fatherNID: document.getElementById('fatherNID').value,
        motherName: document.getElementById('motherName').value,
        motherNID: document.getElementById('motherNID').value,
        dateOfBirth: convertDateToISO(document.getElementById('dateOfBirth').value),
        birthCertificateNo: document.getElementById('birthCertificateNo').value,
        nidNumber: document.getElementById('nidNumber').value || '',
        gender: document.getElementById('gender').value,
        religion: document.getElementById('religion').value || '',
        bloodGroup: document.getElementById('bloodGroup').value || '',
        maritalStatus: document.getElementById('maritalStatus').value || '',
        
        // Contact & Address
        presentAddress: {
            division: document.getElementById('presentDivision').value,
            district: document.getElementById('presentDistrict').value,
            subDistrict: document.getElementById('presentSubDistrict').value,
            policeStation: document.getElementById('presentPoliceStation').value,
            postOffice: document.getElementById('presentPostOffice').value,
            municipality: document.getElementById('presentMunicipality').value,
            village: document.getElementById('presentVillage').value,
            ward: document.getElementById('presentWard').value
        },
        permanentAddress: {
            division: document.getElementById('permanentDivision').value,
            district: document.getElementById('permanentDistrict').value,
            subDistrict: document.getElementById('permanentSubDistrict').value,
            policeStation: document.getElementById('permanentPoliceStation').value,
            postOffice: document.getElementById('permanentPostOffice').value,
            municipality: document.getElementById('permanentMunicipality').value,
            village: document.getElementById('permanentVillage').value,
            ward: document.getElementById('permanentWard').value
        },
        address: `${document.getElementById('presentVillage').value}, ${document.getElementById('presentSubDistrict').value}, ${document.getElementById('presentDistrict').value}`, // For compatibility
        mobileStudent: document.getElementById('mobileStudent').value,
        phone: document.getElementById('mobileStudent').value, // For compatibility
        guardianMobile: document.getElementById('guardianMobile').value,
        email: document.getElementById('email').value || '',
        emergencyContact: document.getElementById('emergencyContact').value,
        
        // Educational Background
        highestExam: document.getElementById('highestExam').value,
        board: document.getElementById('board').value,
        group: document.getElementById('group').value,
        rollNumber: document.getElementById('rollNumber').value,
        registrationNumber: document.getElementById('registrationNumber').value,
        passingYear: parseInt(document.getElementById('passingYear').value),
        gpa: document.getElementById('gpa').value,
        institutionName: document.getElementById('institutionName').value || '',
        additionalQualifications: additionalQualifications,
        
        // Current Academic
        currentRollNumber: document.getElementById('currentRollNumber').value,
        currentRegistrationNumber: document.getElementById('currentRegistrationNumber').value,
        semester: parseInt(document.getElementById('semester').value),
        department: document.getElementById('department').value,
        session: document.getElementById('session').value,
        shift: document.getElementById('shift').value,
        currentGroup: document.getElementById('currentGroup').value,
        
        // System fields
        status: 'active',
        enrollmentDate: new Date().toISOString().split('T')[0],
        profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(document.getElementById('fullNameEnglish').value)}&background=random`
    };
    
    // Save student with backend API
    try {
        // Set button loading state
        setButtonLoading(submitButton, true, 'Saving...');
        
        // Create student via API
        const result = await dataManager.addStudent(formData);
        
        // Handle photo upload separately if provided
        const photoFile = document.getElementById('passportPhoto').files[0];
        if (photoFile && result.id) {
            try {
                await dataManager.uploadStudentPhoto(result.id, photoFile);
            } catch (photoError) {
                console.error('Photo upload failed:', photoError);
                // Don't fail the whole operation if photo upload fails
            }
        }
        
        // Show success message
        showSuccessToast('Student added successfully!');
        
        // Redirect to student list
        setTimeout(() => navigateTo('/students'), 1000);
        
    } catch (error) {
        setButtonLoading(submitButton, false);
        handleAPIError(error);
    }
}

// Copy present address to permanent address
function copyPresentToPermanent() {
    const checkbox = document.getElementById('sameAsPresent');
    if (checkbox.checked) {
        document.getElementById('permanentDivision').value = document.getElementById('presentDivision').value;
        document.getElementById('permanentDistrict').value = document.getElementById('presentDistrict').value;
        document.getElementById('permanentSubDistrict').value = document.getElementById('presentSubDistrict').value;
        document.getElementById('permanentPoliceStation').value = document.getElementById('presentPoliceStation').value;
        document.getElementById('permanentPostOffice').value = document.getElementById('presentPostOffice').value;
        document.getElementById('permanentMunicipality').value = document.getElementById('presentMunicipality').value;
        document.getElementById('permanentVillage').value = document.getElementById('presentVillage').value;
        document.getElementById('permanentWard').value = document.getElementById('presentWard').value;
    } else {
        document.getElementById('permanentDivision').value = '';
        document.getElementById('permanentDistrict').value = '';
        document.getElementById('permanentSubDistrict').value = '';
        document.getElementById('permanentPoliceStation').value = '';
        document.getElementById('permanentPostOffice').value = '';
        document.getElementById('permanentMunicipality').value = '';
        document.getElementById('permanentVillage').value = '';
        document.getElementById('permanentWard').value = '';
    }
}

// Add qualification row
function addQualification() {
    const container = document.getElementById('additional-qualifications');
    const qualId = Date.now();
    const qualHtml = `
        <div class="qualification-item grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg">
            <input type="text" name="qual-exam" placeholder="Exam Name" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
            <input type="text" name="qual-board" placeholder="Board" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
            <input type="number" name="qual-year" placeholder="Year" min="2000" max="2099" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
            <input type="text" name="qual-gpa" placeholder="GPA" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
            <button type="button" onclick="this.closest('.qualification-item').remove()" class="text-red-600 hover:text-red-700 text-sm font-medium">
                Remove
            </button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', qualHtml);
}

// Export helper functions
window.addQualification = addQualification;
window.copyPresentToPermanent = copyPresentToPermanent;

// Export to global scope
window.AddStudentPage = {
    render: renderAddStudent
};

})();
