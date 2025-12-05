/**
 * Application Document Selection Page
 * Displays available documents for an approved application
 * Allows users to select and generate the required document
 */

(function() {
  'use strict';

  /**
   * Render the document selection page after application approval
   * @param {object} params - Route parameters containing applicationId
   */
  async function renderApplicationDocumentSelection(params) {
    const { applicationId } = params;

    if (!applicationId) {
      showToast('Invalid application ID', 'error');
      navigateTo('/applications');
      return;
    }

    renderNavbar('Generate Document');

    try {
      // Fetch application details
      const application = await applicationManager.getApplication(applicationId);

      if (!application) {
        showToast('Application not found', 'error');
        navigateTo('/applications');
        return;
      }

      // Check if application is approved
      if (application.status !== 'approved') {
        showToast('Application must be approved to generate documents', 'error');
        navigateTo(`/application/${applicationId}`);
        return;
      }

      // Get available documents - use selectedDocuments if available, otherwise use application type mapping
      let availableDocuments = [];
      
      if (application.selectedDocuments && application.selectedDocuments.length > 0) {
        // Use the documents selected during application submission
        availableDocuments = application.selectedDocuments.map(docType => ({
          type: docType,
          metadata: getDocumentMetadata(docType)
        })).filter(doc => doc.metadata !== null);
      } else {
        // Fallback to application type mapping for older applications
        availableDocuments = getDocumentMetadataForApplicationType(application.applicationType);
      }

      if (availableDocuments.length === 0) {
        showToast('No documents available for this application', 'error');
        navigateTo(`/application/${applicationId}`);
        return;
      }

      // Render the page
      const mainContent = document.getElementById('main-content');
      mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-6">
          <!-- Header -->
          <div class="mb-8">
            <button onclick="navigateTo('/applications')" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1 mb-4 font-medium">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
              Back to Applications
            </button>
            <div class="glass-panel p-8 rounded-2xl backdrop-blur-md border border-white/20 entrance-animation">
              <h1 class="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">Generate Document</h1>
              <p class="text-gray-600 dark:text-gray-400 text-lg">Your application has been approved. Select a document to generate and download.</p>
            </div>
          </div>

          <!-- Application Summary -->
          <div class="glass-panel bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl backdrop-blur-md p-8 mb-8 entrance-animation">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <i data-lucide="check-circle" class="w-5 h-5 text-green-400"></i>
                  <span class="text-green-400 font-semibold">Application Approved</span>
                </div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">${application.fullNameEnglish}</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600 dark:text-gray-400">Application Type</p>
                    <p class="text-gray-900 dark:text-white font-semibold">${application.applicationType}</p>
                  </div>
                  <div>
                    <p class="text-gray-600 dark:text-gray-400">Department</p>
                    <p class="text-gray-900 dark:text-white font-semibold">${application.department}</p>
                  </div>
                  <div>
                    <p class="text-gray-600 dark:text-gray-400">Roll Number</p>
                    <p class="text-gray-900 dark:text-white font-semibold">${application.rollNumber}</p>
                  </div>
                  <div>
                    <p class="text-gray-600 dark:text-gray-400">Application ID</p>
                    <p class="text-gray-900 dark:text-white font-semibold text-xs font-mono">${application.id}</p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="text-gray-600 dark:text-gray-400 text-sm">Approved on</p>
                <p class="text-gray-900 dark:text-white font-semibold">${formatDate(application.reviewedAt, 'short')}</p>
              </div>
            </div>
          </div>

          <!-- Available Documents -->
          <div class="entrance-animation">
            <h3 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">Available Documents</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${availableDocuments.map(doc => `
                <div class="group premium-card relative rounded-2xl p-6 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl"
                     onclick="generateApplicationDocument('${applicationId}', '${application.fullNameEnglish}', '${doc.type}')">
                  
                  <!-- Icon -->
                  <div class="w-16 h-16 bg-gradient-to-br from-${doc.metadata.color}-500 to-${doc.metadata.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all">
                    <i data-lucide="${doc.metadata.icon}" class="w-8 h-8 text-white"></i>
                  </div>

                  <!-- Title -->
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    ${doc.metadata.name}
                  </h4>

                  <!-- Description -->
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    ${doc.metadata.description}
                  </p>

                  <!-- Arrow Icon -->
                  <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i data-lucide="arrow-right" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
                  </div>

                  <!-- Hover Effect -->
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/5 rounded-2xl transition-all duration-300"></div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Info Box -->
          <div class="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div class="flex gap-3">
              <i data-lucide="info" class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"></i>
              <div>
                <p class="text-blue-300 font-semibold mb-1">Document Generation</p>
                <p class="text-blue-200 text-sm">
                  Select a document type above to generate and download your official document. 
                  You can generate multiple documents for your approved application.
                </p>
              </div>
            </div>
          </div>
        </div>
      `;

      lucide.createIcons();
    } catch (error) {
      console.error('Error rendering document selection page:', error);
      showToast('Error loading application details', 'error');
      navigateTo('/applications');
    }
  }

  /**
   * Generate and navigate to document viewer
   * @param {string} applicationId - The application ID
   * @param {string} studentName - The student name (for reference)
   * @param {string} documentType - The document type to generate
   */
  function generateApplicationDocument(applicationId, studentName, documentType) {
    // Note: We need to get the student ID from the application
    // For now, we'll navigate to a temporary page that fetches the student ID
    navigateTo(`/application-document-viewer/${applicationId}/${documentType}`);
  }

  // Export to global scope
  window.renderApplicationDocumentSelection = renderApplicationDocumentSelection;
  window.generateApplicationDocument = generateApplicationDocument;

  window.ApplicationDocumentSelectionPage = {
    render: renderApplicationDocumentSelection
  };

})();
