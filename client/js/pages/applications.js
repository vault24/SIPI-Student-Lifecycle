// Application Management Pages

// Public Application Form (No login required)
async function renderPublicApplicationForm() {
    // Show sidebar and navbar
    document.getElementById('sidebar').style.display = 'flex';
    document.getElementById('navbar').style.display = 'block';
    
    // Update navbar title
    renderNavbar('Submit Application');
    
    // Fetch departments
    const departments = await dataManager.getDepartments();
    
    const mainContent = document.getElementById('main-content');
    mainContent.className = 'space-y-6 py-8 px-4';
    mainContent.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <!-- Premium Header with Gradient -->
            <div class="glass-panel p-8 rounded-2xl backdrop-blur-md border border-white/20 mb-8 entrance-animation">
                <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Student Application Form</h1>
                <p class="text-gray-600 dark:text-gray-400 text-lg">Submit your application for testimonial, certificate, stipend, or other documents</p>
            </div>

            <div class="glass-panel rounded-2xl backdrop-blur-md border border-white/20 p-8 entrance-animation">
                <form id="public-application-form" class="space-y-8">
                    <!-- Student Information Section -->
                    <div>
                        <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center gap-3 pb-4 border-b-2 border-white/20">
                            <i data-lucide="user" class="w-6 h-6 text-blue-600"></i>
                            Student Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Full Name (Bangla) -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Full Name (Bangla) <span class="text-red-500">*</span></label>
                                <input type="text" id="fullNameBangla" required class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="পূর্ণ নাম">
                            </div>
                            <!-- Full Name (English) -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name (English) <span class="text-red-500">*</span></label>
                                <input type="text" id="fullNameEnglish" required class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Full Name">
                            </div>
                            <!-- Father's Name -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Father's Name <span class="text-red-500">*</span></label>
                                <input type="text" id="fatherName" required class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            </div>
                            <!-- Mother's Name -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mother's Name <span class="text-red-500">*</span></label>
                                <input type="text" id="motherName" required class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            </div>
                            <!-- Department -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Department <span class="text-red-500">*</span></label>
                                <select id="department" required class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white">
                                    <option value="">Select Department</option>
                                    ${departments.map(dept => `<option value="${dept.name}">${dept.name}</option>`).join('')}
                                </select>
                            </div>
                            <!-- Session -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Session <span class="text-red-500">*</span></label>
                                <input type="text" id="session" required class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g., 2024-2025">
                            </div>
                            <!-- Shift -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Shift <span class="text-red-500">*</span></label>
                                <select id="shift" required class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white">
                                    <option value="">Select Shift</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Day">Day</option>
                                    <option value="Evening">Evening</option>
                                </select>
                            </div>
                            <!-- Roll Number -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Roll Number <span class="text-red-500">*</span></label>
                                <input type="text" id="rollNumber" required class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            </div>
                            <!-- Registration Number -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Registration Number <span class="text-red-500">*</span></label>
                                <input type="text" id="registrationNumber" required class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                            </div>
                            <!-- Email -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input type="email" id="email" class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="your.email@example.com">
                            </div>
                        </div>
                    </div>

                    <!-- Application Details Section -->
                    <div>
                        <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center gap-3 pb-4 border-b-2 border-white/20">
                            <i data-lucide="file-text" class="w-6 h-6 text-blue-600"></i>
                            Application Details
                        </h3>
                        <div class="space-y-6">
                            <!-- Required Documents Selection -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Select Required Documents <span class="text-red-500">*</span></label>
                                <div id="documents-checkboxes" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Checkboxes will be populated on page load -->
                                </div>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Select at least one document</p>
                            </div>

                            <!-- Subject -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject <span class="text-red-500">*</span></label>
                                <input type="text" id="subject" required class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Brief subject of your application">
                            </div>
                            <!-- Message/Details -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message/Details <span class="text-red-500">*</span></label>
                                <textarea id="message" required rows="8" class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" placeholder="Provide detailed information about your application..."></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-end pt-6">
                        <button type="submit" class="px-8 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                            <i data-lucide="send" class="w-5 h-5"></i>
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>

            <!-- Footer -->
            <div class="text-center mt-8 text-gray-600 dark:text-gray-400">
                <p>Already have an account? <a href="#/login" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">Login here</a></p>
            </div>
        </div>
    `;
    
    lucide.createIcons();
    
    // Initialize document checkboxes
    initializeDocumentCheckboxes();
    
    // Handle form submission
    document.getElementById('public-application-form').addEventListener('submit', handlePublicApplicationSubmit);
}

function initializeDocumentCheckboxes() {
    const checkboxesContainer = document.getElementById('documents-checkboxes');
    
    // Get all available document types
    const allDocuments = getAllDocumentTypes().map(docType => ({
        type: docType,
        metadata: getDocumentMetadata(docType)
    })).filter(doc => doc.metadata !== null);
    
    // Generate checkboxes for all documents with premium styling
    checkboxesContainer.innerHTML = allDocuments.map(doc => `
        <label class="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl hover:border-white/40 hover:bg-white/70 dark:hover:bg-gray-800/70 cursor-pointer transition-all duration-300 transform hover:scale-105">
            <input type="checkbox" name="selectedDocuments" value="${doc.type}" class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
            <div class="flex-1">
                <div class="flex items-center gap-2">
                    <i data-lucide="${doc.metadata.icon}" class="w-4 h-4 text-${doc.metadata.color}-600"></i>
                    <span class="font-medium text-gray-900 dark:text-white">${doc.metadata.name}</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${doc.metadata.description}</p>
            </div>
        </label>
    `).join('');
    
    lucide.createIcons();
}

async function handlePublicApplicationSubmit(e) {
    e.preventDefault();
    
    // Get selected documents
    const selectedDocuments = Array.from(document.querySelectorAll('input[name="selectedDocuments"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Validate that at least one document is selected
    if (selectedDocuments.length === 0) {
        showToast('Please select at least one document', 'error');
        return;
    }
    
    const applicationData = {
        fullNameBangla: document.getElementById('fullNameBangla').value,
        fullNameEnglish: document.getElementById('fullNameEnglish').value,
        fatherName: document.getElementById('fatherName').value,
        motherName: document.getElementById('motherName').value,
        department: document.getElementById('department').value,
        session: document.getElementById('session').value,
        shift: document.getElementById('shift').value,
        rollNumber: document.getElementById('rollNumber').value,
        registrationNumber: document.getElementById('registrationNumber').value,
        email: document.getElementById('email').value || '',
        applicationType: 'Other',
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        selectedDocuments: selectedDocuments
    };
    
    const application = await applicationManager.submitApplication(applicationData);
    
    if (application) {
        // Show success message
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="max-w-2xl mx-auto text-center py-16">
                <div class="bg-white rounded-2xl shadow-xl p-12">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i data-lucide="check-circle" class="w-12 h-12 text-green-600"></i>
                    </div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
                    <p class="text-gray-600 mb-2">Your application for <strong>${selectedDocuments.length} document(s)</strong> has been submitted.</p>
                    <p class="text-gray-600 mb-2">Selected Documents:</p>
                    <p class="text-sm text-gray-700 mb-4">${selectedDocuments.map(doc => getDocumentMetadata(doc)?.name || doc).join(', ')}</p>
                    <p class="text-gray-600 mb-2">Application ID:</p>
                    <p class="text-2xl font-mono font-bold text-blue-600 mb-6">${application.id}</p>
                    <p class="text-gray-600 mb-8">Please save this ID for future reference. You will be notified once your application is processed.</p>
                    <div class="flex gap-4 justify-center">
                        <button onclick="window.print()" class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                            <i data-lucide="printer" class="w-5 h-5 inline mr-2"></i>
                            Print
                        </button>
                        <a href="#/apply" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            Submit Another Application
                        </a>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    } else {
        showToast('Failed to submit application. Please try again.', 'error');
    }
}

// Export functions
window.renderPublicApplicationForm = renderPublicApplicationForm;
window.handlePublicApplicationSubmit = handlePublicApplicationSubmit;
window.initializeDocumentCheckboxes = initializeDocumentCheckboxes;
