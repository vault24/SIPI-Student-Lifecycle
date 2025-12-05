// editAlumniPage.js
// Extracted from app.js

(function() {
    'use strict';

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
                    <button onclick="navigateTo('/alumni/${alumni.student}')" class="text-gray-600 hover:text-gray-900">
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
                        <button type="button" onclick="navigateTo('/alumni/${alumni.student}')" class="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
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
    document.getElementById('edit-alumni-form').addEventListener('submit', (e) => handleEditAlumni(e, alumni.student));
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

function addCareerPosition(alumniId) {
    showFormModal({
        title: 'Add Career Position',
        fields: [
            { id: 'positionType', label: 'Position Type', type: 'select', required: true, options: [
                { value: 'job', label: 'Job' },
                { value: 'higher_study', label: 'Higher Study' },
                { value: 'business', label: 'Business' },
                { value: 'other', label: 'Other' }
            ]},
            { id: 'organizationName', label: 'Organization/University', type: 'text', required: true, placeholder: 'Enter organization name' },
            { id: 'positionTitle', label: 'Position/Role Title', type: 'text', required: true, placeholder: 'Enter position title' },
            { id: 'startDate', label: 'Start Date', type: 'date', required: true },
            { id: 'endDate', label: 'End Date (Optional)', type: 'date', required: false },
            { id: 'isCurrent', label: 'Is Current Position?', type: 'select', required: false, options: [
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' }
            ]},
            { id: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Enter position description' }
        ],
        onSubmit: (formData) => {
            try {
                const positionData = {
                    positionType: formData.positionType,
                    organizationName: formData.organizationName,
                    positionTitle: formData.positionTitle,
                    startDate: formData.startDate,
                    endDate: formData.endDate || null,
                    isCurrent: formData.isCurrent === 'true',
                    description: formData.description || ''
                };
                
                dataManager.addCareerPosition(alumniId, positionData);
                showToast('Career position added successfully', 'success');
                navigateTo(`/alumni/${alumniId}`);
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
}

function updateSupportCategory(alumniId) {
    const alumni = dataManager.getAlumniById(alumniId);
    
    showFormModal({
        title: 'Update Support Category',
        fields: [
            { id: 'category', label: 'Support Category', type: 'select', required: true, options: [
                { value: 'receiving_support', label: 'Receiving Support' },
                { value: 'needs_extra_support', label: 'Needs Extra Support' },
                { value: 'no_support_needed', label: 'No Support Needed' }
            ]},
            { id: 'notes', label: 'Notes', type: 'textarea', required: false, placeholder: 'Enter reason for change' }
        ],
        onSubmit: (formData) => {
            try {
                dataManager.updateSupportCategory(alumniId, formData.category, formData.notes, 'Admin');
                showToast('Support category updated successfully', 'success');
                navigateTo(`/alumni/${alumniId}`);
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
}

function editAlumni(alumniId) {
    navigateTo(`/edit-alumni/${alumniId}`);
}

// Export helper functions that are used by this page
window.addCareerPosition = addCareerPosition;
window.updateSupportCategory = updateSupportCategory;
window.editAlumni = editAlumni;


// Login Page

    // Export to global scope
    window.EditAlumniPage = {
        render: renderEditAlumni
    };

})();
