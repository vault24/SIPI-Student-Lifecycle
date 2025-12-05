// Reusable UI Components for SLMS

// Sidebar Component - Premium Redesign
function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    
    // Grouped navigation items
    const navigationSections = [
        {
            label: 'Main',
            items: [
                { icon: 'home', label: 'Dashboard', path: '/' },
                { icon: 'layout-dashboard', label: 'Admin Dashboard', path: '/admin' }
            ]
        },
        {
            label: 'Management',
            items: [
                { icon: 'user-plus', label: 'Add Student', path: '/add-student' },
                { icon: 'users', label: 'Student List', path: '/students' },
                { icon: 'building-2', label: 'Departments', path: '/departments' },
                { icon: 'graduation-cap', label: 'Alumni', path: '/alumni' },
                { icon: 'user-x', label: 'Discontinued', path: '/discontinued' }
            ]
        },
        {
            label: 'Resources',
            items: [
                { icon: 'file-text', label: 'Documents', path: '/documents' },
                { icon: 'download', label: 'Download Documents', path: '/download-documents', isShortcut: true },
                { icon: 'bar-chart', label: 'Marks & Attendance', path: '/marks' },
                { icon: 'send', label: 'Submit Application', path: '/apply' },
                { icon: 'file-check', label: 'Applications', path: '/applications' }
            ]
        }
    ];
    
    sidebar.innerHTML = `
        <div class="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800">
            <!-- Logo Section with Gradient -->
            <div class="p-6 border-b border-white/10 glass-panel-strong">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <i data-lucide="zap" class="w-6 h-6 text-white"></i>
                    </div>
                    <div>
                        <h2 class="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">SIPI</h2>
                        <p class="text-xs text-gray-400">Lifecycle Manager</p>
                    </div>
                </div>
            </div>
            
            <!-- Navigation Sections -->
            <nav class="flex-1 p-4 overflow-y-auto space-y-6">
                ${navigationSections.map((section, idx) => `
                    <div class="nav-section">
                        <p class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            ${section.label}
                        </p>
                        <ul class="space-y-1">
                            ${section.items.map(item => {
                                if (item.isShortcut) {
                                    return `
                                        <li>
                                            <a href="#${item.path}" 
                                               data-nav-link
                                               class="flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg hover:bg-green-500/20 transition-all duration-200 ease-in-out group relative border-l-2 border-green-500/50 hover:border-green-500 min-h-[44px]"
                                               title="${item.label}">
                                                <i data-lucide="${item.icon}" class="w-5 h-5 flex-shrink-0 text-green-400 group-hover:text-green-300 transition-colors"></i>
                                                <span class="flex-1 text-sm font-medium group-hover:text-white transition-colors">${item.label}</span>
                                                <span class="ml-auto text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded-full">Quick</span>
                                                <!-- Tooltip -->
                                                <div class="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                                    ${item.label}
                                                </div>
                                            </a>
                                        </li>
                                    `;
                                } else {
                                    return `
                                        <li>
                                            <a href="#${item.path}" 
                                               data-nav-link
                                               class="flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg hover:bg-white/10 transition-all duration-200 ease-in-out group relative min-h-[44px]"
                                               title="${item.label}">
                                                <i data-lucide="${item.icon}" class="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-blue-400 transition-colors"></i>
                                                <span class="flex-1 text-sm font-medium group-hover:text-white transition-colors">${item.label}</span>
                                                <!-- Tooltip -->
                                                <div class="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                                    ${item.label}
                                                </div>
                                            </a>
                                        </li>
                                    `;
                                }
                            }).join('')}
                        </ul>
                    </div>
                `).join('')}
            </nav>
            
            <!-- User Profile Card with Gradient -->
            <div class="p-4 border-t border-white/10 glass-panel-strong">
                <div class="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        A
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-white truncate">Admin User</p>
                        <p class="text-xs text-gray-400 truncate">admin@slms.edu</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    lucide.createIcons();
}

// Navbar Component - Premium Redesign
function renderNavbar(pageTitle = 'Dashboard') {
    const navbar = document.getElementById('navbar');
    
    navbar.innerHTML = `
        <div class="glass-navbar sticky top-0 z-40 border-b border-white/10">
            <div class="flex items-center justify-between px-6 py-4">
                <!-- Left: Menu toggle and title -->
                <div class="flex items-center gap-4">
                    <button onclick="toggleSidebar()" class="lg:hidden text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <i data-lucide="menu" class="w-6 h-6"></i>
                    </button>
                    <h1 class="text-2xl font-bold text-white">${pageTitle}</h1>
                </div>
                
                <!-- Right: Controls and user menu -->
                <div class="flex items-center gap-3">
                    <!-- Dark Mode Toggle -->
                    <div id="dark-mode-container" class="flex items-center">
                        <!-- Dark mode toggle will be inserted here -->
                    </div>
                    
                    <!-- Notifications Container -->
                    <div id="notification-bell-container"></div>
                    
                    <!-- User Menu -->
                    <div class="relative">
                        <button onclick="toggleUserMenu()" class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                A
                            </div>
                            <i data-lucide="chevron-down" class="w-4 h-4"></i>
                        </button>
                        
                        <!-- Dropdown Menu -->
                        <div id="user-menu" class="hidden absolute right-0 mt-2 w-48 glass-modal rounded-lg border border-white/10 py-1 z-50 animate-fade-in-down">
                            <a href="#/admin" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                                <i data-lucide="settings" class="w-4 h-4"></i>
                                Settings
                            </a>
                            <div class="border-t border-white/10"></div>
                            <a href="#/login" onclick="logout()" class="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                                <i data-lucide="log-out" class="w-4 h-4"></i>
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    lucide.createIcons();
    
    // Initialize dark mode toggle
    setTimeout(() => {
        const container = document.getElementById('dark-mode-container');
        if (container && window.DarkModeToggle) {
            const toggle = new DarkModeToggle({ size: 'md' });
            container.innerHTML = toggle.render();
            toggle.init();
            window.darkModeToggle = toggle;
            lucide.createIcons();
        }
    }, 100);
    
    // Initialize notification bell
    setTimeout(() => {
        const bellContainer = document.getElementById('notification-bell-container');
        if (bellContainer) {
            if (typeof NotificationBell !== 'undefined') {
                if (window.notificationBell) {
                    window.notificationBell.destroy();
                }
                window.notificationBell = new NotificationBell();
                window.notificationBell.init();
                lucide.createIcons();
                console.log('✅ Notification bell initialized');
            } else {
                console.warn('⚠️ NotificationBell class not found');
            }
        } else {
            console.warn('⚠️ Notification bell container not found');
        }
    }, 150);
}

