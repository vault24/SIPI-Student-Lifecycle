// departmentViewPage.js
// Extracted from app.js

(function() {
    'use strict';

async function renderDepartmentView(params) {
    const departmentId = params.id;
    
    // Try to get the department directly by ID first
    try {
        const dept = await dataManager.getDepartmentById(departmentId);
        
        if (!dept) {
            showToast('Department not found', 'error');
            navigateTo('/departments');
            return;
        }
        
        renderDepartmentContent(dept, departmentId);
    } catch (error) {
        console.error('Error loading department:', error);
        showToast('Error loading department: ' + error.message, 'error');
        navigateTo('/departments');
    }
}

async function renderDepartmentContent(dept, departmentId) {
    
    renderNavbar(dept.name);
    
    // Load semester data
    const semesterCounts = {};
    for (let sem = 1; sem <= 8; sem++) {
        const students = await dataManager.getStudentsByDepartmentAndSemester(departmentId, sem);
        semesterCounts[sem] = students.length;
    }
    
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
                        onkeyup="searchDepartmentStudents('${departmentId}')">
                </div>
            </div>

            <!-- Semester Tabs -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Semester</h3>
                <div id="semester-tabs" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    ${Array.from({ length: 8 }, (_, i) => i + 1).map(sem => `
                        <button onclick="selectDepartmentSemester('${departmentId}', ${sem})" 
                            class="semester-tab flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all ${sem === 1 ? 'border-blue-500 bg-blue-50' : ''}">
                            <div class="text-2xl font-bold text-gray-900">${sem}</div>
                            <div class="text-xs text-gray-500 mt-1">Semester</div>
                            <div class="text-sm font-medium text-blue-600 mt-2">${semesterCounts[sem]} students</div>
                        </button>
                    `).join('')}
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
    selectDepartmentSemester(departmentId, 1);
}

async function selectDepartmentSemester(departmentId, semester) {
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
    
    const students = await dataManager.getStudentsByDepartmentAndSemester(departmentId, semester);
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
                <button onclick="exportDepartmentStudents('${departmentId}', ${semester})" class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
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

async function searchDepartmentStudents(departmentId) {
    const searchTerm = document.getElementById('department-search').value.toLowerCase().trim();
    
    if (!searchTerm) {
        // If search is empty, show current semester students
        await selectDepartmentSemester(departmentId, currentDepartmentSemester);
        return;
    }
    
    // Search across all semesters in the department
    const allStudentsResponse = await dataManager.getStudents();
    const allStudents = allStudentsResponse.filter(s => s.department === departmentId);
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
                <button onclick="document.getElementById('department-search').value=''; searchDepartmentStudents('${departmentId}')" 
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
            <button onclick="document.getElementById('department-search').value=''; searchDepartmentStudents('${departmentId}')" 
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

// Export helper functions that are used by this page
window.renderDepartmentView = renderDepartmentView;
window.selectDepartmentSemester = selectDepartmentSemester;
window.searchDepartmentStudents = searchDepartmentStudents;
window.exportDepartmentStudents = exportDepartmentStudents;

    // Export to global scope
    window.DepartmentViewPage = {
        render: renderDepartmentView
    };

})();
