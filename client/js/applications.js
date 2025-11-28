// Application Management Pages

// Public Application Form (No login required)
function renderPublicApplicationForm() {
    // Don't render navbar for public page
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('navbar').style.display = 'none';
    
    const mainContent = document.getElementById('main-content');
    mainContent.className = 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4';
    mainContent.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-2">Student Application Form</h1>
                <p class="text-gray-600">Submit your application for testimonial, certificate, stipend, or other documents</p>
            </div>

            <div class="bg-white rounded-2xl shadow-xl p-8">
                <form id="public-application-form" class="space-y-6">
                    <!-- Student Information -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="user" class="w-5 h-5 text-blue-600"></i>
                            Student Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name (Bangla) <span class="text-red-500">*</span></label>
                                <input type="text" id="fullNameBangla" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="পূর্ণ নাম">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name (English) <span class="text-red-500">*</span></label>
                                <input type="text" id="fullNameEnglish" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Full Name">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Father's Name <span class="text-red-500">*</span></label>
                                <input type="text" id="fatherName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Mother's Name <span class="text-red-500">*</span></label>
                                <input type="text" id="motherName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Department <span class="text-red-500">*</span></label>
                                <select id="department" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Department</option>
                                    ${dataManager.getDepartments().map(dept => `<option value="${dept.name}">${dept.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Session <span class="text-red-500">*</span></label>
                                <input type="text" id="session" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., 2024-2025">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Shift <span class="text-red-500">*</span></label>
                                <select id="shift" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Shift</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Day">Day</option>
                                    <option value="Evening">Evening</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Roll Number <span class="text-red-500">*</span></label>
                                <input type="text" id="rollNumber" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Registration Number <span class="text-red-500">*</span></label>
                                <input type="text" id="registrationNumber" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" id="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="your.email@example.com">
                            </div>
                        </div>
                    </div>

                    <!-- Application Details -->
                    <div class="pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="file-text" class="w-5 h-5 text-blue-600"></i>
                            Application Details
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Application Type <span class="text-red-500">*</span></label>
                                <select id="applicationType" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select Application Type</option>
                                    <option value="Testimonial">Testimonial</option>
                                    <option value="Certificate">Certificate</option>
                                    <option value="Stipend">Stipend</option>
                                    <option value="Character Certificate">Character Certificate</option>
                                    <option value="Transcript">Transcript</option>
                                    <option value="Other Documents">Other Documents</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Subject <span class="text-red-500">*</span></label>
                                <input type="text" id="subject" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Brief subject of your application">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Message/Details <span class="text-red-500">*</span></label>
                                <textarea id="message" required rows="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Provide detailed information about your application..."></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex gap-4 justify-end pt-4 border-t border-gray-200">
                        <button type="submit" class="px-8 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 text-lg font-semibold">
                            <i data-lucide="send" class="w-5 h-5"></i>
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>

            <!-- Footer -->
            <div class="text-center mt-8 text-gray-600">
                <p>Already have an account? <a href="#/login" class="text-blue-600 hover:text-blue-700 font-medium">Login here</a></p>
            </div>
        </div>
    `;
    
    lucide.createIcons();
    
    // Handle form submission
    document.getElementById('public-application-form').addEventListener('submit', handlePublicApplicationSubmit);
}

function handlePublicApplicationSubmit(e) {
    e.preventDefault();
    
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
        applicationType: document.getElementById('applicationType').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    const application = applicationManager.submitApplication(applicationData);
    
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
                    <p class="text-gray-600 mb-2">Your application for <strong>${applicationData.applicationType}</strong> has been submitted.</p>
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
