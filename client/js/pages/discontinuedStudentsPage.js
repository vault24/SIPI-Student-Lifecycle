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
                <!-- Premium Page Header with Gradient -->
                <div class="glass-panel p-8 rounded-2xl backdrop-blur-md border border-white/20 mb-8 entrance-animation">
                    <h1 class="text-5xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">Discontinued Students</h1>
                    <p class="text-gray-600 dark:text-gray-400 text-lg">Manage and track students who have discontinued their studies</p>
                </div>

                <!-- Premium Search and Filter Bar -->
                <div class="glass-panel p-6 md:p-8 mb-8 rounded-2xl backdrop-blur-md border border-white/20 entrance-animation">
                    <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Search & Filter</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Search -->
                        <div class="md:col-span-2">
                            <div class="relative">
                                <input 
                                    type="text" 
                                    id="search-input"
                                    placeholder="Search by name, roll number..." 
                                    class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white text-sm font-medium transition-all"
                                >
                                <i data-lucide="search" class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                            </div>
                        </div>

                        <!-- Department Filter -->
                        <div>
                            <select 
                                id="department-filter"
                                class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white text-sm font-medium transition-all"
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
                <div class="glass-panel rounded-2xl backdrop-blur-md border border-white/20 overflow-hidden entrance-animation">
                    <div id="students-table-container">
                        <!-- Table will be inserted here -->
                    </div>
                </div>
            </div>
        `;
    },

    loadStudents: async function() {
        // Show loading state with premium styling
        const container = document.getElementById('students-table-container');
        container.innerHTML = `
            <div class="text-center py-16">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600 mx-auto mb-4"></div>
                <p class="text-gray-600 dark:text-gray-400 mt-4 text-lg font-medium">Loading discontinued students...</p>
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
                <div class="p-12 text-center">
                    <div class="w-20 h-20 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="alert-circle" class="w-10 h-10 text-red-600"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Students</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Failed to load discontinued students</p>
                    <button 
                        onclick="DiscontinuedStudentsPage.loadStudents()"
                        class="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all font-semibold transform hover:scale-105 shadow-lg"
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
                <div class="p-16 text-center">
                    <div class="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="user-x" class="w-10 h-10 text-gray-500 dark:text-gray-400"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Discontinued Students Found</h3>
                    <p class="text-gray-600 dark:text-gray-400">There are no students matching your search criteria.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }
        
        // Desktop table view with premium styling
        const tableHTML = `
            <div class="hidden md:block overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gradient-to-r from-red-500/10 to-pink-500/10 dark:from-gray-800/50 dark:to-gray-700/50 border-b border-white/20 dark:border-gray-600">
                        <tr>
                            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Photo</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Roll Number</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Department</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Last Semester</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        ${students.map(student => DiscontinuedStudentsPage.getStudentRowHTML(student)).join('')}
                    </tbody>
                </table>
            </div>
            
            <!-- Mobile card view -->
            <div class="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
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
            <tr class="hover:bg-red-50/50 dark:hover:bg-gray-800/50 transition-all duration-300 border-b border-gray-200 dark:border-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                    <img src="${photoUrl}" alt="${fullName}" class="w-12 h-12 rounded-full object-cover shadow-md border-2 border-red-200 dark:border-red-900">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-gray-900 dark:text-white">${fullName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-700 dark:text-gray-300 font-medium">${rollNumber}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-700 dark:text-gray-300">${departmentName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-700 dark:text-gray-300 font-medium">${lastSemester}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-600 dark:text-gray-400">${reason}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-4 py-2 inline-flex text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                        Discontinued
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                        onclick="DiscontinuedStudentsPage.viewStudent('${student.id}')"
                        class="px-3 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300 mr-2"
                    >
                        <i data-lucide="eye" class="w-4 h-4 inline"></i> View
                    </button>
                    <button 
                        onclick="DiscontinuedStudentsPage.reinstateStudent('${student.id}')"
                        class="px-3 py-2 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded-lg transition-all duration-300"
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
            <div class="premium-card p-6 m-4 rounded-xl backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 entrance-animation">
                <div class="flex items-start gap-4">
                    <img src="${photoUrl}" alt="${fullName}" class="w-16 h-16 rounded-full flex-shrink-0 object-cover shadow-md border-2 border-red-200 dark:border-red-900">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">${fullName}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Roll: ${rollNumber}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${departmentName}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Last Semester: ${lastSemester}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Reason: ${reason}</p>
                        <span class="px-4 py-2 inline-flex text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 mb-3">
                            Discontinued
                        </span>
                        <div class="flex gap-2 mt-4">
                            <button 
                                onclick="DiscontinuedStudentsPage.viewStudent('${student.id}')"
                                class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 text-sm font-semibold transform hover:scale-105"
                            >
                                <i data-lucide="eye" class="w-4 h-4 inline mr-1"></i> View
                            </button>
                            <button 
                                onclick="DiscontinuedStudentsPage.reinstateStudent('${student.id}')"
                                class="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300 text-sm font-semibold transform hover:scale-105"
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
