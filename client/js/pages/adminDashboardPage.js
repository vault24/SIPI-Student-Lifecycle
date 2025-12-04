/**
 * Admin Dashboard
 * Manage signup requests, admin info, and system settings
 */

(function() {
    'use strict';

    async function renderAdminDashboard() {
        renderNavbar('Admin Dashboard');
        
        const mainContent = document.getElementById('main-content');
        
        // Check if user is admin
        if (!window.authMiddleware || !window.authMiddleware.isAdmin()) {
            mainContent.innerHTML = `
                <div class="glass-card p-12 text-center max-w-md mx-auto mt-12 animate-fade-in-up">
                    <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="alert-circle" class="w-8 h-8 text-red-400"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p class="text-gray-400 mb-6">You don't have permission to access this page.</p>
                    <button onclick="navigateTo('/')" class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover-lift font-medium mx-auto">
                        <i data-lucide="arrow-left" class="w-5 h-5"></i>
                        Back to Dashboard
                    </button>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        // Show loading
        showLoadingSkeleton('main-content', 'admin', 2);
        
        try {
            const user = window.authMiddleware.getCurrentUser();
            const pendingRequests = await authService.getPendingRequests();
            
            mainContent.innerHTML = `
                <!-- Admin Info Section -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <!-- Admin Profile -->
                    <div class="glass-card p-6 animate-fade-in-up">
                        <h2 class="text-xl font-bold text-white mb-4">Admin Profile</h2>
                        <div class="space-y-4">
                            <div>
                                <p class="text-sm text-gray-400">Name</p>
                                <p class="text-lg font-semibold text-white">${user?.name || 'Admin'}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-400">Email</p>
                                <p class="text-lg font-semibold text-white">${user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-400">Role</p>
                                <p class="text-lg font-semibold text-white capitalize">${user?.role || 'N/A'}</p>
                            </div>
                            <button onclick="navigateTo('/admin/edit')" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                <i data-lucide="edit" class="w-4 h-4"></i>
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <!-- System Stats -->
                    <div class="glass-card p-6 animate-fade-in-up stagger-1">
                        <h2 class="text-xl font-bold text-white mb-4">System Stats</h2>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <span class="text-gray-400">Pending Requests</span>
                                <span class="text-2xl font-bold text-yellow-400">${pendingRequests?.length || 0}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <span class="text-gray-400">Total Users</span>
                                <span class="text-2xl font-bold text-blue-400">--</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <span class="text-gray-400">Active Sessions</span>
                                <span class="text-2xl font-bold text-green-400">1</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pending Signup Requests -->
                <div class="glass-card p-6 animate-fade-in-up stagger-2">
                    <h2 class="text-xl font-bold text-white mb-4">Pending Signup Requests</h2>
                    <div id="pending-requests-container" class="space-y-4">
                        <!-- Requests will be loaded here -->
                    </div>
                </div>
            `;
            
            lucide.createIcons();
            
            // Load pending requests
            await loadPendingRequests(pendingRequests);
            
        } catch (error) {
            console.error('Error loading admin dashboard:', error);
            mainContent.innerHTML = `
                <div class="glass-card p-12 text-center max-w-md mx-auto mt-12 animate-fade-in-up">
                    <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="alert-circle" class="w-8 h-8 text-red-400"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h2>
                    <p class="text-gray-400 mb-6">${error.message}</p>
                    <button onclick="location.reload()" class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover-lift font-medium mx-auto">
                        <i data-lucide="refresh-cw" class="w-5 h-5"></i>
                        Retry
                    </button>
                </div>
            `;
            lucide.createIcons();
        }
    }

    async function loadPendingRequests(requests) {
        const container = document.getElementById('pending-requests-container');
        
        if (!requests || requests.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="check-circle" class="w-12 h-12 text-green-400 mx-auto mb-2"></i>
                    <p class="text-gray-400">No pending requests</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        container.innerHTML = requests.map((req, idx) => `
            <div class="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors animate-fade-in-up stagger-${idx + 1}">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <h3 class="font-semibold text-white">${req.name}</h3>
                        <p class="text-sm text-gray-400">${req.email}</p>
                    </div>
                    <span class="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                        ${req.role}
                    </span>
                </div>
                <p class="text-sm text-gray-400 mb-4">Requested: ${new Date(req.created_at).toLocaleDateString()}</p>
                <div class="flex gap-2">
                    <button onclick="approveRequest('${req.id}')" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="check" class="w-4 h-4"></i>
                        Approve
                    </button>
                    <button onclick="rejectRequest('${req.id}')" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="x" class="w-4 h-4"></i>
                        Reject
                    </button>
                </div>
            </div>
        `).join('');
        
        lucide.createIcons();
    }

    async function approveRequest(requestId) {
        try {
            await authService.approveRequest(requestId);
            showToast('Request approved!', 'success');
            renderAdminDashboard();
        } catch (error) {
            showToast('Failed to approve request', 'error');
        }
    }

    async function rejectRequest(requestId) {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;

        try {
            await authService.rejectRequest(requestId, reason);
            showToast('Request rejected!', 'success');
            renderAdminDashboard();
        } catch (error) {
            showToast('Failed to reject request', 'error');
        }
    }

    window.renderAdminDashboard = renderAdminDashboard;
    window.approveRequest = approveRequest;
    window.rejectRequest = rejectRequest;

    window.AdminDashboardPage = {
        render: renderAdminDashboard
    };

})();