// Toggle sidebar on mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    
    if (window.innerWidth < 1024) {
        sidebar.classList.toggle('-translate-x-full');
        backdrop.classList.toggle('active');
        
        // Prevent body scroll when sidebar is open
        if (sidebar.classList.contains('-translate-x-full')) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }
}

// Toggle user menu
function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    menu.classList.toggle('hidden');
}

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('user-menu');
    if (menu && !e.target.closest('[onclick="toggleUserMenu()"]') && !menu.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

// Close sidebar when clicking backdrop
document.addEventListener('DOMContentLoaded', () => {
    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.add('-translate-x-full');
            backdrop.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
});

// Close sidebar after navigation on mobile
function closeSidebarAfterNav() {
    if (window.innerWidth < 1024) {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Hook into navigation links
document.addEventListener('click', (e) => {
    const navLink = e.target.closest('[data-nav-link]');
    if (navLink) {
        closeSidebarAfterNav();
    }
});

// Stat Card Component
function createStatCard({ title, value, icon, color = 'blue', trend = null }) {
    const trendHTML = trend ? `
        <div class="flex items-center gap-1 text-sm ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}">
            <i data-lucide="${trend.direction === 'up' ? 'trending-up' : 'trending-down'}" class="w-4 h-4"></i>
            <span>${trend.value}%</span>
        </div>
    ` : '';
    
    return `
        <div class="bg-white rounded-xl shadow-sm p-6 card-hover">
            <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center">
                    <i data-lucide="${icon}" class="w-6 h-6 text-${color}-600"></i>
                </div>
                ${trendHTML}
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-1">${value}</h3>
            <p class="text-sm text-gray-600">${title}</p>
        </div>
    `;
}

// Loading Skeleton Component
function createSkeleton(type = 'card', count = 1) {
    const skeletons = [];
    
    for (let i = 0; i < count; i++) {
        if (type === 'card') {
            skeletons.push(`
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="skeleton h-12 w-12 rounded-lg mb-4"></div>
                    <div class="skeleton h-8 w-24 rounded mb-2"></div>
                    <div class="skeleton h-4 w-32 rounded"></div>
                </div>
            `);
        } else if (type === 'table') {
            skeletons.push(`
                <tr>
                    <td class="px-6 py-4"><div class="skeleton h-4 w-full rounded"></div></td>
                    <td class="px-6 py-4"><div class="skeleton h-4 w-full rounded"></div></td>
                    <td class="px-6 py-4"><div class="skeleton h-4 w-full rounded"></div></td>
                    <td class="px-6 py-4"><div class="skeleton h-4 w-full rounded"></div></td>
                </tr>
            `);
        } else if (type === 'list') {
            skeletons.push(`
                <div class="flex items-center gap-4 p-4 bg-white rounded-lg">
                    <div class="skeleton h-12 w-12 rounded-full"></div>
                    <div class="flex-1">
                        <div class="skeleton h-4 w-3/4 rounded mb-2"></div>
                        <div class="skeleton h-3 w-1/2 rounded"></div>
                    </div>
                </div>
            `);
        }
    }
    
    return skeletons.join('');
}

// Toast Notification Component
function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    const id = generateUUID();
    
    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };
    
    const toast = document.createElement('div');
    toast.id = `toast-${id}`;
    toast.className = `${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 slide-in-right max-w-md`;
    toast.innerHTML = `
        <i data-lucide="${icons[type]}" class="w-5 h-5 flex-shrink-0"></i>
        <p class="flex-1">${message}</p>
        <button onclick="removeToast('${id}')" class="text-white hover:text-gray-200">
            <i data-lucide="x" class="w-5 h-5"></i>
        </button>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();
    
    if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
    }
}

function removeToast(id) {
    const toast = document.getElementById(`toast-${id}`);
    if (toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }
}

// Confirmation Modal Component
function showConfirmModal({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger', onConfirm, onCancel }) {
    const container = document.getElementById('modal-container');
    const id = generateUUID();
    
    const icons = {
        danger: 'alert-triangle',
        warning: 'alert-circle',
        info: 'info'
    };
    
    const colors = {
        danger: 'text-red-600',
        warning: 'text-amber-600',
        info: 'text-blue-600'
    };
    
    const modal = document.createElement('div');
    modal.id = `modal-${id}`;
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 fade-in">
            <div class="flex items-start gap-4 mb-4">
                <div class="w-12 h-12 rounded-full bg-${type === 'danger' ? 'red' : type === 'warning' ? 'amber' : 'blue'}-100 flex items-center justify-center flex-shrink-0">
                    <i data-lucide="${icons[type]}" class="w-6 h-6 ${colors[type]}"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">${title}</h3>
                    <p class="text-gray-600">${message}</p>
                </div>
            </div>
            <div class="flex gap-3 justify-end">
                <button onclick="closeModal('${id}')" class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    ${cancelText}
                </button>
                <button onclick="confirmModal('${id}')" class="px-4 py-2 text-white bg-${type === 'danger' ? 'red' : type === 'warning' ? 'amber' : 'blue'}-600 hover:bg-${type === 'danger' ? 'red' : type === 'warning' ? 'amber' : 'blue'}-700 rounded-lg transition-colors">
                    ${confirmText}
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(modal);
    lucide.createIcons();
    
    // Store callbacks
    window[`confirmCallback_${id}`] = onConfirm;
    window[`cancelCallback_${id}`] = onCancel;
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(id);
        }
    });
    
    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal(id);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function closeModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) {
        modal.remove();
        const callback = window[`cancelCallback_${id}`];
        if (callback) callback();
        delete window[`confirmCallback_${id}`];
        delete window[`cancelCallback_${id}`];
    }
}

function confirmModal(id) {
    const callback = window[`confirmCallback_${id}`];
    if (callback) callback();
    closeModal(id);
}

// Form Modal Component
function showFormModal({ title, fields, onSubmit, onCancel }) {
    const container = document.getElementById('modal-container');
    const id = generateUUID();
    
    const fieldsHTML = fields.map(field => {
        if (field.type === 'select') {
            return `
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        ${field.label}
                        ${field.required ? '<span class="text-red-500">*</span>' : ''}
                    </label>
                    <select id="${field.id}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select ${field.label}</option>
                        ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                    </select>
                </div>
            `;
        } else if (field.type === 'textarea') {
            return `
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        ${field.label}
                        ${field.required ? '<span class="text-red-500">*</span>' : ''}
                    </label>
                    <textarea id="${field.id}" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="${field.placeholder || ''}"></textarea>
                </div>
            `;
        } else if (field.type === 'file') {
            return `
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        ${field.label}
                        ${field.required ? '<span class="text-red-500">*</span>' : ''}
                    </label>
                    <input type="file" id="${field.id}" accept="${field.accept || '*'}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
            `;
        } else {
            return `
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        ${field.label}
                        ${field.required ? '<span class="text-red-500">*</span>' : ''}
                    </label>
                    <input type="${field.type || 'text'}" id="${field.id}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="${field.placeholder || ''}">
                </div>
            `;
        }
    }).join('');
    
    const modal = document.createElement('div');
    modal.id = `modal-${id}`;
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 fade-in my-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">${title}</h3>
            <form id="form-${id}">
                ${fieldsHTML}
                <div class="flex gap-3 justify-end mt-6">
                    <button type="button" onclick="closeModal('${id}')" class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    `;
    
    container.appendChild(modal);
    
    // Handle form submission
    const form = document.getElementById(`form-${id}`);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {};
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (field.type === 'file') {
                formData[field.id] = element.files[0];
            } else {
                formData[field.id] = element.value;
            }
        });
        if (onSubmit) onSubmit(formData);
        closeModal(id);
    });
    
    // Store cancel callback
    window[`cancelCallback_${id}`] = onCancel;
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(id);
        }
    });
}

// Export components
window.components = {
    renderSidebar,
    renderNavbar,
    createStatCard,
    createSkeleton,
    showToast,
    showConfirmModal,
    showFormModal,
    toggleSidebar,
    toggleUserMenu
};

window.showToast = showToast;
window.showConfirmModal = showConfirmModal;
window.showFormModal = showFormModal;
window.toggleSidebar = toggleSidebar;
window.toggleUserMenu = toggleUserMenu;
window.closeModal = closeModal;
window.confirmModal = confirmModal;
