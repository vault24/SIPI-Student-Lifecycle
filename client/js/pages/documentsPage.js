// documentsPage.js
// Extracted from app.js

(function() {
    'use strict';

async function renderDocuments() {
    renderNavbar('Documents');
    
    const mainContent = document.getElementById('main-content');
    
    // Show loading skeleton with premium styling
    mainContent.innerHTML = `
        <div class="space-y-6">
            <!-- Header Section -->
            <div class="glass-panel p-8 rounded-2xl">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div class="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 animate-pulse mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                    </div>
                    <div class="h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl w-48 animate-pulse"></div>
                </div>
            </div>

            <!-- Filter Section -->
            <div class="glass-panel p-6 rounded-2xl">
                <div class="h-10 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
            </div>

            <!-- Documents Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${[1, 2, 3, 4, 5, 6].map(() => `
                    <div class="premium-card rounded-2xl p-6 animate-pulse">
                        <div class="h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4"></div>
                        <div class="h-4 bg-gray-200 rounded mb-3"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div class="flex gap-2">
                            <div class="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                            <div class="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    try {
        // Fetch documents from backend
        const response = await backendAPI.documents.getAll();
        const documents = response.results || response || [];
        
        // Render documents page with premium styling
        mainContent.innerHTML = `
            <div class="space-y-6">
                <!-- Header Section with Gradient -->
                <div class="glass-panel p-8 rounded-2xl backdrop-blur-md border border-white/20">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                Documents
                            </h1>
                            <p class="text-gray-600 dark:text-gray-400">Manage and organize your documents</p>
                        </div>
                        <button onclick="uploadDocumentGeneral()" class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium">
                            <i data-lucide="upload" class="w-5 h-5"></i>
                            <span>Upload Document</span>
                        </button>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="glass-panel p-6 rounded-2xl backdrop-blur-md border border-white/20">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Filter by Category</label>
                    <select id="filter-category" class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium">
                        <option value="">All Categories</option>
                        <option value="NID">NID</option>
                        <option value="Marksheet">Marksheet</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Attendance Sheet">Attendance Sheet</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <!-- Documents Grid -->
                <div id="documents-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div class="glass-panel p-12 rounded-2xl backdrop-blur-md border border-white/20 text-center">
                <i data-lucide="alert-circle" class="w-20 h-20 text-red-500 mx-auto mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Documents</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">${error.message || 'Unable to fetch documents'}</p>
                <button onclick="renderDocuments()" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium">
                    Retry
                </button>
            </div>
        `;
        lucide.createIcons();
    }
}

function renderDocumentCards(documents) {
    if (!documents || documents.length === 0) {
        return `
            <div class="col-span-full">
                <div class="glass-panel p-16 rounded-2xl backdrop-blur-md border border-white/20 text-center">
                    <i data-lucide="file-text" class="w-20 h-20 mx-auto mb-4 text-gray-400"></i>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 text-lg">No documents found</p>
                    <button onclick="uploadDocumentGeneral()" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium">
                        Upload your first document
                    </button>
                </div>
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
        
        // Get category color
        const categoryColors = {
            'NID': 'from-blue-500 to-cyan-500',
            'Marksheet': 'from-green-500 to-emerald-500',
            'Certificate': 'from-purple-500 to-pink-500',
            'Attendance Sheet': 'from-orange-500 to-red-500',
            'Other': 'from-gray-500 to-slate-500'
        };
        const categoryGradient = categoryColors[category] || categoryColors['Other'];
        
        return `
            <div class="premium-card group rounded-2xl p-6 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl entrance-animation">
                <!-- Header with Icon and Delete -->
                <div class="flex items-start justify-between mb-4">
                    <div class="w-16 h-16 bg-gradient-to-br ${categoryGradient} rounded-xl flex items-center justify-center shadow-lg">
                        <i data-lucide="file-text" class="w-8 h-8 text-white"></i>
                    </div>
                    <button onclick="deleteDocumentConfirm('${doc.id}')" class="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </div>
                
                <!-- File Name -->
                <h3 class="font-bold text-gray-900 dark:text-white mb-1 truncate text-lg" title="${fileName}">${fileName}</h3>
                
                <!-- Student Name -->
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${studentName}</p>
                
                <!-- Category Badge and Size -->
                <div class="flex items-center justify-between mb-4">
                    <span class="inline-block px-3 py-1 bg-gradient-to-r ${categoryGradient} text-white text-xs font-semibold rounded-full">
                        ${category}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">${formatFileSize(fileSize)}</span>
                </div>
                
                <!-- Upload Date -->
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium">
                    <i data-lucide="calendar" class="w-3 h-3 inline mr-1"></i>
                    ${formatDate(uploadDate, 'short')}
                </div>
                
                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <a href="${fileUrl}" target="_blank" class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                        <span>View</span>
                    </a>
                    <a href="${fileUrl}" download="${fileName}" class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                        <i data-lucide="download" class="w-4 h-4"></i>
                        <span>Download</span>
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

async function updateDocumentsList() {
    const grid = document.getElementById('documents-grid');
    
    // Show loading with premium styling
    grid.innerHTML = `
        <div class="col-span-full">
            <div class="glass-panel p-12 rounded-2xl backdrop-blur-md border border-white/20 text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                <p class="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading documents...</p>
            </div>
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
            <div class="col-span-full">
                <div class="glass-panel p-12 rounded-2xl backdrop-blur-md border border-white/20 text-center">
                    <i data-lucide="alert-circle" class="w-16 h-16 text-red-500 mx-auto mb-4"></i>
                    <p class="text-gray-600 dark:text-gray-400 mb-6 text-lg">Failed to load documents</p>
                    <button onclick="updateDocumentsList()" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium">
                        Retry
                    </button>
                </div>
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
