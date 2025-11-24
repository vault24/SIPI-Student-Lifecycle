// Admin Application Management Pages

// Applications List Page (Admin)
function renderApplications() {
    renderNavbar('Applications');
    
    const applications = applicationManager.getApplications();
    const pending = applications.filter(a => a.status === 'pending').length;
    const approved = applications.filter(a => a.status === 'approved').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Student Applications</h2>
                <a href="#/apply" target="_blank" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i data-lucide="external-link" class="w-5 h-5"></i>
                    Student Application Form
                </a>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                ${createStatCard({ title: 'Total Applications', value: applications.length, icon: 'file-text', color: 'blue' })}
                ${createStatCard({ title: 'Pending', value: pending, icon: 'clock', color: 'yellow' })}
                ${createStatCard({ title: 'Approved', value: approved, icon: 'check-circle', color: 'green' })}
                ${createStatCard({ title: 'Rejected', value: rejected, icon: 'x-circle', color: 'red' })}
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div class="flex gap-4">
                    <select id="status-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onchange="filterApplications()">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="converted">Converted to Student</option>
                    </select>
                    <input type="text" id="search-applications" placeholder="Search by name or ID..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onkeyup="filterApplications()">
                </div>
            </div>

            <!-- Applications List -->
            <div id="applications-list" class="bg-white rounded-xl shadow-sm p-6">
                <!-- Will be populated by filterApplications() -->
            </div>
        </div>
    `;
    
    lucide.createIcons();
    filterApplications();
}

function filterApplications() {
    const statusFilter = document.getElementById('status-filter').value;
    const searchTerm = document.getElementById('search-applications').value.toLowerCase();
    
    let applications = applicationManager.getApplications();
    
    // Apply status filter
    if (statusFilter) {
        applications = applications.filter(app => app.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        applications = applications.filter(app => 
            app.fullNameEnglish.toLowerCase().includes(searchTerm) ||
            app.id.toLowerCase().includes(searchTerm) ||
            app.department.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort by submission date (newest first)
    applications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    const container = document.getElementById('applications-list');
    
    if (applications.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i data-lucide="inbox" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
                <p class="text-gray-600">No applications match your filters.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${applications.map(app => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4">
                                <div>
                                    <div class="font-medium text-gray-900">${app.fullNameEnglish}</div>
                                    <div class="text-sm text-gray-500">${app.applicationType || 'N/A'}</div>
                                    <div class="text-xs text-gray-400 font-mono">${app.id}</div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900">${app.department}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">${formatDate(app.submittedAt, 'short')}</td>
                            <td class="px-6 py-4">
                                <span class="badge badge-${
                                    app.status === 'pending' ? 'warning' :
                                    app.status === 'approved' ? 'success' :
                                    app.status === 'rejected' ? 'error' :
                                    'info'
                                }">
                                    ${app.status}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm font-medium">
                                <button onclick="navigateTo('/application/${app.id}')" class="text-blue-600 hover:text-blue-900">
                                    <i data-lucide="eye" class="w-4 h-4 inline"></i> View
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

// Application Details Page (Admin)
function renderApplicationDetails(params) {
    const application = applicationManager.getApplication(params.id);
    
    if (!application) {
        showToast('Application not found', 'error');
        navigateTo('/applications');
        return;
    }
    
    renderNavbar('Application Details');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-6">
                <button onclick="navigateTo('/applications')" class="text-gray-600 hover:text-gray-900">
                    <i data-lucide="arrow-left" class="w-6 h-6"></i>
                </button>
                <div class="flex-1">
                    <h2 class="text-2xl font-bold text-gray-900">Application Details</h2>
                    <p class="text-gray-600">ID: ${application.id}</p>
                </div>
                <span class="badge badge-${
                    application.status === 'pending' ? 'warning' :
                    application.status === 'approved' ? 'success' :
                    application.status === 'rejected' ? 'error' :
                    'info'
                } text-lg px-4 py-2">
                    ${application.status.toUpperCase()}
                </span>
            </div>

            <!-- Action Buttons -->
            ${application.status === 'pending' ? `
                <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Review Application</h3>
                    <div class="flex gap-4">
                        <button onclick="approveApplication('${application.id}')" class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                            <i data-lucide="check-circle" class="w-5 h-5"></i>
                            Approve Application
                        </button>
                        <button onclick="rejectApplication('${application.id}')" class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
                            <i data-lucide="x-circle" class="w-5 h-5"></i>
                            Reject Application
                        </button>
                    </div>
                </div>
            ` : ''}

            ${application.status === 'approved' ? `
                <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div class="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>
                        <div>
                            <p class="font-medium text-green-900">Application Approved</p>
                            <p class="text-sm text-green-700">This application has been approved and is ready for processing.</p>
                        </div>
                    </div>
                </div>
            ` : ''}

            <!-- Application Information -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Student Information -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                    <dl class="space-y-3">
                        <div><dt class="text-sm font-medium text-gray-500">Full Name (English)</dt><dd class="text-sm text-gray-900">${application.fullNameEnglish}</dd></div>
                        <div><dt class="text-sm font-medium text-gray-500">Full Name (Bangla)</dt><dd class="text-sm text-gray-900">${application.fullNameBangla}</dd></div>
                        <div><dt class="text-sm font-medium text-gray-500">Father's Name</dt><dd class="text-sm text-gray-900">${application.fatherName}</dd></div>
                        <div><dt class="text-sm font-medium text-gray-500">Mother's Name</dt><dd class="text-sm text-gray-900">${application.motherName}</dd></div>
                        <div><dt class="text-sm font-medium text-gray-500">Email</dt><dd class="text-sm text-gray-900">${application.email || 'N/A'}</dd></div>
                    </dl>
                </div>

                <!-- Academic Information -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                    <dl class="space-y-3">
                        <div><dt class="text-sm font-medium text-gray-500">Department</dt><dd class="text-sm text-gray-900">${application.department}</dd></div>
                        <div><dt class="text-sm font-medium text-gray-500">Session</dt><dd class="text-sm text-gray-900">${application.session}</dd></div>
                        <div><dt class="text-sm font-medium text-gray-500">Shift</dt><dd class="text-sm text-gray-900">${application.shift}</dd></div>
                        <div><dt class="text-sm font-medium text-gray-500">Roll Number</dt><dd class="text-sm text-gray-900">${application.rollNumber}</dd></div>
                        <div><dt class="text-sm font-medium text-gray-500">Registration Number</dt><dd class="text-sm text-gray-900">${application.registrationNumber}</dd></div>
                    </dl>
                </div>

                <!-- Application Details -->
                <div class="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
                    <dl class="space-y-3">
                        <div><dt class="text-sm font-medium text-gray-500">Application Type</dt><dd class="text-sm text-gray-900 font-semibold">${application.applicationType || 'N/A'}</dd></div>
                        <div><dt class="text-sm font-medium text-gray-500">Subject</dt><dd class="text-sm text-gray-900">${application.subject || 'N/A'}</dd></div>
                        <div><dt class="text-sm font-medium text-gray-500">Message</dt><dd class="text-sm text-gray-900 whitespace-pre-wrap">${application.message || 'N/A'}</dd></div>
                    </dl>
                </div>

                <!-- Application Timeline -->
                <div class="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
                    <div class="space-y-4">
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <i data-lucide="file-text" class="w-5 h-5 text-blue-600"></i>
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">Application Submitted</p>
                                <p class="text-sm text-gray-500">${formatDate(application.submittedAt, 'long')}</p>
                            </div>
                        </div>
                        ${application.reviewedAt ? `
                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 bg-${application.status === 'approved' ? 'green' : 'red'}-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i data-lucide="${application.status === 'approved' ? 'check-circle' : 'x-circle'}" class="w-5 h-5 text-${application.status === 'approved' ? 'green' : 'red'}-600"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-900">Application ${application.status === 'approved' ? 'Approved' : 'Rejected'}</p>
                                    <p class="text-sm text-gray-500">${formatDate(application.reviewedAt, 'long')}</p>
                                    <p class="text-sm text-gray-500">By: ${application.reviewedBy}</p>
                                    ${application.reviewNotes ? `<p class="text-sm text-gray-600 mt-1">${application.reviewNotes}</p>` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    lucide.createIcons();
}

function approveApplication(applicationId) {
    showConfirmModal({
        title: 'Approve Application',
        message: 'Are you sure you want to approve this application?',
        confirmText: 'Approve',
        type: 'success',
        onConfirm: () => {
            if (applicationManager.updateApplicationStatus(applicationId, 'approved', 'Application approved')) {
                showToast('Application approved successfully', 'success');
                navigateTo(`/application/${applicationId}`);
                setTimeout(() => window.location.reload(), 1000);
            } else {
                showToast('Failed to approve application', 'error');
            }
        }
    });
}

function rejectApplication(applicationId) {
    showConfirmModal({
        title: 'Reject Application',
        message: 'Are you sure you want to reject this application? This action cannot be undone.',
        confirmText: 'Reject',
        type: 'danger',
        onConfirm: () => {
            if (applicationManager.updateApplicationStatus(applicationId, 'rejected', 'Application rejected')) {
                showToast('Application rejected', 'success');
                navigateTo('/applications');
            } else {
                showToast('Failed to reject application', 'error');
            }
        }
    });
}

// Export functions
window.renderApplications = renderApplications;
window.renderApplicationDetails = renderApplicationDetails;
window.filterApplications = filterApplications;
window.approveApplication = approveApplication;
window.rejectApplication = rejectApplication;
