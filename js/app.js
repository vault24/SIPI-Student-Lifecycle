// Main Application Logic for SLMS

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mock data
    initializeMockData();
    
    // Render layout components
    renderSidebar();
    renderNavbar('Dashboard');
    
    // Register routes
    registerRoutes();
    
    // Initialize Lucide icons
    lucide.createIcons();
});

// Register all routes
function registerRoutes() {
    router.register('/', renderDashboard);
    router.register('/add-student', renderAddStudent);
    router.register('/students', renderStudentList);
    router.register('/student/:id', renderStudentDetails);
    router.register('/documents', renderDocuments);
    router.register('/marks', renderMarksAttendance);
    router.register('/alumni', renderAlumni);
    router.register('/apply', renderPublicApplicationForm);
    router.register('/applications', renderApplications);
    router.register('/application/:id', renderApplicationDetails);
    router.register('/login', renderLogin);
    router.register('/admin', renderAdminDashboard);
    router.register('/departments', renderDepartments);
    router.register('/department/:name', renderDepartmentView);
    router.register('/edit-student/:id', renderEditStudent);
    router.register('/alumni/:id', renderAlumniDetails);
    router.register('/edit-alumni/:id', renderEditAlumni);
}

// Dashboard Page
function renderDashboard() {
    renderNavbar('Dashboard');
    
    const students = dataManager.getStudents();
    const documents = dataManager.getDocuments();
    const alumni = dataManager.getAlumni();
    
    const activeStudents = students.filter(s => s.status === 'active').length;
    const totalStudents = students.length;
    const totalDocuments = documents.length;
    const totalAlumni = alumni.length;
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-6 text-white">
            <h1 class="text-4xl font-bold mb-3">SIPI Student Lifecycle Manager</h1>
            <p class="text-blue-100 text-lg">Comprehensive student information management from admission to graduation and beyond</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            ${createStatCard({ title: 'Total Students', value: totalStudents, icon: 'users', color: 'blue' })}
            ${createStatCard({ title: 'Active Students', value: activeStudents, icon: 'user-check', color: 'green' })}
            ${createStatCard({ title: 'Alumni', value: totalAlumni, icon: 'graduation-cap', color: 'purple' })}
            ${createStatCard({ title: 'Documents', value: totalDocuments, icon: 'file-text', color: 'indigo' })}
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button onclick="navigateTo('/add-student')" class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                    <i data-lucide="user-plus" class="w-5 h-5"></i>
                    <span>Add New Student</span>
                </button>
                <button onclick="navigateTo('/students')" class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors">
                    <i data-lucide="users" class="w-5 h-5"></i>
                    <span>View All Students</span>
                </button>
                <button onclick="navigateTo('/departments')" class="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                    <i data-lucide="building-2" class="w-5 h-5"></i>
                    <span>View Departments</span>
                </button>
                <button onclick="navigateTo('/documents')" class="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                    <i data-lucide="file-text" class="w-5 h-5"></i>
                    <span>Manage Documents</span>
                </button>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
            <div class="space-y-3">
                ${renderRecentActivity()}
            </div>
        </div>
    `;
    
    lucide.createIcons();
}

// Render recent activity
function renderRecentActivity() {
    const students = dataManager.getStudents().slice(0, 5);
    
    return students.map(student => `
        <div class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <img src="${student.profilePhoto}" alt="${student.fullName}" class="w-10 h-10 rounded-full">
            <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">${student.fullName}</p>
                <p class="text-xs text-gray-500">Added ${formatDate(student.createdAt, 'relative')}</p>
            </div>
            <span class="badge badge-${student.status === 'active' ? 'success' : student.status === 'graduated' ? 'info' : 'warning'}">
                ${student.status}
            </span>
        </div>
    `).join('');
}

// Logout function
function logout() {
    dataManager.logout();
    showToast('Logged out successfully', 'success');
}

// Make functions globally available
window.renderDashboard = renderDashboard;
window.logout = logout;


// Add Student Page
function renderAddStudent() {
    renderNavbar('Add New Student');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Add New Student</h2>
                
                <form id="add-student-form" class="space-y-8">
                    <!-- Personal Information -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="user" class="w-5 h-5 text-blue-600"></i>
                            Personal Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name (Bangla) <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="fullNameBangla" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="পূর্ণ নাম">
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
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Department <span class="text-red-500">*</span>
                                </label>
                                <select id="department" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Department</option>
                                    ${dataManager.getDepartments().map(dept => `<option value="${dept.name}">${dept.name}</option>`).join('')}
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
}

function handleAddStudent(e) {
    e.preventDefault();
    
    // Validate file sizes
    const fileInputs = ['passportPhoto', 'sscMarksheet', 'sscCertificate', 'birthCertificateDoc', 'nidCopy', 'fatherNIDFront', 'fatherNIDBack', 'motherNIDFront', 'motherNIDBack', 'testimonial', 'medicalCertificate', 'quotaDocument'];
    for (const inputId of fileInputs) {
        const file = document.getElementById(inputId)?.files[0];
        if (file && file.size > 1024 * 1024) { // 1MB
            showToast(`${inputId} must be less than 1MB`, 'error');
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
        dateOfBirth: document.getElementById('dateOfBirth').value,
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
        enrollmentDate: new Date().toISOString(),
        profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(document.getElementById('fullNameEnglish').value)}&background=random`
    };
    
    // Handle passport photo if uploaded
    const photoFile = document.getElementById('passportPhoto').files[0];
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            formData.profilePhoto = e.target.result;
            saveStudent(formData);
        };
        reader.readAsDataURL(photoFile);
    } else {
        saveStudent(formData);
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

function saveStudent(formData) {
    if (dataManager.addStudent(formData)) {
        showToast('Student added successfully!', 'success');
        setTimeout(() => navigateTo('/students'), 1000);
    } else {
        showToast('Failed to add student', 'error');
    }
}

window.renderAddStudent = renderAddStudent;
window.addQualification = addQualification;
window.copyPresentToPermanent = copyPresentToPermanent;


// Student List Page
function renderStudentList() {
    renderNavbar('Student List');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 class="text-2xl font-bold text-gray-900">All Students</h2>
                <button onclick="navigateTo('/add-student')" class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i data-lucide="user-plus" class="w-5 h-5"></i>
                    <span>Add Student</span>
                </button>
            </div>

            <!-- Search and Filters -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="md:col-span-2">
                    <div class="relative">
                        <i data-lucide="search" class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input type="text" id="search-students" placeholder="Search by name, roll, or semester..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                </div>
                <div>
                    <select id="filter-semester" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">All Semesters</option>
                        ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}">Semester ${s}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <select id="filter-status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="graduated">Graduated</option>
                    </select>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="students-table-body" class="bg-white divide-y divide-gray-200">
                        <!-- Students will be rendered here -->
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div id="pagination" class="mt-6 flex items-center justify-between">
                <!-- Pagination will be rendered here -->
            </div>
        </div>
    `;
    
    lucide.createIcons();
    
    // Initialize student list
    updateStudentList();
    
    // Add event listeners
    document.getElementById('search-students').addEventListener('input', debounce(updateStudentList, 300));
    document.getElementById('filter-semester').addEventListener('change', updateStudentList);
    document.getElementById('filter-status').addEventListener('change', updateStudentList);
}

let currentPage = 1;
const pageSize = 10;

function updateStudentList() {
    let students = dataManager.getStudents();
    
    // Apply search filter
    const searchTerm = document.getElementById('search-students')?.value || '';
    if (searchTerm) {
        // Search using currentRollNumber instead of rollNumber
        students = students.filter(student => {
            const fullName = (student.fullName || '').toLowerCase();
            const currentRoll = (student.currentRollNumber || student.rollNumber || '').toLowerCase();
            const department = (student.department || '').toLowerCase();
            const semester = (student.semester || '').toString().toLowerCase();
            const search = searchTerm.toLowerCase();
            
            return fullName.includes(search) || 
                   currentRoll.includes(search) || 
                   department.includes(search) || 
                   semester.includes(search);
        });
    }
    
    // Apply semester filter
    const semesterFilter = document.getElementById('filter-semester')?.value || '';
    if (semesterFilter) {
        students = students.filter(s => s.semester === parseInt(semesterFilter));
    }
    
    // Apply status filter
    const statusFilter = document.getElementById('filter-status')?.value || '';
    if (statusFilter) {
        students = students.filter(s => s.status === statusFilter);
    }
    
    // Paginate
    const paginatedData = utils.paginate(students, currentPage, pageSize);
    
    // Render table
    const tbody = document.getElementById('students-table-body');
    if (paginatedData.data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <i data-lucide="users" class="w-12 h-12 mx-auto mb-3 text-gray-400"></i>
                    <p>No students found</p>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = paginatedData.data.map(student => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img src="${student.profilePhoto}" alt="${student.fullName}" class="w-10 h-10 rounded-full">
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${student.fullName}</div>
                            <div class="text-sm text-gray-500">${student.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${student.currentRollNumber || student.rollNumber}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Semester ${student.semester}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.department}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge badge-${student.status === 'active' ? 'success' : student.status === 'graduated' ? 'info' : 'warning'}">
                        ${student.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="navigateTo('/student/${student.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                        <i data-lucide="eye" class="w-4 h-4 inline"></i> View
                    </button>
                    <button onclick="deleteStudentConfirm('${student.id}')" class="text-red-600 hover:text-red-900">
                        <i data-lucide="trash-2" class="w-4 h-4 inline"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // Render pagination
    renderPagination(paginatedData);
    
    lucide.createIcons();
}

function renderPagination(paginatedData) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const { page, totalPages, total } = paginatedData;
    
    pagination.innerHTML = `
        <div class="text-sm text-gray-700">
            Showing <span class="font-medium">${(page - 1) * pageSize + 1}</span> to 
            <span class="font-medium">${Math.min(page * pageSize, total)}</span> of 
            <span class="font-medium">${total}</span> results
        </div>
        <div class="flex gap-2">
            <button onclick="changePage(${page - 1})" ${page === 1 ? 'disabled' : ''} 
                class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
            </button>
            ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return `
                    <button onclick="changePage(${pageNum})" 
                        class="px-3 py-1 border ${pageNum === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'} rounded-lg">
                        ${pageNum}
                    </button>
                `;
            }).join('')}
            <button onclick="changePage(${page + 1})" ${page === totalPages ? 'disabled' : ''} 
                class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
            </button>
        </div>
    `;
}

function changePage(page) {
    currentPage = page;
    updateStudentList();
}

function deleteStudentConfirm(id) {
    const student = dataManager.getStudent(id);
    
    // Generate random math problem
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = [
        { symbol: '+', calc: (a, b) => a + b, name: 'add' },
        { symbol: '-', calc: (a, b) => a - b, name: 'subtract' },
        { symbol: '×', calc: (a, b) => a * b, name: 'multiply' }
    ];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const correctAnswer = operation.calc(num1, num2);
    
    const modalId = generateUUID();
    const container = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = `modal-${modalId}`;
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 fade-in">
            <div class="flex items-start gap-4 mb-4">
                <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <i data-lucide="alert-triangle" class="w-6 h-6 text-red-600"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">⚠️ Delete Student - Verification Required</h3>
                    <p class="text-gray-600 mb-4">You are about to permanently delete <strong>${student.fullName}</strong>. This action cannot be undone and will remove all associated data.</p>
                    
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p class="text-sm font-medium text-yellow-800 mb-3">To confirm deletion, please solve this math problem:</p>
                        <div class="text-center mb-3">
                            <span class="text-3xl font-bold text-gray-900">${num1} ${operation.symbol} ${num2} = ?</span>
                        </div>
                        <input type="number" id="delete-verification-${modalId}" 
                            class="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg font-semibold" 
                            placeholder="Enter answer" 
                            autofocus>
                        <p id="error-message-${modalId}" class="text-sm text-red-600 mt-2 hidden">Incorrect answer. Please try again.</p>
                    </div>
                </div>
            </div>
            <div class="flex gap-3 justify-end">
                <button onclick="closeModal('${modalId}')" class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    Cancel
                </button>
                <button onclick="verifyAndDelete('${modalId}', '${id}', ${correctAnswer})" class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-semibold">
                    Verify & Delete
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(modal);
    lucide.createIcons();
    
    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal(modalId);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    // Allow Enter key to submit
    document.getElementById(`delete-verification-${modalId}`).addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyAndDelete(modalId, id, correctAnswer);
        }
    });
}

function verifyAndDelete(modalId, studentId, correctAnswer) {
    const userAnswer = parseInt(document.getElementById(`delete-verification-${modalId}`).value);
    const errorMsg = document.getElementById(`error-message-${modalId}`);
    
    if (userAnswer === correctAnswer) {
        closeModal(modalId);
        if (dataManager.deleteStudent(studentId)) {
            showToast('Student deleted successfully', 'success');
            // Check if we're on student details page or list page
            if (window.location.hash.includes('/student/')) {
                navigateTo('/students');
            } else {
                updateStudentList();
            }
        } else {
            showToast('Failed to delete student', 'error');
        }
    } else {
        errorMsg.classList.remove('hidden');
        document.getElementById(`delete-verification-${modalId}`).value = '';
        document.getElementById(`delete-verification-${modalId}`).focus();
        document.getElementById(`delete-verification-${modalId}`).classList.add('border-red-500');
        setTimeout(() => {
            document.getElementById(`delete-verification-${modalId}`).classList.remove('border-red-500');
        }, 500);
    }
}

window.renderStudentList = renderStudentList;
window.changePage = changePage;
window.deleteStudentConfirm = deleteStudentConfirm;


// Student Details Page
function renderStudentDetails(params) {
    const student = dataManager.getStudent(params.id);
    
    if (!student) {
        showToast('Student not found', 'error');
        navigateTo('/students');
        return;
    }
    
    renderNavbar('Student Details');
    
    const documents = dataManager.getDocuments(student.id);
    const marks = dataManager.getMarks(student.id);
    const attendance = dataManager.getAttendance(student.id);
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-6">
                <button onclick="navigateTo('/students')" class="text-gray-600 hover:text-gray-900">
                    <i data-lucide="arrow-left" class="w-6 h-6"></i>
                </button>
                <h2 class="text-2xl font-bold text-gray-900">Student Details</h2>
            </div>

            <!-- Profile Section -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div class="flex flex-col md:flex-row gap-6">
                    <img src="${student.profilePhoto}" alt="${student.fullName}" class="w-32 h-32 rounded-full">
                    <div class="flex-1">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">${student.fullName}</h3>
                        <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <span class="flex items-center gap-1">
                                <i data-lucide="hash" class="w-4 h-4"></i>
                                ${student.currentRollNumber || student.rollNumber}
                            </span>
                            <span class="flex items-center gap-1">
                                <i data-lucide="book-open" class="w-4 h-4"></i>
                                Semester ${student.semester}
                            </span>
                            <span class="flex items-center gap-1">
                                <i data-lucide="building" class="w-4 h-4"></i>
                                ${student.department}
                            </span>
                        </div>
                        <span class="badge badge-${student.status === 'active' ? 'success' : student.status === 'graduated' ? 'info' : 'warning'}">
                            ${student.status}
                        </span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <button onclick="showDownloadOptions('${student.id}')" class="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i data-lucide="download" class="w-4 h-4"></i>
                            Download
                        </button>
                        <button onclick="editStudent('${student.id}')" class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i data-lucide="edit" class="w-4 h-4"></i>
                            Edit
                        </button>
                        <button onclick="deleteStudentConfirm('${student.id}')" class="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <!-- Information Sections -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Personal Info -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button onclick="toggleSection('personal-info')" class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div class="flex items-center gap-2">
                            <i data-lucide="user" class="w-5 h-5 text-blue-600"></i>
                            <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
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
                            <dd class="text-sm text-gray-900">${student.fullNameEnglish || student.fullName}</dd>
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
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button onclick="toggleSection('contact-info')" class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div class="flex items-center gap-2">
                            <i data-lucide="phone" class="w-5 h-5 text-blue-600"></i>
                            <h3 class="text-lg font-semibold text-gray-900">Contact Information</h3>
                        </div>
                        <i data-lucide="chevron-down" id="contact-info-icon" class="w-5 h-5 text-gray-400 transition-transform"></i>
                    </button>
                    <div id="contact-info" class="px-6 pb-6">
                        <dl class="space-y-3">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Mobile (Student)</dt>
                            <dd class="text-sm text-gray-900">${student.mobileStudent || student.phone}</dd>
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
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button onclick="toggleSection('present-address')" class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div class="flex items-center gap-2">
                            <i data-lucide="map-pin" class="w-5 h-5 text-blue-600"></i>
                            <h3 class="text-lg font-semibold text-gray-900">Present Address</h3>
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
                            <dd class="text-sm text-gray-900">${student.currentRollNumber || student.rollNumber}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Registration Number</dt>
                            <dd class="text-sm text-gray-900">${student.currentRegistrationNumber || student.registrationNumber}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Current Semester</dt>
                            <dd class="text-sm text-gray-900">Semester ${student.semester}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Department</dt>
                            <dd class="text-sm text-gray-900">${student.department}</dd>
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
                ${student.semesterResults && student.semesterResults.length > 0 ? `
                <div class="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i data-lucide="award" class="w-5 h-5 text-blue-600"></i>
                        Semester Results
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${student.semesterResults.map(result => `
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm font-medium text-gray-700">Semester ${result.semester}</span>
                                    <span class="text-xs text-gray-500">${result.cgpa ? 'CGPA: ' + result.cgpa : ''}</span>
                                </div>
                                <div class="text-2xl font-bold text-blue-600">GPA: ${result.gpa}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Semester Attendance -->
                ${student.semesterAttendance && student.semesterAttendance.length > 0 ? `
                <div class="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i data-lucide="calendar-check" class="w-5 h-5 text-green-600"></i>
                        Semester Attendance
                    </h3>
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
                </div>
                ` : ''}

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
                            <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                <div class="flex items-center gap-2">
                                    <i data-lucide="file" class="w-4 h-4 text-gray-400"></i>
                                    <span class="text-sm text-gray-900">${doc.fileName}</span>
                                </div>
                                <span class="text-xs text-gray-500">${doc.category}</span>
                            </div>
                        `).join('') : '<p class="text-sm text-gray-500">No documents uploaded</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    lucide.createIcons();
}

