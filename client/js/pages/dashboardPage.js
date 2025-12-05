// Dashboard Page Module
// Handles the main dashboard view with statistics and recent activity

(function() {
    'use strict';

    /**
     * Render the dashboard page with premium components
     */
    async function render() {
        renderNavbar('Dashboard');
        
        const mainContent = document.getElementById('main-content');
        
        // Show loading skeleton
        showLoadingSkeleton('main-content', 'stats', 4);
        
        try {
            // Fetch dashboard stats from API
            const stats = await backendAPI.dashboard.getStats();
            
            // Extract data
            const totalStudents = stats.students?.total || 0;
            const activeStudents = stats.students?.active || 0;
            const totalAlumni = stats.alumni?.total || 0;
            const totalDocuments = stats.students?.total || 0; // Placeholder
            
            // Create premium stat cards
            const statCards = [
                new PremiumCard({
                    title: 'Total Students',
                    value: totalStudents,
                    icon: 'users',
                    color: 'blue',
                    gradient: 'primary',
                    trend: { value: 12, direction: 'up' }
                }),
                new PremiumCard({
                    title: 'Active Students',
                    value: activeStudents,
                    icon: 'user-check',
                    color: 'green',
                    gradient: 'success',
                    trend: { value: 8, direction: 'up' }
                }),
                new PremiumCard({
                    title: 'Alumni',
                    value: totalAlumni,
                    icon: 'graduation-cap',
                    color: 'purple',
                    gradient: 'secondary',
                    trend: { value: 5, direction: 'up' }
                }),
                new PremiumCard({
                    title: 'Documents',
                    value: totalDocuments,
                    icon: 'file-text',
                    color: 'cyan',
                    gradient: 'accent',
                    trend: { value: 3, direction: 'down' }
                })
            ];
            
            // Render content
            mainContent.innerHTML = `
                <!-- Hero Section with Gradient -->
                <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl animate-fade-in-up">
                    <div class="flex items-start justify-between">
                        <div>
                            <h1 class="text-4xl font-bold mb-3 border-b-4 border-white pb-2 inline-block">SIPI Student Lifecycle Manager</h1>
                            <p class="text-blue-100 text-lg">Comprehensive student information management from admission to graduation and beyond</p>
                        </div>
                        <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <i data-lucide="zap" class="w-8 h-8 text-white"></i>
                        </div>
                    </div>
                </div>

                <!-- Stats Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    ${statCards.map((card, idx) => `
                        <div class="stagger-${idx + 1}">
                            ${card.render()}
                        </div>
                    `).join('')}
                </div>

                <!-- Quick Actions -->
                <div class="glass-card p-6 mb-8 animate-fade-in-up stagger-2">
                    <h2 class="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <button onclick="navigateTo('/add-student')" class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 hover-lift font-medium">
                            <i data-lucide="user-plus" class="w-5 h-5"></i>
                            <span class="border-b-2 border-white">Add Student</span>
                        </button>
                        <button onclick="navigateTo('/students')" class="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-lg transition-all duration-200 hover-lift font-medium">
                            <i data-lucide="users" class="w-5 h-5"></i>
                            <span class="border-b-2 border-white">View Students</span>
                        </button>
                        <button onclick="navigateTo('/departments')" class="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg transition-all duration-200 hover-lift font-medium">
                            <i data-lucide="building-2" class="w-5 h-5"></i>
                            <span class="border-b-2 border-white">Departments</span>
                        </button>
                        <button onclick="navigateTo('/documents')" class="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-6 py-3 rounded-lg transition-all duration-200 hover-lift font-medium">
                            <i data-lucide="file-text" class="w-5 h-5"></i>
                            <span class="border-b-2 border-white">Documents</span>
                        </button>
                    </div>
                </div>

                <!-- Analytics Charts -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in-up stagger-3">
                    <!-- Attendance Overview Chart -->
                    <div class="glass-card p-6">
                        <h2 class="text-xl font-bold text-white mb-4">Semester-wise Attendance Overview</h2>
                        <div id="attendance-chart-container" class="relative" style="height: 300px;">
                            <canvas id="dashboard-attendance-chart"></canvas>
                        </div>
                        <div id="attendance-chart-error" class="hidden text-center py-8">
                            <p class="text-gray-400">Unable to load attendance data</p>
                        </div>
                    </div>

                    <!-- Department Distribution Chart -->
                    <div class="glass-card p-6">
                        <h2 class="text-xl font-bold text-white mb-4">Department-wise Student Distribution</h2>
                        <div id="dept-chart-container" class="relative" style="height: 300px;">
                            <canvas id="dashboard-dept-chart"></canvas>
                        </div>
                        <div id="dept-chart-error" class="hidden text-center py-8">
                            <p class="text-gray-400">Unable to load department data</p>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="glass-card p-6 animate-fade-in-up stagger-4">
                    <h2 class="text-xl font-bold text-white mb-4">Recent Activity</h2>
                    <div id="recent-activity-container" class="space-y-3">
                        <!-- Will be loaded separately -->
                    </div>
                </div>
            `;
            
            lucide.createIcons();
            
            // Initialize micro charts for stat cards
            statCards.forEach((card, idx) => {
                setTimeout(() => {
                    card.initMicroChart(`stats-card-${idx}`);
                }, 100);
            });
            
            // Load charts and recent activity
            await loadAttendanceChart();
            await loadDepartmentDistributionChart(stats);
            await loadRecentActivity();
            
        } catch (error) {
            handleAPIError(error);
            renderErrorState();
        }
    }

    /**
     * Load and render attendance chart
     * @private
     */
    async function loadAttendanceChart() {
        const container = document.getElementById('attendance-chart-container');
        const errorContainer = document.getElementById('attendance-chart-error');
        
        if (!container) return;
        
        try {
            // Generate mock attendance data (8 semesters with average percentages)
            const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
            const attendancePercentages = [85, 88, 82, 90, 87, 89, 84, 86];

            // Initialize attendance chart
            const chart = new AttendanceChart({
                containerId: 'dashboard-attendance-chart',
                semesters: semesters,
                attendancePercentages: attendancePercentages
            });

            // Hide error message if shown
            if (errorContainer) {
                errorContainer.classList.add('hidden');
            }

        } catch (error) {
            console.error('Error loading attendance chart:', error);
            if (errorContainer) {
                errorContainer.classList.remove('hidden');
            }
            if (container) {
                container.classList.add('hidden');
            }
        }
    }

    /**
     * Load and render department distribution chart
     * @private
     */
    async function loadDepartmentDistributionChart(stats) {
        const container = document.getElementById('dept-chart-container');
        const errorContainer = document.getElementById('dept-chart-error');
        
        if (!container) return;
        
        try {
            // Extract department data from stats
            const deptStats = stats.students?.byDepartment || [];
            
            if (!deptStats || deptStats.length === 0) {
                console.warn('No department data available yet');
                if (errorContainer) {
                    errorContainer.classList.remove('hidden');
                }
                return;
            }

            // Transform data for chart
            const departments = deptStats.map(dept => dept.department__name || 'Unknown');
            const studentCounts = deptStats.map(dept => dept.count || 0);

            // Initialize department distribution chart
            const chart = new DepartmentDistributionChart({
                containerId: 'dashboard-dept-chart',
                departments: departments,
                studentCounts: studentCounts
            });

            // Hide error message if shown
            if (errorContainer) {
                errorContainer.classList.add('hidden');
            }

        } catch (error) {
            console.error('Error loading department distribution chart:', error);
            if (errorContainer) {
                errorContainer.classList.remove('hidden');
            }
            if (container) {
                container.classList.add('hidden');
            }
        }
    }

    /**
     * Load recent activity with premium styling
     * @private
     */
    async function loadRecentActivity() {
        const container = document.getElementById('recent-activity-container');
        if (!container) return;
        
        try {
            // Fetch recent students
            const response = await backendAPI.students.getAll({ 
                ordering: '-createdAt',
                page: 1 
            });
            
            const students = response.results?.slice(0, 5) || [];
            
            if (students.length === 0) {
                container.innerHTML = '<p class="text-gray-400 text-center py-8">No recent activity</p>';
                return;
            }
            
            container.innerHTML = students.map((student, idx) => {
                const statusColors = {
                    active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' },
                    graduated: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Graduated' },
                    discontinued: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Discontinued' }
                };
                const status = statusColors[student.status] || statusColors.active;
                
                return `
                    <div class="flex items-center gap-4 p-4 hover:bg-white/5 rounded-lg transition-all duration-200 border border-white/5 hover:border-white/10 stagger-${idx + 1} animate-fade-in-up">
                        <img src="${student.profilePhoto || 'https://via.placeholder.com/40'}" alt="${student.fullNameEnglish}" class="w-10 h-10 rounded-full object-cover ring-2 ring-white/20">
                        <div class="flex-1">
                            <p class="text-sm font-semibold text-white">${student.fullNameEnglish}</p>
                            <p class="text-xs text-gray-400">Roll: ${student.currentRollNumber}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} border border-white/10">
                            ${status.label}
                        </span>
                    </div>
                `;
            }).join('');
            
        } catch (error) {
            container.innerHTML = '<p class="text-gray-400 text-center py-8">Unable to load recent activity</p>';
        }
    }

    /**
     * Render error state with retry button
     * @private
     */
    function renderErrorState() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="glass-card p-12 text-center max-w-md mx-auto mt-12 animate-fade-in-up">
                <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="alert-circle" class="w-8 h-8 text-red-400"></i>
                </div>
                <h2 class="text-2xl font-bold text-white mb-2">Unable to Load Dashboard</h2>
                <p class="text-gray-400 mb-6">There was an error loading the dashboard data.</p>
                <button onclick="DashboardPage.render()" class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover-lift font-medium mx-auto">
                    <i data-lucide="refresh-cw" class="w-5 h-5"></i>
                    Retry
                </button>
            </div>
        `;
        lucide.createIcons();
    }

    // Export to global scope
    window.DashboardPage = {
        render: render
    };

})();
