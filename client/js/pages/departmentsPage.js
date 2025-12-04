// departmentsPage.js
// Departments Page with Backend API Integration

(function() {
    'use strict';

async function renderDepartments() {
    renderNavbar('Departments');
    
    // Show loading skeleton
    showLoadingSkeleton('main-content', 'card', 6);
    
    try {
        const departments = await dataManager.getDepartments();
        
        // Fetch student counts for each department
        const departmentCards = [];
        for (const dept of departments) {
            const students = await dataManager.getStudentsByDepartmentAndSemester(dept.id);
            const activeStudents = students.filter(s => s.status === 'active').length;
            
            departmentCards.push(`
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
                    
                    <button onclick="navigateTo('/department/${dept.id}')" 
                        class="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors font-medium">
                        View Students
                    </button>
                </div>
            `);
        }
        
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
                    ${departmentCards.join('')}
                </div>
            </div>
        `;
        
        lucide.createIcons();
        
    } catch (error) {
        handleAPIError(error);
        renderErrorState();
    }
}

function renderErrorState() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-7xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm p-12 text-center">
                <i data-lucide="alert-circle" class="w-16 h-16 mx-auto mb-4 text-red-500"></i>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Unable to Load Departments</h2>
                <p class="text-gray-600 mb-6">There was an error loading the departments.</p>
                <button onclick="DepartmentsPage.render()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                    <i data-lucide="refresh-cw" class="w-5 h-5 inline mr-2"></i>
                    Retry
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
}

async function addNewDepartment() {
    showFormModal({
        title: 'Add New Department',
        fields: [
            { id: 'name', label: 'Department Name', type: 'text', required: true, placeholder: 'e.g., Computer Science and Technology' },
            { id: 'code', label: 'Department Code', type: 'text', required: true, placeholder: 'e.g., CST' }
        ],
        onSubmit: async (formData) => {
            try {
                await dataManager.addDepartment(formData);
                showSuccessToast('Department added successfully');
                renderDepartments();
            } catch (error) {
                handleAPIError(error);
            }
        }
    });
}

async function editDepartment(id) {
    try {
        const departments = await dataManager.getDepartments();
        const dept = departments.find(d => d.id === id);
        
        if (!dept) return;
        
        showFormModal({
            title: 'Edit Department',
            fields: [
                { id: 'name', label: 'Department Name', type: 'text', required: true, value: dept.name },
                { id: 'code', label: 'Department Code', type: 'text', required: true, value: dept.code }
            ],
            onSubmit: async (formData) => {
                try {
                    await dataManager.updateDepartment(id, formData);
                    showSuccessToast('Department updated successfully');
                    renderDepartments();
                } catch (error) {
                    handleAPIError(error);
                }
            }
        });
    } catch (error) {
        handleAPIError(error);
    }
}

async function deleteDepartmentConfirm(id) {
    try {
        const departments = await dataManager.getDepartments();
        const dept = departments.find(d => d.id === id);
        
        showConfirmModal({
            title: 'Delete Department',
            message: 'Are you sure you want to delete ' + dept.name + '? This will not delete students, but they will need to be reassigned.',
            confirmText: 'Delete',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await dataManager.deleteDepartment(id);
                    showSuccessToast('Department deleted successfully');
                    renderDepartments();
                } catch (error) {
                    handleAPIError(error);
                }
            }
        });
    } catch (error) {
        handleAPIError(error);
    }
}

// Export helper functions
window.addNewDepartment = addNewDepartment;
window.editDepartment = editDepartment;
window.deleteDepartmentConfirm = deleteDepartmentConfirm;

// Export to global scope
window.DepartmentsPage = {
    render: renderDepartments
};

})();