function editStudent(id) {
    navigateTo(`/edit-student/${id}`);
}

// Edit Student Page
function renderEditStudent(params) {
    const student = dataManager.getStudent(params.id);
    
    if (!student) {
        showToast('Student not found', 'error');
        navigateTo('/students');
        return;
    }
    
    renderNavbar('Edit Student');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center gap-4 mb-6">
                    <button onclick="navigateTo('/student/${student.id}')" class="text-gray-600 hover:text-gray-900">
                        <i data-lucide="arrow-left" class="w-6 h-6"></i>
                    </button>
                    <h2 class="text-2xl font-bold text-gray-900">Edit Student Information</h2>
                </div>
                
                <form id="edit-student-form" class="space-y-8">
                    <!-- Personal Information -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="user" class="w-5 h-5 text-blue-600"></i>
                            Personal Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name (Bangla) <span class="text-red-500">*</span></label>
                                <input type="text" id="fullNameBangla" value="${student.fullNameBangla || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name (English) <span class="text-red-500">*</span></label>
                                <input type="text" id="fullNameEnglish" value="${student.fullNameEnglish || student.fullName}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Father's Name <span class="text-red-500">*</span></label>
                                <input type="text" id="fatherName" value="${student.fatherName || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Father's NID No <span class="text-red-500">*</span></label>
                                <input type="text" id="fatherNID" value="${student.fatherNID || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Mother's Name <span class="text-red-500">*</span></label>
                                <input type="text" id="motherName" value="${student.motherName || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Mother's NID No <span class="text-red-500">*</span></label>
                                <input type="text" id="motherNID" value="${student.motherNID || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth <span class="text-red-500">*</span></label>
                                <input type="date" id="dateOfBirth" value="${student.dateOfBirth}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Birth Certificate No <span class="text-red-500">*</span></label>
                                <input type="text" id="birthCertificateNo" value="${student.birthCertificateNo || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">NID (Optional)</label>
                                <input type="text" id="nidNumber" value="${student.nidNumber || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Gender <span class="text-red-500">*</span></label>
                                <select id="gender" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Gender</option>
                                    <option value="Male" ${student.gender === 'Male' ? 'selected' : ''}>Male</option>
                                    <option value="Female" ${student.gender === 'Female' ? 'selected' : ''}>Female</option>
                                    <option value="Other" ${student.gender === 'Other' ? 'selected' : ''}>Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Religion (Optional)</label>
                                <input type="text" id="religion" value="${student.religion || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Blood Group (Optional)</label>
                                <select id="bloodGroup" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Blood Group</option>
                                    ${['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => `<option value="${bg}" ${student.bloodGroup === bg ? 'selected' : ''}>${bg}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Marital Status (Optional)</label>
                                <select id="maritalStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Status</option>
                                    ${['Single', 'Married', 'Divorced', 'Widowed'].map(ms => `<option value="${ms}" ${student.maritalStatus === ms ? 'selected' : ''}>${ms}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="phone" class="w-5 h-5 text-blue-600"></i>
                            Contact Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Mobile No (Student) <span class="text-red-500">*</span></label>
                                <input type="tel" id="mobileStudent" value="${student.mobileStudent || student.phone}" required pattern="[0-9]{11}" maxlength="11" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Guardian Mobile <span class="text-red-500">*</span></label>
                                <input type="tel" id="guardianMobile" value="${student.guardianMobile || ''}" required pattern="[0-9]{11}" maxlength="11" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                                <input type="email" id="email" value="${student.email || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact <span class="text-red-500">*</span></label>
                                <input type="text" id="emergencyContact" value="${student.emergencyContact || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                        </div>
                    </div>

                    <!-- Current Academic -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="book-open" class="w-5 h-5 text-blue-600"></i>
                            Current Academic Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Roll Number <span class="text-red-500">*</span></label>
                                <input type="text" id="currentRollNumber" value="${student.currentRollNumber || student.rollNumber}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Registration Number <span class="text-red-500">*</span></label>
                                <input type="text" id="currentRegistrationNumber" value="${student.currentRegistrationNumber || student.registrationNumber}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Current Semester <span class="text-red-500">*</span></label>
                                <select id="semester" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${student.semester === s ? 'selected' : ''}>Semester ${s}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Department <span class="text-red-500">*</span></label>
                                <select id="department" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    ${dataManager.getDepartments().map(dept => `<option value="${dept.name}" ${student.department === dept.name ? 'selected' : ''}>${dept.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Session <span class="text-red-500">*</span></label>
                                <input type="text" id="session" value="${student.session || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., 2023-2024">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Shift <span class="text-red-500">*</span></label>
                                <select id="shift" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Shift</option>
                                    <option value="Morning" ${student.shift === 'Morning' ? 'selected' : ''}>Morning</option>
                                    <option value="Day" ${student.shift === 'Day' ? 'selected' : ''}>Day</option>
                                    <option value="Evening" ${student.shift === 'Evening' ? 'selected' : ''}>Evening</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Group <span class="text-red-500">*</span></label>
                                <select id="currentGroup" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Group</option>
                                    <option value="A" ${student.currentGroup === 'A' ? 'selected' : ''}>Group A</option>
                                    <option value="B" ${student.currentGroup === 'B' ? 'selected' : ''}>Group B</option>
                                    <option value="C" ${student.currentGroup === 'C' ? 'selected' : ''}>Group C</option>
                                    <option value="General" ${student.currentGroup === 'General' ? 'selected' : ''}>General</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status <span class="text-red-500">*</span></label>
                                <select id="status" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="active" ${student.status === 'active' ? 'selected' : ''}>Active</option>
                                    <option value="inactive" ${student.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                    <option value="graduated" ${student.status === 'graduated' ? 'selected' : ''}>Graduated</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Semester Results -->
                    <div class="border-b border-gray-200 pb-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <i data-lucide="award" class="w-5 h-5 text-blue-600"></i>
                                Semester Results
                            </h3>
                            <button type="button" onclick="addSemesterResult()" class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                Add Semester Result
                            </button>
                        </div>
                        <div id="semester-results" class="space-y-3">
                            ${(student.semesterResults || []).map((result, index) => `
                                <div class="semester-result-item grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-lg">
                                    <input type="number" name="result-semester" value="${result.semester}" placeholder="Semester" min="1" max="8" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                    <input type="text" name="result-gpa" value="${result.gpa}" placeholder="GPA (e.g., 3.75)" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                    <input type="text" name="result-cgpa" value="${result.cgpa}" placeholder="CGPA (e.g., 3.80)" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                    <button type="button" onclick="this.closest('.semester-result-item').remove()" class="text-red-600 hover:text-red-700 text-sm font-medium">
                                        Remove
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Semester Attendance -->
                    <div class="border-b border-gray-200 pb-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <i data-lucide="calendar-check" class="w-5 h-5 text-green-600"></i>
                                Semester Attendance
                            </h3>
                            <button type="button" onclick="addSemesterAttendance()" class="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
                                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                Add Semester Attendance
                            </button>
                        </div>
                        <div id="semester-attendance" class="space-y-4">
                            ${(student.semesterAttendance || []).map((attendance, index) => `
                                <div class="semester-attendance-item border border-gray-200 rounded-lg p-4">
                                    <div class="flex items-center justify-between mb-3">
                                        <input type="number" name="attendance-semester" value="${attendance.semester}" placeholder="Semester" min="1" max="8" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm w-32">
                                        <button type="button" onclick="this.closest('.semester-attendance-item').remove()" class="text-red-600 hover:text-red-700 text-sm font-medium">
                                            Remove Semester
                                        </button>
                                    </div>
                                    <div class="space-y-2 attendance-subjects-container">
                                        ${attendance.subjects.map((subject, subIndex) => `
                                            <div class="attendance-subject-item grid grid-cols-1 md:grid-cols-4 gap-2 p-2 bg-gray-50 rounded">
                                                <input type="text" name="subject-name" value="${subject.name}" placeholder="Subject Name" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                                                <input type="number" name="subject-present" value="${subject.present}" placeholder="Present" min="0" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                                                <input type="number" name="subject-total" value="${subject.total}" placeholder="Total Classes" min="1" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                                                <button type="button" onclick="this.closest('.attendance-subject-item').remove()" class="text-red-600 hover:text-red-700 text-xs font-medium">
                                                    Remove
                                                </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <button type="button" onclick="addSubjectToAttendance(this)" class="mt-2 text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
                                        <i data-lucide="plus" class="w-3 h-3"></i>
                                        Add Subject
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex gap-4 justify-end pt-4">
                        <button type="button" onclick="navigateTo('/student/${student.id}')" class="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" class="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
                            <i data-lucide="save" class="w-5 h-5"></i>
                            Update Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    lucide.createIcons();
    
    // Handle form submission
    document.getElementById('edit-student-form').addEventListener('submit', (e) => handleEditStudent(e, student.id));
}

// Add semester result function
function addSemesterResult() {
    const container = document.getElementById('semester-results');
    const resultHtml = `
        <div class="semester-result-item grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-lg">
            <input type="number" name="result-semester" placeholder="Semester" min="1" max="8" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
            <input type="text" name="result-gpa" placeholder="GPA (e.g., 3.75)" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
            <input type="text" name="result-cgpa" placeholder="CGPA (e.g., 3.80)" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
            <button type="button" onclick="this.closest('.semester-result-item').remove()" class="text-red-600 hover:text-red-700 text-sm font-medium">
                Remove
            </button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', resultHtml);
}

// Add semester attendance function
function addSemesterAttendance() {
    const container = document.getElementById('semester-attendance');
    const attendanceHtml = `
        <div class="semester-attendance-item border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
                <input type="number" name="attendance-semester" placeholder="Semester" min="1" max="8" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm w-32">
                <button type="button" onclick="this.closest('.semester-attendance-item').remove()" class="text-red-600 hover:text-red-700 text-sm font-medium">
                    Remove Semester
                </button>
            </div>
            <div class="space-y-2 attendance-subjects-container">
                <div class="attendance-subject-item grid grid-cols-1 md:grid-cols-4 gap-2 p-2 bg-gray-50 rounded">
                    <input type="text" name="subject-name" placeholder="Subject Name" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                    <input type="number" name="subject-present" placeholder="Present" min="0" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                    <input type="number" name="subject-total" placeholder="Total Classes" min="1" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                    <button type="button" onclick="this.closest('.attendance-subject-item').remove()" class="text-red-600 hover:text-red-700 text-xs font-medium">
                        Remove
                    </button>
                </div>
            </div>
            <button type="button" onclick="addSubjectToAttendance(this)" class="mt-2 text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
                <i data-lucide="plus" class="w-3 h-3"></i>
                Add Subject
            </button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', attendanceHtml);
    lucide.createIcons();
}

// Add subject to attendance
function addSubjectToAttendance(button) {
    const container = button.previousElementSibling;
    const subjectHtml = `
        <div class="attendance-subject-item grid grid-cols-1 md:grid-cols-4 gap-2 p-2 bg-gray-50 rounded">
            <input type="text" name="subject-name" placeholder="Subject Name" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
            <input type="number" name="subject-present" placeholder="Present" min="0" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
            <input type="number" name="subject-total" placeholder="Total Classes" min="1" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
            <button type="button" onclick="this.closest('.attendance-subject-item').remove()" class="text-red-600 hover:text-red-700 text-xs font-medium">
                Remove
            </button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', subjectHtml);
}

function handleEditStudent(e, studentId) {
    e.preventDefault();
    
    // Get current student data
    const currentStudent = dataManager.getStudent(studentId);
    const currentSemester = currentStudent.semester;
    
    // Collect semester results
    const semesterResults = [];
    let highestCompletedSemester = 0;
    document.querySelectorAll('.semester-result-item').forEach(item => {
        const semester = item.querySelector('[name="result-semester"]')?.value;
        const gpa = item.querySelector('[name="result-gpa"]')?.value;
        const cgpa = item.querySelector('[name="result-cgpa"]')?.value;
        if (semester && gpa) {
            const semesterNum = parseInt(semester);
            semesterResults.push({ 
                semester: semesterNum, 
                gpa: parseFloat(gpa), 
                cgpa: cgpa ? parseFloat(cgpa) : null 
            });
            // Track highest completed semester
            if (semesterNum > highestCompletedSemester) {
                highestCompletedSemester = semesterNum;
            }
        }
    });
    
    // Collect semester attendance
    const semesterAttendance = [];
    document.querySelectorAll('.semester-attendance-item').forEach(item => {
        const semester = item.querySelector('[name="attendance-semester"]')?.value;
        if (semester) {
            const subjects = [];
            let totalPresent = 0;
            let totalClasses = 0;
            
            item.querySelectorAll('.attendance-subject-item').forEach(subjectItem => {
                const name = subjectItem.querySelector('[name="subject-name"]')?.value;
                const present = subjectItem.querySelector('[name="subject-present"]')?.value;
                const total = subjectItem.querySelector('[name="subject-total"]')?.value;
                
                if (name && present && total) {
                    const presentNum = parseInt(present);
                    const totalNum = parseInt(total);
                    const percentage = totalNum > 0 ? ((presentNum / totalNum) * 100).toFixed(2) : 0;
                    
                    subjects.push({
                        name: name,
                        present: presentNum,
                        total: totalNum,
                        percentage: parseFloat(percentage)
                    });
                    
                    totalPresent += presentNum;
                    totalClasses += totalNum;
                }
            });
            
            // Calculate average attendance
            const averageAttendance = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;
            
            if (subjects.length > 0) {
                semesterAttendance.push({
                    semester: parseInt(semester),
                    subjects: subjects,
                    averageAttendance: parseFloat(averageAttendance.toFixed(2))
                });
            }
        }
    });
    
    // Auto-increment semester if new result added for current semester
    let newSemester = parseInt(document.getElementById('semester').value);
    
    // Check if user added a result for the current semester
    const hasNewResultForCurrentSemester = semesterResults.some(result => result.semester === currentSemester);
    
    // Check if this is a new result (wasn't in the original data)
    const originalResults = currentStudent.semesterResults || [];
    const hadResultForCurrentSemester = originalResults.some(result => result.semester === currentSemester);
    
    // If user just added a result for current semester, increment to next semester
    if (hasNewResultForCurrentSemester && !hadResultForCurrentSemester && highestCompletedSemester === currentSemester) {
        newSemester = Math.min(currentSemester + 1, 8); // Max semester is 8
        showToast(`Semester auto-incremented to ${newSemester}`, 'info');
    }
    
    const updates = {
        fullNameBangla: document.getElementById('fullNameBangla').value,
        fullNameEnglish: document.getElementById('fullNameEnglish').value,
        fullName: document.getElementById('fullNameEnglish').value,
        fatherName: document.getElementById('fatherName').value,
        fatherNID: document.getElementById('fatherNID').value,
        motherName: document.getElementById('motherName').value,
        motherNID: document.getElementById('motherNID').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        birthCertificateNo: document.getElementById('birthCertificateNo').value,
        nidNumber: document.getElementById('nidNumber').value || '',
        gender: document.getElementById('gender').value,
        religion: document.getElementById('religion').value || '',
        bloodGroup: document.getElementById('bloodGroup').value || '',
        maritalStatus: document.getElementById('maritalStatus').value || '',
        mobileStudent: document.getElementById('mobileStudent').value,
        phone: document.getElementById('mobileStudent').value,
        guardianMobile: document.getElementById('guardianMobile').value,
        email: document.getElementById('email').value || '',
        emergencyContact: document.getElementById('emergencyContact').value,
        currentRollNumber: document.getElementById('currentRollNumber').value,
        currentRegistrationNumber: document.getElementById('currentRegistrationNumber').value,
        semester: newSemester,
        department: document.getElementById('department').value,
        session: document.getElementById('session').value,
        shift: document.getElementById('shift').value,
        currentGroup: document.getElementById('currentGroup').value,
        status: document.getElementById('status').value,
        semesterResults: semesterResults,
        semesterAttendance: semesterAttendance
    };
    
    if (dataManager.updateStudent(studentId, updates)) {
        if (newSemester !== currentSemester) {
            showToast(`Semester auto-incremented to ${newSemester}`, 'info');
        }
        showToast('Student updated successfully!', 'success');
        setTimeout(() => {
            // Navigate to student details which will re-render with fresh data
            window.location.hash = `/student/${studentId}`;
            window.location.reload();
        }, 1000);
    } else {
        showToast('Failed to update student', 'error');
    }
}

function uploadDocument(studentId) {
    showFormModal({
        title: 'Upload Document',
        fields: [
            { id: 'category', label: 'Document Category', type: 'select', required: true, options: [
                { value: 'NID', label: 'NID' },
                { value: 'Marksheet', label: 'Marksheet' },
                { value: 'Certificate', label: 'Certificate' },
                { value: 'Attendance Sheet', label: 'Attendance Sheet' },
                { value: 'Other', label: 'Other' }
            ]},
            { id: 'file', label: 'Select File', type: 'file', required: true, accept: '.pdf,.jpg,.jpeg,.png' }
        ],
        onSubmit: (formData) => {
            const document = {
                studentId: studentId,
                fileName: formData.file.name,
                fileType: formData.file.type,
                category: formData.category,
                fileSize: formData.file.size,
                fileUrl: '#'
            };
            
            if (dataManager.addDocument(document)) {
                showToast('Document uploaded successfully', 'success');
                renderStudentDetails({ id: studentId });
            } else {
                showToast('Failed to upload document', 'error');
            }
        }
    });
}

// Download Options Modal
function showDownloadOptions(studentId) {
    const student = dataManager.getStudent(studentId);
    const documents = dataManager.getDocuments(studentId);
    
    const modalId = generateUUID();
    const container = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = `modal-${modalId}`;
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 fade-in">
            <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="download" class="w-5 h-5 text-blue-600"></i>
                Download Student Data
            </h3>
            <p class="text-sm text-gray-600 mb-4">Select what you want to download for <strong>${student.fullName}</strong>:</p>
            
            <div class="space-y-2 mb-6">
                <button onclick="downloadStudentInfo('${studentId}')" class="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i data-lucide="user" class="w-5 h-5 text-blue-600"></i>
                        </div>
                        <div class="text-left">
                            <div class="font-medium text-gray-900">Student Information</div>
                            <div class="text-xs text-gray-500">Personal, contact, and academic details</div>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                </button>
                
                <button onclick="downloadDocumentsList('${studentId}')" class="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i data-lucide="file-text" class="w-5 h-5 text-purple-600"></i>
                        </div>
                        <div class="text-left">
                            <div class="font-medium text-gray-900">Documents List</div>
                            <div class="text-xs text-gray-500">${documents.length} documents metadata</div>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                </button>
                
                <button onclick="downloadTestimonial('${studentId}')" class="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <i data-lucide="award" class="w-5 h-5 text-green-600"></i>
                        </div>
                        <div class="text-left">
                            <div class="font-medium text-gray-900">Testimonial Data</div>
                            <div class="text-xs text-gray-500">Academic records and achievements</div>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                </button>
                
                <button onclick="downloadCompleteProfile('${studentId}')" class="w-full flex items-center justify-between p-4 border-2 border-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i data-lucide="package" class="w-5 h-5 text-white"></i>
                        </div>
                        <div class="text-left">
                            <div class="font-medium text-gray-900">Complete Profile</div>
                            <div class="text-xs text-gray-500">All data including documents</div>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                </button>
            </div>
            
            <button onclick="closeModal('${modalId}')" class="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
            </button>
        </div>
    `;
    
    container.appendChild(modal);
    lucide.createIcons();
}

// Download Functions
function downloadStudentInfo(studentId) {
    const student = dataManager.getStudent(studentId);
    const data = {
        'Personal Information': {
            'Full Name (Bangla)': student.fullNameBangla || 'N/A',
            'Full Name (English)': student.fullNameEnglish || student.fullName,
            'Father Name': student.fatherName || 'N/A',
            'Father NID': student.fatherNID || 'N/A',
            'Mother Name': student.motherName || 'N/A',
            'Mother NID': student.motherNID || 'N/A',
            'Date of Birth': student.dateOfBirth,
            'Birth Certificate No': student.birthCertificateNo || 'N/A',
            'NID': student.nidNumber || 'N/A',
            'Gender': student.gender || 'N/A',
            'Religion': student.religion || 'N/A',
            'Blood Group': student.bloodGroup || 'N/A',
            'Marital Status': student.maritalStatus || 'N/A'
        },
        'Contact Information': {
            'Mobile (Student)': student.mobileStudent || student.phone,
            'Guardian Mobile': student.guardianMobile || 'N/A',
            'Email': student.email || 'N/A',
            'Emergency Contact': student.emergencyContact || 'N/A'
        },
        'Current Academic': {
            'Roll Number': student.currentRollNumber || student.rollNumber,
            'Registration Number': student.currentRegistrationNumber || student.registrationNumber,
            'Semester': student.semester,
            'Department': student.department,
            'Session': student.session || 'N/A',
            'Shift': student.shift || 'N/A',
            'Group': student.currentGroup || 'N/A',
            'Status': student.status
        }
    };
    
    utils.downloadJSON(data, `Student_Info_${student.rollNumber}.json`);
    showToast('Student information downloaded', 'success');
    closeModal(document.querySelector('[id^="modal-"]')?.id.replace('modal-', ''));
}

function downloadDocumentsList(studentId) {
    const student = dataManager.getStudent(studentId);
    const documents = dataManager.getDocuments(studentId);
    
    const data = documents.map(doc => ({
        'File Name': doc.fileName,
        'Category': doc.category,
        'File Type': doc.fileType,
        'File Size': formatFileSize(doc.fileSize),
        'Upload Date': formatDate(doc.uploadDate, 'long')
    }));
    
    utils.downloadJSON(data, `Documents_List_${student.rollNumber}.json`);
    showToast('Documents list downloaded', 'success');
    closeModal(document.querySelector('[id^="modal-"]')?.id.replace('modal-', ''));
}

function downloadTestimonial(studentId) {
    const student = dataManager.getStudent(studentId);
    const marks = dataManager.getMarks(studentId);
    const attendance = dataManager.getAttendance(studentId);
    
    const data = {
        'Student Information': {
            'Name': student.fullName,
            'Roll Number': student.rollNumber,
            'Registration Number': student.registrationNumber,
            'Department': student.department,
            'Session': student.session || 'N/A',
            'Enrollment Date': formatDate(student.enrollmentDate, 'long')
        },
        'Academic Performance': {
            'Current Semester': student.semester,
            'Semester Results': student.semesterResults || [],
            'Overall Status': student.status
        },
        'Marks Records': marks.length,
        'Attendance Records': attendance.length
    };
    
    utils.downloadJSON(data, `Testimonial_${student.rollNumber}.json`);
    showToast('Testimonial data downloaded', 'success');
    closeModal(document.querySelector('[id^="modal-"]')?.id.replace('modal-', ''));
}

function downloadCompleteProfile(studentId) {
    const student = dataManager.getStudent(studentId);
    const documents = dataManager.getDocuments(studentId);
    const marks = dataManager.getMarks(studentId);
    const attendance = dataManager.getAttendance(studentId);
    
    const data = {
        student: student,
        documents: documents,
        marks: marks,
        attendance: attendance
    };
    
    utils.downloadJSON(data, `Complete_Profile_${student.rollNumber}.json`);
    showToast('Complete profile downloaded', 'success');
    closeModal(document.querySelector('[id^="modal-"]')?.id.replace('modal-', ''));
}

// Toggle collapsible section
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const icon = document.getElementById(`${sectionId}-icon`);
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        icon.style.transform = 'rotate(0deg)';
    } else {
        section.style.display = 'none';
        icon.style.transform = 'rotate(-90deg)';
    }
}

window.renderStudentDetails = renderStudentDetails;
window.renderEditStudent = renderEditStudent;
window.editStudent = editStudent;
window.toggleSection = toggleSection;
window.uploadDocument = uploadDocument;
window.addSemesterResult = addSemesterResult;
window.addSemesterAttendance = addSemesterAttendance;
window.addSubjectToAttendance = addSubjectToAttendance;
window.showDownloadOptions = showDownloadOptions;
window.downloadStudentInfo = downloadStudentInfo;
window.downloadDocumentsList = downloadDocumentsList;
window.downloadTestimonial = downloadTestimonial;
window.downloadCompleteProfile = downloadCompleteProfile;
window.verifyAndDelete = verifyAndDelete;


// Documents Page
function renderDocuments() {
    renderNavbar('Documents');
    
    const documents = dataManager.getDocuments();
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 class="text-2xl font-bold text-gray-900">All Documents</h2>
                <button onclick="uploadDocumentGeneral()" class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i data-lucide="upload" class="w-5 h-5"></i>
                    <span>Upload Document</span>
                </button>
            </div>

            <!-- Filter -->
            <div class="mb-6">
                <select id="filter-category" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Categories</option>
                    <option value="NID">NID</option>
                    <option value="Marksheet">Marksheet</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Attendance Sheet">Attendance Sheet</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <!-- Documents Grid -->
            <div id="documents-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${renderDocumentCards(documents)}
            </div>
        </div>
    `;
    
    lucide.createIcons();
    
    // Add filter listener
    document.getElementById('filter-category').addEventListener('change', updateDocumentsList);
}

function renderDocumentCards(documents) {
    if (documents.length === 0) {
        return `
            <div class="col-span-full text-center py-12">
                <i data-lucide="file-text" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                <p class="text-gray-500">No documents found</p>
            </div>
        `;
    }
    
    return documents.map(doc => {
        const student = dataManager.getStudent(doc.studentId);
        return `
            <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i data-lucide="file-text" class="w-6 h-6 text-blue-600"></i>
                    </div>
                    <button onclick="deleteDocumentConfirm('${doc.id}')" class="text-red-600 hover:text-red-700">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
                <h3 class="font-medium text-gray-900 mb-1 truncate">${doc.fileName}</h3>
                <p class="text-sm text-gray-500 mb-2">${student ? student.fullName : 'Unknown Student'}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span class="badge badge-info">${doc.category}</span>
                    <span>${formatFileSize(doc.fileSize)}</span>
                </div>
                <div class="text-xs text-gray-400 mt-2">${formatDate(doc.uploadDate, 'short')}</div>
            </div>
        `;
    }).join('');
}

function updateDocumentsList() {
    let documents = dataManager.getDocuments();
    
    const categoryFilter = document.getElementById('filter-category')?.value || '';
    if (categoryFilter) {
        documents = documents.filter(d => d.category === categoryFilter);
    }
    
    const grid = document.getElementById('documents-grid');
    grid.innerHTML = renderDocumentCards(documents);
    lucide.createIcons();
}

function uploadDocumentGeneral() {
    const students = dataManager.getStudents();
    
    showFormModal({
        title: 'Upload Document',
        fields: [
            { id: 'studentId', label: 'Select Student', type: 'select', required: true, options: 
                students.map(s => ({ value: s.id, label: `${s.fullName} (${s.rollNumber})` }))
            },
            { id: 'category', label: 'Document Category', type: 'select', required: true, options: [
                { value: 'NID', label: 'NID' },
                { value: 'Marksheet', label: 'Marksheet' },
                { value: 'Certificate', label: 'Certificate' },
                { value: 'Attendance Sheet', label: 'Attendance Sheet' },
                { value: 'Other', label: 'Other' }
            ]},
            { id: 'file', label: 'Select File', type: 'file', required: true, accept: '.pdf,.jpg,.jpeg,.png' }
        ],
        onSubmit: (formData) => {
            const document = {
                studentId: formData.studentId,
                fileName: formData.file.name,
                fileType: formData.file.type,
                category: formData.category,
                fileSize: formData.file.size,
                fileUrl: '#'
            };
            
            if (dataManager.addDocument(document)) {
                showToast('Document uploaded successfully', 'success');
                renderDocuments();
            } else {
                showToast('Failed to upload document', 'error');
            }
        }
    });
}

function deleteDocumentConfirm(id) {
    showConfirmModal({
        title: 'Delete Document',
        message: 'Are you sure you want to delete this document? This action cannot be undone.',
        confirmText: 'Delete',
        type: 'danger',
        onConfirm: () => {
            if (dataManager.deleteDocument(id)) {
                showToast('Document deleted successfully', 'success');
                updateDocumentsList();
            } else {
                showToast('Failed to delete document', 'error');
            }
        }
    });
}

window.renderDocuments = renderDocuments;
window.uploadDocumentGeneral = uploadDocumentGeneral;
window.deleteDocumentConfirm = deleteDocumentConfirm;


// Marks & Attendance Page
function renderMarksAttendance() {
    renderNavbar('Marks & Attendance');
    
    const students = dataManager.getStudents();
    const departments = dataManager.getDepartments();
    const selectedStudentId = students[0]?.id || null;
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Marks & Attendance</h2>
            </div>

            <!-- Search and Filters -->
            <div class="mb-6 space-y-4">
                <!-- Search Bar -->
                <div class="relative">
                    <input 
                        type="text" 
                        id="student-search" 
                        placeholder="Search by name or roll number..." 
                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onkeyup="filterStudentsMarksAttendance()"
                    >
                    <i data-lucide="search" class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>

                <!-- Filters Row -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select id="department-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onchange="filterStudentsMarksAttendance()">
                        <option value="">All Departments</option>
                        ${departments.map(dept => `<option value="${dept.name}">${dept.name}</option>`).join('')}
                    </select>
                    
                    <select id="semester-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onchange="filterStudentsMarksAttendance()">
                        <option value="">All Semesters</option>
                        ${Array.from({ length: 8 }, (_, i) => i + 1).map(sem => `<option value="${sem}">Semester ${sem}</option>`).join('')}
                    </select>
                    
                    <select id="status-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onchange="filterStudentsMarksAttendance()">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="graduated">Graduated</option>
                    </select>

                    <button onclick="clearMarksAttendanceFilters()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="x" class="w-4 h-4"></i>
                        Clear Filters
                    </button>
                </div>
            </div>

            <!-- Student Selector -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                <select id="student-selector" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    ${students.map(s => `<option value="${s.id}">${s.fullName} (${s.rollNumber}) - ${s.department}</option>`).join('')}
                </select>
                <p id="student-count" class="text-sm text-gray-500 mt-2">${students.length} student(s) found</p>
            </div>

            <!-- Semester Tabs -->
            <div id="semester-tabs" class="flex gap-2 mb-6 overflow-x-auto">
                <!-- Tabs will be rendered here -->
            </div>

            <!-- Content -->
            <div id="marks-attendance-content" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Content will be rendered here -->
            </div>
        </div>
    `;
    
    lucide.createIcons();
    
    // Add event listener
    document.getElementById('student-selector').addEventListener('change', (e) => {
        updateMarksAttendance(e.target.value);
    });
    
    // Initial render
    if (selectedStudentId) {
        updateMarksAttendance(selectedStudentId);
    }
}

let selectedSemester = 1;

function updateMarksAttendance(studentId) {
    const student = dataManager.getStudent(studentId);
    if (!student) return;
    
    // Render semester tabs
    const tabsContainer = document.getElementById('semester-tabs');
    tabsContainer.innerHTML = Array.from({ length: student.semester }, (_, i) => i + 1).map(sem => `
        <button onclick="selectSemester(${sem})" 
            class="px-4 py-2 rounded-lg transition-colors ${sem === selectedSemester ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
            Semester ${sem}
        </button>
    `).join('');
    
    // Get marks and attendance for selected semester
    const marks = dataManager.getMarks(studentId).find(m => m.semester === selectedSemester);
    
    // Get attendance from new semesterAttendance structure
    const semesterAttendanceData = student.semesterAttendance?.find(a => a.semester === selectedSemester);
    
    // Convert new format to old format for compatibility
    let attendance = null;
    if (semesterAttendanceData) {
        attendance = {
            semester: semesterAttendanceData.semester,
            courses: semesterAttendanceData.subjects.map(subject => ({
                courseName: subject.name,
                courseCode: subject.name.substring(0, 3).toUpperCase(),
                attendedClasses: subject.present,
                totalClasses: subject.total,
                percentage: subject.percentage
            })),
            overallPercentage: semesterAttendanceData.averageAttendance
        };
    } else {
        // Fallback to old structure if exists
        attendance = dataManager.getAttendance(studentId).find(a => a.semester === selectedSemester);
    }
    
    // Render content
    const contentContainer = document.getElementById('marks-attendance-content');
    contentContainer.innerHTML = `
        <!-- Marks Section -->
        <div>
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Marks</h3>
                <button onclick="addMarks('${studentId}')" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <i data-lucide="plus" class="w-4 h-4 inline"></i> Add Marks
                </button>
            </div>
            ${marks ? `
                <div class="space-y-3">
                    ${marks.courses.map(course => `
                        <div class="border border-gray-200 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-2">
                                <div>
                                    <h4 class="font-medium text-gray-900">${course.courseName}</h4>
                                    <p class="text-sm text-gray-500">${course.courseCode} • ${course.credits} Credits</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-gray-900">${course.marks}</div>
                                    <div class="text-sm text-gray-500">Grade: ${course.grade}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-blue-900">GPA</span>
                            <span class="text-2xl font-bold text-blue-900">${marks.gpa}</span>
                        </div>
                    </div>
                </div>
            ` : '<p class="text-gray-500">No marks recorded for this semester</p>'}
        </div>

        <!-- Attendance Section -->
        <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Attendance</h3>
            ${attendance ? `
                <div class="space-y-3">
                    ${attendance.courses.map(course => `
                        <div class="border border-gray-200 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-2">
                                <div>
                                    <h4 class="font-medium text-gray-900">${course.courseName}</h4>
                                    <p class="text-sm text-gray-500">${course.courseCode}</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-lg font-bold ${course.percentage >= 75 ? 'text-green-600' : 'text-red-600'}">
                                        ${course.percentage}%
                                    </div>
                                    <div class="text-xs text-gray-500">${course.attendedClasses}/${course.totalClasses}</div>
                                </div>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="h-2 rounded-full ${course.percentage >= 75 ? 'bg-green-600' : 'bg-red-600'}" 
                                     style="width: ${course.percentage}%"></div>
                            </div>
                        </div>
                    `).join('')}
                    <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-indigo-900">Overall Attendance</span>
                            <span class="text-2xl font-bold text-indigo-900">${attendance.overallPercentage}%</span>
                        </div>
                    </div>
                </div>
            ` : '<p class="text-gray-500">No attendance recorded for this semester</p>'}
        </div>
    `;
    
    lucide.createIcons();
}

function selectSemester(semester) {
    selectedSemester = semester;
    const studentId = document.getElementById('student-selector').value;
    updateMarksAttendance(studentId);
}

function addMarks(studentId) {
    showToast('Add marks functionality coming soon', 'info');
}

function filterStudentsMarksAttendance() {
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    const departmentFilter = document.getElementById('department-filter').value;
    const semesterFilter = document.getElementById('semester-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    let students = dataManager.getStudents();
    
    // Apply search filter
    if (searchTerm) {
        students = students.filter(student => 
            student.fullName.toLowerCase().includes(searchTerm) ||
            student.rollNumber.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply department filter
    if (departmentFilter) {
        students = students.filter(student => student.department === departmentFilter);
    }
    
    // Apply semester filter
    if (semesterFilter) {
        students = students.filter(student => student.semester === parseInt(semesterFilter));
    }
    
    // Apply status filter
    if (statusFilter) {
        students = students.filter(student => student.status === statusFilter);
    }
    
    // Update student selector
    const studentSelector = document.getElementById('student-selector');
    studentSelector.innerHTML = students.map(s => 
        `<option value="${s.id}">${s.fullName} (${s.rollNumber}) - ${s.department}</option>`
    ).join('');
    
    // Update count
    document.getElementById('student-count').textContent = `${students.length} student(s) found`;
    
    // Update marks and attendance for first student if available
    if (students.length > 0) {
        updateMarksAttendance(students[0].id);
    } else {
        const contentContainer = document.getElementById('marks-attendance-content');
        contentContainer.innerHTML = `
            <div class="col-span-2 text-center py-12">
                <i data-lucide="inbox" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                <p class="text-gray-600">Try adjusting your search or filters.</p>
            </div>
        `;
        lucide.createIcons();
    }
}

function clearMarksAttendanceFilters() {
    document.getElementById('student-search').value = '';
    document.getElementById('department-filter').value = '';
    document.getElementById('semester-filter').value = '';
    document.getElementById('status-filter').value = '';
    filterStudentsMarksAttendance();
}

window.renderMarksAttendance = renderMarksAttendance;
window.selectSemester = selectSemester;
window.addMarks = addMarks;
window.filterStudentsMarksAttendance = filterStudentsMarksAttendance;
window.clearMarksAttendanceFilters = clearMarksAttendanceFilters;


// Alumni Page
function renderAlumni() {
    renderNavbar('Alumni');
    
    const alumni = dataManager.getAlumni();
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Alumni Records</h2>
                <button onclick="addAlumniRecord()" class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i data-lucide="plus" class="w-5 h-5"></i>
                    <span>Add Alumni Record</span>
                </button>
            </div>

            <!-- Filters -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select id="filter-status" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Status</option>
                    <option value="Job">Job</option>
                    <option value="Higher Study">Higher Study</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                </select>
                <select id="filter-year" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Years</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
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
    document.getElementById('filter-status').addEventListener('change', updateAlumniList);
    document.getElementById('filter-year').addEventListener('change', updateAlumniList);
    document.getElementById('search-alumni').addEventListener('input', debounce(updateAlumniList, 300));
}

function renderAlumniCards(alumni) {
    if (alumni.length === 0) {
        return `
            <div class="col-span-full text-center py-12">
                <i data-lucide="graduation-cap" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                <p class="text-gray-500">No alumni records found</p>
            </div>
        `;
    }
    
    return alumni.map(alum => {
        const student = dataManager.getStudent(alum.studentId);
        if (!student) return '';
        
        const statusColors = {
            'Job': 'bg-green-100 text-green-800',
            'Higher Study': 'bg-blue-100 text-blue-800',
            'Business': 'bg-purple-100 text-purple-800',
            'Other': 'bg-gray-100 text-gray-800'
        };
        
        return `
            <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow card-hover">
                <div class="flex items-start gap-4 mb-4">
                    <img src="${student.profilePhoto}" alt="${student.fullName}" class="w-16 h-16 rounded-full">
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 truncate">${student.fullName}</h3>
                        <p class="text-sm text-gray-500">${student.department}</p>
                        <p class="text-xs text-gray-400">Class of ${alum.graduationYear}</p>
                    </div>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${statusColors[alum.currentStatus]}">
                            ${alum.currentStatus}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                        <i data-lucide="building" class="w-4 h-4"></i>
                        <span class="truncate">${alum.companyOrUniversity}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                        <i data-lucide="briefcase" class="w-4 h-4"></i>
                        <span class="truncate">${alum.positionOrRole}</span>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <button onclick="viewAlumniDetails('${alum.id}')" class="flex-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Details
                    </button>
                    <button onclick="editAlumni('${alum.id}')" class="text-gray-600 hover:text-gray-700">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateAlumniList() {
    let alumni = dataManager.getAlumni();
    
    // Apply status filter
    const statusFilter = document.getElementById('filter-status')?.value || '';
    if (statusFilter) {
        alumni = alumni.filter(a => a.currentStatus === statusFilter);
    }
    
    // Apply year filter
    const yearFilter = document.getElementById('filter-year')?.value || '';
    if (yearFilter) {
        alumni = alumni.filter(a => a.graduationYear === parseInt(yearFilter));
    }
    
    // Apply search
    const searchTerm = document.getElementById('search-alumni')?.value || '';
    if (searchTerm) {
        alumni = alumni.filter(a => {
            const student = dataManager.getStudent(a.studentId);
            return student && (
                student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.companyOrUniversity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.positionOrRole.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }
    
    const grid = document.getElementById('alumni-grid');
    grid.innerHTML = renderAlumniCards(alumni);
    lucide.createIcons();
}

function addAlumniRecord() {
    const students = dataManager.getStudents().filter(s => s.status === 'graduated');
    
    showFormModal({
        title: 'Add Alumni Record',
        fields: [
            { id: 'studentId', label: 'Select Student', type: 'select', required: true, options: 
                students.map(s => ({ value: s.id, label: `${s.fullName} (${s.rollNumber})` }))
            },
            { id: 'currentStatus', label: 'Current Status', type: 'select', required: true, options: [
                { value: 'Job', label: 'Job' },
                { value: 'Higher Study', label: 'Higher Study' },
                { value: 'Business', label: 'Business' },
                { value: 'Other', label: 'Other' }
            ]},
            { id: 'companyOrUniversity', label: 'Company/University', type: 'text', required: true, placeholder: 'Enter company or university name' },
            { id: 'positionOrRole', label: 'Position/Role', type: 'text', required: true, placeholder: 'Enter position or role' },
            { id: 'startDate', label: 'Start Date', type: 'date', required: true },
            { id: 'phone', label: 'Contact Phone', type: 'tel', required: false, placeholder: 'Enter phone number' },
            { id: 'email', label: 'Contact Email', type: 'email', required: false, placeholder: 'Enter email address' },
            { id: 'linkedin', label: 'LinkedIn Profile', type: 'url', required: false, placeholder: 'Enter LinkedIn URL' }
        ],
        onSubmit: (formData) => {
            const alumniData = {
                studentId: formData.studentId,
                currentStatus: formData.currentStatus,
                companyOrUniversity: formData.companyOrUniversity,
                positionOrRole: formData.positionOrRole,
                startDate: formData.startDate,
                contactInfo: {
                    phone: formData.phone || '',
                    email: formData.email || '',
                    linkedin: formData.linkedin || ''
                },
                graduationYear: 2023
            };
            
            if (dataManager.addAlumni(alumniData)) {
                showToast('Alumni record added successfully', 'success');
                renderAlumni();
            } else {
                showToast('Failed to add alumni record', 'error');
            }
        }
    });
}

function viewAlumniDetails(id) {
    navigateTo(`/alumni/${id}`);
}

// Alumni Details Page
function renderAlumniDetails(params) {
    const alumni = dataManager.getAlumni().find(a => a.id === params.id);
    
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
    
    renderNavbar('Alumni Details');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-6">
                <button onclick="navigateTo('/alumni')" class="text-gray-600 hover:text-gray-900">
                    <i data-lucide="arrow-left" class="w-6 h-6"></i>
                </button>
                <h2 class="text-2xl font-bold text-gray-900">Alumni Details</h2>
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
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${
                            alumni.currentStatus === 'Job' ? 'bg-green-100 text-green-800' :
                            alumni.currentStatus === 'Higher Study' ? 'bg-blue-100 text-blue-800' :
                            alumni.currentStatus === 'Business' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                        }">
                            ${alumni.currentStatus}
                        </span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <button onclick="editAlumni('${alumni.id}')" class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i data-lucide="edit" class="w-4 h-4"></i>
                            Edit
                        </button>
                        <button onclick="deleteAlumniConfirm('${alumni.id}')" class="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <!-- Information Sections -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Current Position -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i data-lucide="briefcase" class="w-5 h-5 text-blue-600"></i>
                        Current Position
                    </h3>
                    <dl class="space-y-3">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Status</dt>
                            <dd class="text-sm text-gray-900">${alumni.currentStatus}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Company/University</dt>
                            <dd class="text-sm text-gray-900">${alumni.companyOrUniversity}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Position/Role</dt>
                            <dd class="text-sm text-gray-900">${alumni.positionOrRole}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Start Date</dt>
                            <dd class="text-sm text-gray-900">${formatDate(alumni.startDate, 'long')}</dd>
                        </div>
                    </dl>
                </div>

                <!-- Contact Information -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i data-lucide="phone" class="w-5 h-5 text-blue-600"></i>
                        Contact Information
                    </h3>
                    <dl class="space-y-3">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Phone</dt>
                            <dd class="text-sm text-gray-900">${alumni.contactInfo?.phone || student.phone || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Email</dt>
                            <dd class="text-sm text-gray-900">${alumni.contactInfo?.email || student.email || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">LinkedIn</dt>
                            <dd class="text-sm text-gray-900">
                                ${alumni.contactInfo?.linkedin ? `<a href="${alumni.contactInfo.linkedin}" target="_blank" class="text-blue-600 hover:underline">${alumni.contactInfo.linkedin}</a>` : 'N/A'}
                            </dd>
                        </div>
                    </dl>
                </div>

                <!-- Academic Information -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i data-lucide="book-open" class="w-5 h-5 text-blue-600"></i>
                        Academic Information
                    </h3>
                    <dl class="space-y-3">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Roll Number</dt>
                            <dd class="text-sm text-gray-900">${student.rollNumber}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Registration Number</dt>
                            <dd class="text-sm text-gray-900">${student.registrationNumber}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Department</dt>
                            <dd class="text-sm text-gray-900">${student.department}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Graduation Year</dt>
                            <dd class="text-sm text-gray-900">${alumni.graduationYear}</dd>
                        </div>
                    </dl>
                </div>

                <!-- Additional Information -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i data-lucide="info" class="w-5 h-5 text-blue-600"></i>
                        Additional Information
                    </h3>
                    <dl class="space-y-3">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
                            <dd class="text-sm text-gray-900">${formatDate(alumni.updatedAt, 'long')}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Student Status</dt>
                            <dd class="text-sm"><span class="badge badge-info">${student.status}</span></dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    `;
    
    lucide.createIcons();
}

function editAlumni(id) {
    navigateTo(`/edit-alumni/${id}`);
}

// Edit Alumni Page
function renderEditAlumni(params) {
    const alumni = dataManager.getAlumni().find(a => a.id === params.id);
    
    if (!alumni) {
        showToast('Alumni record not found', 'error');
        navigateTo('/alumni');
        return;
    }
    
    const student = dataManager.getStudent(alumni.studentId);
    
    renderNavbar('Edit Alumni Record');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center gap-4 mb-6">
                    <button onclick="navigateTo('/alumni/${alumni.id}')" class="text-gray-600 hover:text-gray-900">
                        <i data-lucide="arrow-left" class="w-6 h-6"></i>
                    </button>
                    <h2 class="text-2xl font-bold text-gray-900">Edit Alumni Record</h2>
                </div>
                
                <div class="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p class="text-sm text-gray-700"><strong>Student:</strong> ${student.fullName} (${student.rollNumber})</p>
                    <p class="text-sm text-gray-700"><strong>Department:</strong> ${student.department}</p>
                </div>
                
                <form id="edit-alumni-form" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Current Status <span class="text-red-500">*</span></label>
                            <select id="currentStatus" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="Job" ${alumni.currentStatus === 'Job' ? 'selected' : ''}>Job</option>
                                <option value="Higher Study" ${alumni.currentStatus === 'Higher Study' ? 'selected' : ''}>Higher Study</option>
                                <option value="Business" ${alumni.currentStatus === 'Business' ? 'selected' : ''}>Business</option>
                                <option value="Other" ${alumni.currentStatus === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Company/University <span class="text-red-500">*</span></label>
                            <input type="text" id="companyOrUniversity" value="${alumni.companyOrUniversity}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Position/Role <span class="text-red-500">*</span></label>
                            <input type="text" id="positionOrRole" value="${alumni.positionOrRole}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date <span class="text-red-500">*</span></label>
                            <input type="date" id="startDate" value="${alumni.startDate}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Graduation Year <span class="text-red-500">*</span></label>
                            <input type="number" id="graduationYear" value="${alumni.graduationYear}" required min="2000" max="2099" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                            <input type="tel" id="phone" value="${alumni.contactInfo?.phone || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                            <input type="email" id="email" value="${alumni.contactInfo?.email || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                            <input type="url" id="linkedin" value="${alumni.contactInfo?.linkedin || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://linkedin.com/in/username">
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex gap-4 justify-end pt-4 border-t border-gray-200">
                        <button type="button" onclick="navigateTo('/alumni/${alumni.id}')" class="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" class="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
                            <i data-lucide="save" class="w-5 h-5"></i>
                            Update Alumni Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    lucide.createIcons();
    
    // Handle form submission
    document.getElementById('edit-alumni-form').addEventListener('submit', (e) => handleEditAlumni(e, alumni.id));
}

function handleEditAlumni(e, alumniId) {
    e.preventDefault();
    
    const updates = {
        currentStatus: document.getElementById('currentStatus').value,
        companyOrUniversity: document.getElementById('companyOrUniversity').value,
        positionOrRole: document.getElementById('positionOrRole').value,
        startDate: document.getElementById('startDate').value,
        graduationYear: parseInt(document.getElementById('graduationYear').value),
        contactInfo: {
            phone: document.getElementById('phone').value || '',
            email: document.getElementById('email').value || '',
            linkedin: document.getElementById('linkedin').value || ''
        }
    };
    
    if (dataManager.updateAlumni(alumniId, updates)) {
        showToast('Alumni record updated successfully!', 'success');
        setTimeout(() => navigateTo(`/alumni/${alumniId}`), 1000);
    } else {
        showToast('Failed to update alumni record', 'error');
    }
}

function deleteAlumniConfirm(id) {
    const alumni = dataManager.getAlumni().find(a => a.id === id);
    const student = dataManager.getStudent(alumni.studentId);
    
    showConfirmModal({
        title: 'Delete Alumni Record',
        message: `Are you sure you want to delete the alumni record for ${student.fullName}? This action cannot be undone.`,
        confirmText: 'Delete',
        type: 'danger',
        onConfirm: () => {
            // Note: We need to add deleteAlumni method to dataManager
            const allAlumni = dataManager.getAlumni();
            const filtered = allAlumni.filter(a => a.id !== id);
            if (storage.set('slms_alumni', filtered)) {
                showToast('Alumni record deleted successfully', 'success');
                navigateTo('/alumni');
            } else {
                showToast('Failed to delete alumni record', 'error');
            }
        }
    });
}

window.renderAlumni = renderAlumni;
window.renderAlumniDetails = renderAlumniDetails;
window.renderEditAlumni = renderEditAlumni;
window.addAlumniRecord = addAlumniRecord;
window.viewAlumniDetails = viewAlumniDetails;
window.editAlumni = editAlumni;
window.deleteAlumniConfirm = deleteAlumniConfirm;


// Login Page
function renderLogin() {
    // Hide sidebar and navbar for login page
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('navbar').style.display = 'none';
    
    const mainContent = document.getElementById('main-content');
    mainContent.className = 'min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6';
    mainContent.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <!-- Logo -->
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="graduation-cap" class="w-8 h-8 text-white"></i>
                </div>
                <h1 class="text-2xl font-bold text-gray-900">SLMS</h1>
                <p class="text-gray-600 text-sm">Student Lifecycle Management System</p>
            </div>

            <!-- Login Form -->
            <form id="login-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input type="email" id="login-email" required 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="admin@slms.edu">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div class="relative">
                        <input type="password" id="login-password" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="••••••••">
                        <button type="button" onclick="togglePassword()" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <i data-lucide="eye" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                        <span class="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" class="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
                </div>

                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                    Sign In
                </button>
            </form>

            <!-- Footer -->
            <p class="text-center text-sm text-gray-500 mt-6">
                © 2024 SLMS. All rights reserved.
            </p>
        </div>
    `;
    
    lucide.createIcons();
    
    // Handle form submission
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple mock authentication
    if (email && password) {
        const user = {
            email: email,
            name: 'Admin User',
            role: 'admin'
        };
        
        dataManager.setCurrentUser(user);
        showToast('Login successful!', 'success');
        
        // Restore layout
        document.getElementById('sidebar').style.display = 'block';
        document.getElementById('navbar').style.display = 'block';
        document.getElementById('main-content').className = 'p-6';
        
        setTimeout(() => navigateTo('/'), 500);
    } else {
        showToast('Please enter valid credentials', 'error');
    }
}

function togglePassword() {
    const input = document.getElementById('login-password');
    input.type = input.type === 'password' ? 'text' : 'password';
}

window.renderLogin = renderLogin;
window.togglePassword = togglePassword;


// Admin Dashboard Page
function renderAdminDashboard() {
    renderNavbar('Admin Dashboard');
    
    const students = dataManager.getStudents();
    const documents = dataManager.getDocuments();
    const alumni = dataManager.getAlumni();
    
    // Calculate statistics
    const totalStudents = students.length;
    const totalSemesters = 8;
    const totalDocuments = documents.length;
    const totalAlumni = alumni.length;
    
    // Department-wise distribution
    const deptDistribution = utils.groupBy(students, 'department');
    const deptLabels = Object.keys(deptDistribution);
    const deptData = Object.values(deptDistribution).map(arr => arr.length);
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            ${createStatCard({ title: 'Total Students', value: totalStudents, icon: 'users', color: 'blue', trend: { value: 12, direction: 'up' } })}
            ${createStatCard({ title: 'Total Semesters', value: totalSemesters, icon: 'calendar', color: 'green' })}
            ${createStatCard({ title: 'Total Documents', value: totalDocuments, icon: 'file-text', color: 'purple', trend: { value: 8, direction: 'up' } })}
            ${createStatCard({ title: 'Alumni Count', value: totalAlumni, icon: 'graduation-cap', color: 'indigo' })}
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Department Distribution -->
            <div class="bg-white rounded-xl shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Department-wise Student Distribution</h3>
                <canvas id="dept-chart"></canvas>
            </div>

            <!-- Attendance Overview -->
            <div class="bg-white rounded-xl shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Semester-wise Attendance Overview</h3>
                <canvas id="attendance-chart"></canvas>
            </div>
        </div>

        <!-- Recent Activities -->
        <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${students.slice(0, 5).map(student => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Student Added</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${student.fullName}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(student.createdAt, 'short')}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="badge badge-success">Completed</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <button onclick="navigateTo('/add-student')" class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <i data-lucide="user-plus" class="w-6 h-6 text-blue-600"></i>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">Add New Student</h3>
                <p class="text-sm text-gray-600">Register a new student in the system</p>
            </button>

            <button onclick="navigateTo('/documents')" class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <i data-lucide="upload" class="w-6 h-6 text-purple-600"></i>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">Upload Documents</h3>
                <p class="text-sm text-gray-600">Upload student documents and certificates</p>
            </button>

            <button onclick="navigateTo('/students')" class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <i data-lucide="users" class="w-6 h-6 text-green-600"></i>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">View All Students</h3>
                <p class="text-sm text-gray-600">Browse and manage student records</p>
            </button>
        </div>
    `;
    
    lucide.createIcons();
    
    // Render charts
    renderDepartmentChart(deptLabels, deptData);
    renderAttendanceChart();
}

function renderDepartmentChart(labels, data) {
    const ctx = document.getElementById('dept-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#3B82F6',
                    '#6366F1',
                    '#8B5CF6',
                    '#A855F7',
                    '#EC4899'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderAttendanceChart() {
    const ctx = document.getElementById('attendance-chart');
    if (!ctx) return;
    
    // Mock data for attendance
    const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
    const attendanceData = [85, 88, 82, 90, 87, 89, 84, 86];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: semesters,
            datasets: [{
                label: 'Average Attendance %',
                data: attendanceData,
                backgroundColor: '#3B82F6',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

window.renderAdminDashboard = renderAdminDashboard;


// Departments Page
function renderDepartments() {
    renderNavbar('Departments');
    
    const departments = dataManager.getDepartments();
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">Departments</h2>
                    <p class="text-gray-600 mt-1">Manage departments and view students by department and semester</p>
                </div>
                <button onclick="addNewDepartment()" class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i data-lucide="plus" class="w-5 h-5"></i>
                    <span>Add Department</span>
                </button>
            </div>

            <!-- Departments Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${departments.map(dept => {
                    const students = dataManager.getStudentsByDepartmentAndSemester(dept.name);
                    const activeStudents = students.filter(s => s.status === 'active').length;
                    
                    return `
                        <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow card-hover">
                            <div class="flex items-start justify-between mb-4">
                                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="building-2" class="w-6 h-6 text-blue-600"></i>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="editDepartment('${dept.id}')" class="text-gray-600 hover:text-blue-600">
                                        <i data-lucide="edit" class="w-4 h-4"></i>
                                    </button>
                                    <button onclick="deleteDepartmentConfirm('${dept.id}')" class="text-gray-600 hover:text-red-600">
                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <h3 class="text-lg font-semibold text-gray-900 mb-1">${dept.name}</h3>
                            <p class="text-sm text-gray-500 mb-4">Code: ${dept.code}</p>
                            
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <div class="text-2xl font-bold text-gray-900">${students.length}</div>
                                    <div class="text-xs text-gray-500">Total Students</div>
                                </div>
                                <div>
                                    <div class="text-2xl font-bold text-green-600">${activeStudents}</div>
                                    <div class="text-xs text-gray-500">Active</div>
                                </div>
                            </div>
                            
                            <button onclick="navigateTo('/department/${encodeURIComponent(dept.name)}')" 
                                class="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors font-medium">
                                View Students
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    lucide.createIcons();
}

function addNewDepartment() {
    showFormModal({
        title: 'Add New Department',
        fields: [
            { id: 'name', label: 'Department Name', type: 'text', required: true, placeholder: 'e.g., Computer Science and Technology' },
            { id: 'code', label: 'Department Code', type: 'text', required: true, placeholder: 'e.g., CST' }
        ],
        onSubmit: (formData) => {
            if (dataManager.addDepartment(formData)) {
                showToast('Department added successfully', 'success');
                renderDepartments();
            } else {
                showToast('Failed to add department', 'error');
            }
        }
    });
}

function editDepartment(id) {
    const departments = dataManager.getDepartments();
    const dept = departments.find(d => d.id === id);
    
    if (!dept) return;
    
    showFormModal({
        title: 'Edit Department',
        fields: [
            { id: 'name', label: 'Department Name', type: 'text', required: true, placeholder: dept.name },
            { id: 'code', label: 'Department Code', type: 'text', required: true, placeholder: dept.code }
        ],
        onSubmit: (formData) => {
            if (dataManager.updateDepartment(id, formData)) {
                showToast('Department updated successfully', 'success');
                renderDepartments();
            } else {
                showToast('Failed to update department', 'error');
            }
        }
    });
}

function deleteDepartmentConfirm(id) {
    const departments = dataManager.getDepartments();
    const dept = departments.find(d => d.id === id);
    
    showConfirmModal({
        title: 'Delete Department',
        message: `Are you sure you want to delete ${dept.name}? This will not delete students, but they will need to be reassigned.`,
        confirmText: 'Delete',
        type: 'danger',
        onConfirm: () => {
            if (dataManager.deleteDepartment(id)) {
                showToast('Department deleted successfully', 'success');
                renderDepartments();
            } else {
                showToast('Failed to delete department', 'error');
            }
        }
    });
}

// Department View Page (Students by Department and Semester)
function renderDepartmentView(params) {
    const departmentName = decodeURIComponent(params.name);
    const departments = dataManager.getDepartments();
    const dept = departments.find(d => d.name === departmentName);
    
    if (!dept) {
        showToast('Department not found', 'error');
        navigateTo('/departments');
        return;
    }
    
    renderNavbar(departmentName);
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-6">
                <button onclick="navigateTo('/departments')" class="text-gray-600 hover:text-gray-900">
                    <i data-lucide="arrow-left" class="w-6 h-6"></i>
                </button>
                <div class="flex-1">
                    <h2 class="text-2xl font-bold text-gray-900">${dept.name}</h2>
                    <p class="text-gray-600">Department Code: ${dept.code}</p>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div class="relative">
                    <i data-lucide="search" class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input type="text" id="department-search" placeholder="Search by name, roll number, or registration number..." 
                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onkeyup="searchDepartmentStudents('${departmentName}')">
                </div>
            </div>

            <!-- Semester Tabs -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Semester</h3>
                <div id="semester-tabs" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    ${Array.from({ length: 8 }, (_, i) => i + 1).map(sem => {
                        const students = dataManager.getStudentsByDepartmentAndSemester(departmentName, sem);
                        return `
                            <button onclick="selectDepartmentSemester('${departmentName}', ${sem})" 
                                class="semester-tab flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all ${sem === 1 ? 'border-blue-500 bg-blue-50' : ''}">
                                <div class="text-2xl font-bold text-gray-900">${sem}</div>
                                <div class="text-xs text-gray-500 mt-1">Semester</div>
                                <div class="text-sm font-medium text-blue-600 mt-2">${students.length} students</div>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Students List -->
            <div id="department-students-list" class="bg-white rounded-xl shadow-sm p-6">
                <!-- Students will be loaded here -->
            </div>
        </div>
    `;
    
    lucide.createIcons();
    
    // Load first semester by default
    selectDepartmentSemester(departmentName, 1);
}

function selectDepartmentSemester(departmentName, semester) {
    // Store current semester
    currentDepartmentSemester = semester;
    
    // Clear search
    const searchInput = document.getElementById('department-search');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Update active tab
    document.querySelectorAll('.semester-tab').forEach(tab => {
        tab.classList.remove('border-blue-500', 'bg-blue-50');
        tab.classList.add('border-gray-200');
    });
    event?.target?.closest('.semester-tab')?.classList.add('border-blue-500', 'bg-blue-50');
    
    const students = dataManager.getStudentsByDepartmentAndSemester(departmentName, semester);
    const container = document.getElementById('department-students-list');
    
    if (students.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i data-lucide="users" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                <p class="text-gray-600 mb-4">There are no students in Semester ${semester} for this department.</p>
                <button onclick="navigateTo('/add-student')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Add Student
                </button>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    container.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
                Semester ${semester} Students (${students.length})
            </h3>
            <div class="flex gap-2">
                <button onclick="exportDepartmentStudents('${departmentName}', ${semester})" class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                    <i data-lucide="download" class="w-4 h-4"></i>
                    Export
                </button>
            </div>
        </div>

        <!-- Students Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${students.map(student => `
                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start gap-3 mb-3">
                        <img src="${student.profilePhoto}" alt="${student.fullName}" class="w-12 h-12 rounded-full">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-semibold text-gray-900 truncate">${student.fullName}</h4>
                            <p class="text-sm text-gray-500">${student.rollNumber}</p>
                        </div>
                        <span class="badge badge-${student.status === 'active' ? 'success' : student.status === 'graduated' ? 'info' : 'warning'}">
                            ${student.status}
                        </span>
                    </div>
                    
                    <div class="space-y-2 text-sm mb-3">
                        <div class="flex items-center gap-2 text-gray-600">
                            <i data-lucide="mail" class="w-4 h-4"></i>
                            <span class="truncate">${student.email}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                            <i data-lucide="phone" class="w-4 h-4"></i>
                            <span>${student.phone}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                            <i data-lucide="calendar" class="w-4 h-4"></i>
                            <span>Enrolled: ${formatDate(student.enrollmentDate, 'short')}</span>
                        </div>
                    </div>
                    
                    <button onclick="navigateTo('/student/${student.id}')" 
                        class="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors text-sm font-medium">
                        View Details
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    
    lucide.createIcons();
}

function exportDepartmentStudents(departmentName, semester) {
    const students = dataManager.getStudentsByDepartmentAndSemester(departmentName, semester);
    const data = students.map(s => ({
        'Full Name': s.fullName,
        'Roll Number': s.rollNumber,
        'Registration Number': s.registrationNumber,
        'Email': s.email,
        'Phone': s.phone,
        'Status': s.status,
        'Enrollment Date': formatDate(s.enrollmentDate, 'short')
    }));
    
    utils.downloadJSON(data, `${departmentName.replace(/\s+/g, '_')}_Semester_${semester}_Students.json`);
    showToast('Student data exported successfully', 'success');
}

// Search students in department view
let currentDepartmentSemester = 1;

function searchDepartmentStudents(departmentName) {
    const searchTerm = document.getElementById('department-search').value.toLowerCase().trim();
    
    if (!searchTerm) {
        // If search is empty, show current semester students
        selectDepartmentSemester(departmentName, currentDepartmentSemester);
        return;
    }
    
    // Search across all semesters in the department
    const allStudents = dataManager.getStudents().filter(s => s.department === departmentName);
    const filteredStudents = allStudents.filter(student => {
        const fullName = (student.fullName || '').toLowerCase();
        const rollNumber = (student.currentRollNumber || student.rollNumber || '').toLowerCase();
        const registrationNumber = (student.currentRegistrationNumber || student.registrationNumber || '').toLowerCase();
        
        return fullName.includes(searchTerm) || 
               rollNumber.includes(searchTerm) || 
               registrationNumber.includes(searchTerm);
    });
    
    const container = document.getElementById('department-students-list');
    
    if (filteredStudents.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i data-lucide="search-x" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p class="text-gray-600 mb-4">No students match your search criteria "${searchTerm}"</p>
                <button onclick="document.getElementById('department-search').value=''; searchDepartmentStudents('${departmentName}')" 
                    class="text-blue-600 hover:text-blue-700 font-medium">
                    Clear Search
                </button>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    container.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
                Search Results (${filteredStudents.length} student${filteredStudents.length !== 1 ? 's' : ''})
            </h3>
            <button onclick="document.getElementById('department-search').value=''; searchDepartmentStudents('${departmentName}')" 
                class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <i data-lucide="x" class="w-4 h-4"></i>
                Clear Search
            </button>
        </div>

        <!-- Students Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${filteredStudents.map(student => `
                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start gap-3 mb-3">
                        <img src="${student.profilePhoto}" alt="${student.fullName}" class="w-12 h-12 rounded-full">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-semibold text-gray-900 truncate">${student.fullName}</h4>
                            <p class="text-sm text-gray-500">${student.currentRollNumber || student.rollNumber}</p>
                            <p class="text-xs text-gray-400">Semester ${student.semester}</p>
                        </div>
                        <span class="badge badge-${student.status === 'active' ? 'success' : student.status === 'graduated' ? 'info' : 'warning'}">
                            ${student.status}
                        </span>
                    </div>
                    
                    <div class="space-y-2 text-sm mb-3">
                        <div class="flex items-center gap-2 text-gray-600">
                            <i data-lucide="hash" class="w-4 h-4"></i>
                            <span class="truncate">Reg: ${student.currentRegistrationNumber || student.registrationNumber}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                            <i data-lucide="mail" class="w-4 h-4"></i>
                            <span class="truncate">${student.email || 'N/A'}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                            <i data-lucide="phone" class="w-4 h-4"></i>
                            <span>${student.mobileStudent || student.phone || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <button onclick="navigateTo('/student/${student.id}')" 
                        class="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors text-sm font-medium">
                        View Details
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    
    lucide.createIcons();
}

window.renderDepartments = renderDepartments;
window.renderDepartmentView = renderDepartmentView;
window.addNewDepartment = addNewDepartment;
window.editDepartment = editDepartment;
window.selectDepartmentSemester = selectDepartmentSemester;
window.searchDepartmentStudents = searchDepartmentStudents;
window.exportDepartmentStudents = exportDepartmentStudents;
window.deleteDepartmentConfirm = deleteDepartmentConfirm;
window.selectDepartmentSemester = selectDepartmentSemester;
window.exportDepartmentStudents = exportDepartmentStudents;
