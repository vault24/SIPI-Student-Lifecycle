// documentsPage.js
// Extracted from app.js

(function() {
    'use strict';

async function renderDocuments() {
    renderNavbar('Documents');
    
    const mainContent = document.getElementById('main-content');
    
    // Show loading skeleton
    mainContent.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div class="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div class="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
            <div class="mb-6">
                <div class="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${[1, 2, 3, 4, 5, 6].map(() => `
                    <div class="bg-gray-100 rounded-lg p-4 animate-pulse">
                        <div class="h-12 bg-gray-200 rounded mb-3"></div>
                        <div class="h-4 bg-gray-200 rounded mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    try {
        // Fetch documents from backend
        const response = await backendAPI.documents.getAll();
        const documents = response.results || response || [];
        
        // Render documents page
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
        
    } catch (error) {
        console.error('Failed to load documents:', error);
        mainContent.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="text-center py-12">
                    <i data-lucide="alert-circle" class="w-16 h-16 text-red-500 mx-auto mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Failed to Load Documents</h3>
                    <p class="text-gray-600 mb-4">${error.message || 'Unable to fetch documents'}</p>
                    <button onclick="renderDocuments()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Retry
                    </button>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
}

function renderDocumentCards(documents) {
    if (!documents || documents.length === 0) {
        return `
            <div class="col-span-full text-center py-12">
                <i data-lucide="file-text" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                <p class="text-gray-500 mb-2">No documents found</p>
                <button onclick="uploadDocumentGeneral()" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Upload your first document
                </button>
            </div>
        `;
    }
    
    return documents.map(doc => {
        // Handle both snake_case (backend) and camelCase (legacy) field names
        const fileName = doc.file_name || doc.fileName || 'Unknown File';
        const category = doc.category || 'Other';
        const fileSize = doc.file_size || doc.fileSize || 0;
        const uploadDate = doc.upload_date || doc.uploadDate || new Date().toISOString();
        const fileUrl = doc.file || doc.fileUrl || '#';
        const studentName = doc.student_name || (doc.student ? doc.student.full_name_english : 'Unknown Student');
        
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
                <h3 class="font-medium text-gray-900 mb-1 truncate" title="${fileName}">${fileName}</h3>
                <p class="text-sm text-gray-500 mb-2">${studentName}</p>
                <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span class="badge badge-info">${category}</span>
                    <span>${formatFileSize(fileSize)}</span>
                </div>
                <div class="text-xs text-gray-400 mb-3">${formatDate(uploadDate, 'short')}</div>
                <div class="flex gap-2">
                    <a href="${fileUrl}" target="_blank" class="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors">
                        <i data-lucide="eye" class="w-3 h-3"></i>
                        View
                    </a>
                    <a href="${fileUrl}" download="${fileName}" class="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors">
                        <i data-lucide="download" class="w-3 h-3"></i>
                        Download
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

async function updateDocumentsList() {
    const grid = document.getElementById('documents-grid');
    
    // Show loading
    grid.innerHTML = `
        <div class="col-span-full text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-gray-500 mt-4">Loading documents...</p>
        </div>
    `;
    
    try {
        const categoryFilter = document.getElementById('filter-category')?.value || '';
        const filters = categoryFilter ? { category: categoryFilter } : {};
        
        const response = await backendAPI.documents.getAll(filters);
        const documents = response.results || response || [];
        
        grid.innerHTML = renderDocumentCards(documents);
        lucide.createIcons();
    } catch (error) {
        console.error('Failed to load documents:', error);
        grid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i data-lucide="alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4"></i>
                <p class="text-gray-600 mb-4">Failed to load documents</p>
                <button onclick="updateDocumentsList()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Retry
                </button>
            </div>
        `;
        lucide.createIcons();
    }
}

async function uploadDocumentGeneral() {
    try {
        // Fetch students for the dropdown
        const response = await backendAPI.students.getAll();
        const students = response.results || response || [];
        
        showFormModal({
            title: 'Upload Document',
            fields: [
                { id: 'studentId', label: 'Select Student', type: 'select', required: true, options: 
                    students.map(s => ({ 
                        value: s.id, 
                        label: `${s.full_name_english || s.full_name} (${s.current_roll_number || s.roll_number})` 
                    }))
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
            onSubmit: async (formData) => {
                try {
                    // Show uploading toast
                    showToast('Uploading document...', 'info');
                    
                    // Upload document to backend
                    await backendAPI.documents.upload(
                        formData.studentId,
                        formData.category,
                        formData.file
                    );
                    
                    showToast('Document uploaded successfully', 'success');
                    
                    // Refresh the documents list
                    await updateDocumentsList();
                    
                } catch (error) {
                    console.error('Failed to upload document:', error);
                    showToast(error.message || 'Failed to upload document', 'error');
                }
            }
        });
    } catch (error) {
        console.error('Failed to load students:', error);
        showToast('Failed to load students list', 'error');
    }
}

function deleteDocumentConfirm(id) {
    showConfirmModal({
        title: 'Delete Document',
        message: 'Are you sure you want to delete this document? This action cannot be undone.',
        confirmText: 'Delete',
        type: 'danger',
        onConfirm: async () => {
            try {
                await backendAPI.documents.delete(id);
                showToast('Document deleted successfully', 'success');
                await updateDocumentsList();
            } catch (error) {
                console.error('Failed to delete document:', error);
                showToast(error.message || 'Failed to delete document', 'error');
            }
        }
    });
}

window.renderDocuments = renderDocuments;
window.uploadDocumentGeneral = uploadDocumentGeneral;
window.deleteDocumentConfirm = deleteDocumentConfirm;


// Marks & Attendance Page

    // Export to global scope
    window.DocumentsPage = {
        render: renderDocuments
    };

})();
