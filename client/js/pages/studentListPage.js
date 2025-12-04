// studentListPage.js
// Student List Page with Backend API Integration

(function() {
    'use strict';

    let currentPage = 1;
    let currentFilters = {
        search: '',
        semester: '',
        status: ''
    };

    async function renderStudentList() {
        renderNavbar('Student List');
        
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="max-w-7xl mx-auto">
                <!-- Hero Section -->
                <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl animate-fade-in-up">
                    <div class="flex items-start justify-between">
                        <div>
                            <h1 class="text-3xl font-bold mb-2">Student List</h1>
                            <p class="text-blue-100">Manage and view all students in the system</p>
                        </div>
                        <button onclick="navigateTo('/add-student')" class="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all backdrop-blur-sm border border-white/30 hover-lift">
                            <i data-lucide="user-plus" class="w-5 h-5"></i>
                            <span>Add Student</span>
                        </button>
                    </div>
                </div>

                <!-- Search and Filters -->
                <div class="glass-card p-6 mb-8 animate-fade-in-up">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="md:col-span-2">
                            <div class="relative">
                                <i data-lucide="search" class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input type="text" id="search-students" placeholder="Search by name, roll, or email..." class="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all">
                            </div>
                        </div>
                        <div>
                            <select id="filter-semester" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all">
                                <option value="" class="bg-slate-900">All Semesters</option>
                                ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" class="bg-slate-900">Semester ${s}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <select id="filter-status" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all">
                                <option value="" class="bg-slate-900">All Status</option>
                                <option value="active" class="bg-slate-900">Active</option>
                                <option value="graduated" class="bg-slate-900">Graduated</option>
                                <option value="discontinued" class="bg-slate-900">Discontinued</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Table Container -->
                <div id="table-container">
                    <!-- Table will be rendered here -->
                </div>

                <!-- Pagination -->
                <div id="pagination" class="mt-6 flex items-center justify-between">
                    <!-- Pagination will be rendered here -->
                </div>
            </div>
        `;
        
        lucide.createIcons();
        
        // Add event listeners
        document.getElementById('search-students').addEventListener('input', debounce(handleSearchChange, 300));
        document.getElementById('filter-semester').addEventListener('change', handleFilterChange);
        document.getElementById('filter-status').addEventListener('change', handleFilterChange);
        
        // Load initial data
        await loadStudents();
    }

    function handleSearchChange(e) {
        currentFilters.search = e.target.value;
        currentPage = 1; // Reset to first page
        loadStudents();
    }

    function handleFilterChange() {
        currentFilters.semester = document.getElementById('filter-semester').value;
        currentFilters.status = document.getElementById('filter-status').value;
        currentPage = 1; // Reset to first page
        loadStudents();
    }

    async function loadStudents() {
        const container = document.getElementById('table-container');
        
        // Show loading skeleton
        container.innerHTML = `
            <div class="animate-pulse space-y-3">
                ${Array(5).fill(0).map(() => `
                    <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div class="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                `).join('')}
            </div>
        `;
        
        try {
            // Build filter params
            const params = {
                page: currentPage
            };
            
            if (currentFilters.search) {
                params.search = currentFilters.search;
            }
            if (currentFilters.semester) {
                params.semester = currentFilters.semester;
            }
            if (currentFilters.status) {
                params.status = currentFilters.status;
            }
            
            // Fetch students from API
            const response = await backendAPI.students.getAll(params);
            
            // Render table
            renderTable(response.results || []);
            
            // Render pagination
            renderPagination(response);
            
        } catch (error) {
            handleAPIError(error);
            renderErrorState();
        }
    }

    function renderTable(students) {
        const container = document.getElementById('table-container');
        
        if (students.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="users" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                    <p class="text-gray-500 mb-4">Try adjusting your search or filters</p>
                    <button onclick="StudentListPage.clearFilters()" class="text-blue-600 hover:text-blue-700">
                        Clear filters
                    </button>
                </div>
            `;
            lucide.createIcons();
            return;
        }
        
        container.innerHTML = `
            <div class="glass-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-white/10 border-b border-white/10">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Student</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Roll Number</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Semester</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Department</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/10">
                            ${students.map((student, idx) => `
                                <tr class="hover:bg-white/5 transition-colors duration-200 stagger-${idx + 1} animate-fade-in-up">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center gap-3">
                                            <img src="${student.profilePhoto || 'https://via.placeholder.com/40'}" alt="${student.fullNameEnglish}" class="w-10 h-10 rounded-full object-cover ring-2 ring-white/20">
                                            <div>
                                                <div class="text-sm font-semibold text-white">${student.fullNameEnglish}</div>
                                                <div class="text-xs text-gray-400">${student.email || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${student.currentRollNumber}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Semester ${student.semester}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${student.department?.name || 'N/A'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold ${student.status === 'active' ? 'bg-green-500/20 text-green-400' : student.status === 'graduated' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}">
                                            ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="navigateTo('/student/${student.id}')" class="text-blue-400 hover:text-blue-300 transition-colors mr-3 flex items-center gap-1">
                                            <i data-lucide="eye" class="w-4 h-4"></i> View
                                        </button>
                                        <button onclick="StudentListPage.deleteStudent('${student.id}')" class="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                </table>
            </div>
        `;
        
        lucide.createIcons();
    }

    function renderPagination(response) {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;
        
        const totalCount = response.count || 0;
        const pageSize = 20; // Backend default
        const totalPages = Math.ceil(totalCount / pageSize);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        paginationContainer.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-700">
                    Showing page ${currentPage} of ${totalPages} (${totalCount} total)
                </span>
            </div>
            <div class="flex gap-2">
                <button 
                    onclick="StudentListPage.goToPage(${currentPage - 1})" 
                    ${!response.previous ? 'disabled' : ''}
                    class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                </button>
                <button 
                    onclick="StudentListPage.goToPage(${currentPage + 1})" 
                    ${!response.next ? 'disabled' : ''}
                    class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
        `;
    }

    function renderErrorState() {
        const container = document.getElementById('table-container');
        container.innerHTML = `
            <div class="text-center py-12">
                <i data-lucide="alert-circle" class="w-16 h-16 mx-auto mb-4 text-red-500"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to load students</h3>
                <p class="text-gray-500 mb-4">There was an error loading the student list</p>
                <button onclick="StudentListPage.render()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                    <i data-lucide="refresh-cw" class="w-4 h-4 inline mr-2"></i>
                    Retry
                </button>
            </div>
        `;
        lucide.createIcons();
    }

    async function deleteStudent(id) {
        if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            return;
        }
        
        try {
            await backendAPI.students.delete(id);
            showSuccessToast('Student deleted successfully');
            await loadStudents(); // Reload the list
        } catch (error) {
            handleAPIError(error);
        }
    }

    function goToPage(page) {
        if (page < 1) return;
        currentPage = page;
        loadStudents();
    }

    function clearFilters() {
        currentFilters = { search: '', semester: '', status: '' };
        currentPage = 1;
        document.getElementById('search-students').value = '';
        document.getElementById('filter-semester').value = '';
        document.getElementById('filter-status').value = '';
        loadStudents();
    }

    // Export to global scope
    window.StudentListPage = {
        render: renderStudentList,
        deleteStudent: deleteStudent,
        goToPage: goToPage,
        clearFilters: clearFilters
    };

})();
