// Discontinued Students Page Module

const DiscontinuedStudentsPage = {
    currentFilters: {
        search: '',
        department: ''
    },

    render: async function() {
        console.log('Rendering Discontinued Students Page');
        
        // Update navbar title
        renderNavbar('Discontinued Students');
        
        // Get main content area
        const mainContent = document.getElementById('main-content');
        
        // Render page
        mainContent.innerHTML = await DiscontinuedStudentsPage.getPageHTML();
        
        // Load and display students
        await DiscontinuedStudentsPage.loadStudents();
        
        // Attach event listeners
        DiscontinuedStudentsPage.attachEventListeners();
        
        // Initialize Lucide icons
        lucide.createIcons();
    },

    getPageHTML: async function() {
        const departments = await dataManager.getDepartments();
        
        return `
            <div class="max-w-7xl mx-auto">
                <!-- Page Header -->
                <div class="mb-6">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Discontinued Students</h1>
                    <p class="text-gray-600">Students who have discontinued their studies</p>
                </div>

                <!-- Search and Filter Bar -->
                <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Search -->
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div class="relative">
                                <input 
                                    type="text" 
                                    id="search-input"
                                    placeholder="Search by name, roll number..." 
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                <i data-lucide="search" class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                            </div>
                        </div>

                        <!-- Department Filter -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                            <select 
                                id="department-filter"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Departments</option>
                                ${departments.map(dept => `
                                    <option value="${dept.id}">${dept.name}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Students Table -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div id="students-table-container">
                        <!-- Table will be inserted here -->
                    </div>
                </div>
            </div>
        `;
    },

    loadStudents: async function() {
        // Show loading state
        const container = document.getElementById('students-table-container');
        container.innerHTML = `
            <div class="text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p class="text-gray-600 mt-4">Loading discontinued students...</p>
            </div>
        `;
        
        try {
            // Build filters for API call
            const filters = {
                status: 'discontinued'
            };
            
            if (DiscontinuedStudentsPage.currentFilters.search) {
                filters.search = DiscontinuedStudentsPage.currentFilters.search;
            }
            
            if (DiscontinuedStudentsPage.currentFilters.department) {
                filters.department = DiscontinuedStudentsPage.currentFilters.department;
            }
            
            // Fetch students from backend
            const students = await dataManager.getStudents(filters);
            
            // Display students
            DiscontinuedStudentsPage.displayStudents(students);
        } catch (error) {
            handleAPIError(error);
            container.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="alert-circle" class="w-16 h-16 text-red-300 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Students</h3>
                    <p class="text-gray-600 mb-4">Failed to load discontinued students</p>
                    <button 
                        onclick="DiscontinuedStudentsPage.loadStudents()"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            `;
            lucide.createIcons();
        }
    },

    displayStudents: function(students) {
        const container = document.getElementById('students-table-container');
        
        if (students.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="user-x" class="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No Discontinued Students Found</h3>
                    <p class="text-gray-600">There are no students matching your search criteria.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }
        
        // Desktop table view
        const tableHTML = `
            <div class="hidden md:block overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Semester</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${students.map(student => DiscontinuedStudentsPage.getStudentRowHTML(student)).join('')}
                    </tbody>
                </table>
            </div>
            
            <!-- Mobile card view -->
            <div class="md:hidden divide-y divide-gray-200">
                ${students.map(student => DiscontinuedStudentsPage.getStudentCardHTML(student)).join('')}
            </div>
        `;
        
        container.innerHTML = tableHTML;
        lucide.createIcons();
    },

    getStudentRowHTML: function(student) {
        const photoUrl = student.profilePhoto ? `/assets/images/${student.profilePhoto}` : 'https://via.placeholder.com/40';
        const fullName = student.fullNameEnglish || student.fullName || 'N/A';
        const rollNumber = student.currentRollNumber || student.rollNumber || 'N/A';
        const departmentName = student.department?.name || student.department || 'N/A';
        const lastSemester = student.lastSemester || student.semester || 'N/A';
        const reason = student.discontinuedReason || 'Not specified';
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <img src="${photoUrl}" alt="${fullName}" class="w-10 h-10 rounded-full object-cover">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${fullName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${rollNumber}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${departmentName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${lastSemester}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-600">${reason}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Discontinued
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                        onclick="DiscontinuedStudentsPage.viewStudent('${student.id}')"
                        class="text-blue-600 hover:text-blue-900 mr-3"
                    >
                        <i data-lucide="eye" class="w-4 h-4 inline"></i> View
                    </button>
                    <button 
                        onclick="DiscontinuedStudentsPage.reinstateStudent('${student.id}')"
                        class="text-green-600 hover:text-green-900"
                    >
                        <i data-lucide="user-check" class="w-4 h-4 inline"></i> Reinstate
                    </button>
                </td>
            </tr>
        `;
    },

    getStudentCardHTML: function(student) {
        const photoUrl = student.profilePhoto ? `/assets/images/${student.profilePhoto}` : 'https://via.placeholder.com/64';
        const fullName = student.fullNameEnglish || student.fullName || 'N/A';
        const rollNumber = student.currentRollNumber || student.rollNumber || 'N/A';
        const departmentName = student.department?.name || student.department || 'N/A';
        const lastSemester = student.lastSemester || student.semester || 'N/A';
        const reason = student.discontinuedReason || 'Not specified';
        
        return `
            <div class="p-4">
                <div class="flex items-start gap-4">
                    <img src="${photoUrl}" alt="${fullName}" class="w-16 h-16 rounded-full flex-shrink-0 object-cover">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-medium text-gray-900 mb-1">${fullName}</h3>
                        <p class="text-sm text-gray-600 mb-2">Roll: ${rollNumber}</p>
                        <p class="text-sm text-gray-600 mb-2">${departmentName}</p>
                        <p class="text-sm text-gray-600 mb-2">Last Semester: ${lastSemester}</p>
                        <p class="text-sm text-gray-600 mb-3">Reason: ${reason}</p>
                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 mb-3">
                            Discontinued
                        </span>
                        <div class="flex gap-2 mt-3">
                            <button 
                                onclick="DiscontinuedStudentsPage.viewStudent('${student.id}')"
                                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                                <i data-lucide="eye" class="w-4 h-4 inline mr-1"></i> View
                            </button>
                            <button 
                                onclick="DiscontinuedStudentsPage.reinstateStudent('${student.id}')"
                                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                                <i data-lucide="user-check" class="w-4 h-4 inline mr-1"></i> Reinstate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    attachEventListeners: function() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                DiscontinuedStudentsPage.currentFilters.search = e.target.value;
                DiscontinuedStudentsPage.loadStudents();
            });
        }
        
        // Department filter
        const departmentFilter = document.getElementById('department-filter');
        if (departmentFilter) {
            departmentFilter.addEventListener('change', (e) => {
                DiscontinuedStudentsPage.currentFilters.department = e.target.value;
                DiscontinuedStudentsPage.loadStudents();
            });
        }
    },

    viewStudent: function(studentId) {
        navigateTo(`/student/${studentId}`);
    },

    reinstateStudent: async function(studentId) {
        try {
            const student = await dataManager.getStudent(studentId);
            if (!student) {
                showErrorToast('Student not found');
                return;
            }
            
            const fullName = student.fullNameEnglish || 'this student';
            
            showConfirmModal({
                title: 'Reinstate Student',
                message: `Are you sure you want to reinstate ${fullName}? This will change their status back to "active".`,
                confirmText: 'Reinstate',
                cancelText: 'Cancel',
                type: 'info',
                onConfirm: async () => {
                    try {
                        // Update student status
                        await dataManager.updateStudent(studentId, {
                            status: 'active',
                            discontinuedReason: '',
                            lastSemester: null
                        });
                        
                        showSuccessToast(`${fullName} has been reinstated successfully`);
                        // Reload the page
                        await DiscontinuedStudentsPage.loadStudents();
                    } catch (error) {
                        handleAPIError(error);
                    }
                }
            });
        } catch (error) {
            handleAPIError(error);
        }
    }
};

// Export
window.DiscontinuedStudentsPage = DiscontinuedStudentsPage;
