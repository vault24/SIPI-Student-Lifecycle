/**
 * Application Document Viewer Page
 * Displays documents generated from approved applications
 * Bridges application data with document templates
 */

(function() {
  'use strict';

  /**
   * Render document viewer for application-generated documents
   * @param {object} params - Route parameters containing applicationId and documentType
   */
  async function renderApplicationDocumentViewer(params) {
    const { applicationId, documentType } = params;

    if (!applicationId || !documentType) {
      showToast('Invalid document parameters', 'error');
      navigateTo('/applications');
      return;
    }

    renderNavbar('Document Viewer');

    // Show loading state
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="animate-spin mb-4">
            <i data-lucide="loader" class="w-12 h-12 text-blue-400 mx-auto"></i>
          </div>
          <p class="text-gray-400">Loading document...</p>
        </div>
      </div>
    `;

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
        showToast('Application must be approved to view documents', 'error');
        navigateTo(`/application/${applicationId}`);
        return;
      }

      // Get document metadata
      const metadata = getDocumentMetadata(documentType);
      if (!metadata) {
        showToast('Invalid document type', 'error');
        navigateTo(`/application-documents/${applicationId}`);
        return;
      }

      // Load document template
      const template = await loadDocumentTemplate(documentType);
      if (!template) {
        showToast('Unable to load document template', 'error');
        navigateTo(`/application-documents/${applicationId}`);
        return;
      }

      // Create a student-like object from application data for placeholder replacement
      const studentData = {
        id: application.id,
        fullNameEnglish: application.fullNameEnglish,
        fullNameBangla: application.fullNameBangla,
        fatherName: application.fatherName,
        motherName: application.motherName,
        currentRollNumber: application.rollNumber,
        registrationNumber: application.registrationNumber,
        department: application.department,
        session: application.session,
        shift: application.shift,
        email: application.email,
        semester: extractSemesterFromSession(application.session),
        issueDate: formatDate(new Date(), 'long')
      };

      // Replace placeholders with application data
      const renderedDocument = placeholderEngine.replacePlaceholders(template, studentData);

      // Check for unreplaced placeholders
      if (placeholderEngine.hasUnreplacedPlaceholders(renderedDocument)) {
        console.warn('Warning: Some placeholders were not replaced');
      }

      // Render the viewer
      mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
          <!-- Header with Navigation and Actions -->
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button onclick="navigateTo('/application-documents/${applicationId}')" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                Back to Documents
              </button>
              <span class="text-gray-600">/</span>
              <span class="text-white font-medium">${metadata.name}</span>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button onclick="printApplicationDocument()" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all hover-lift">
                <i data-lucide="printer" class="w-4 h-4"></i>
                Print Document
              </button>
              <button onclick="downloadApplicationDocumentPDF('${application.fullNameEnglish}', '${metadata.name}')" class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all hover-lift">
                <i data-lucide="download" class="w-4 h-4"></i>
                Download PDF
              </button>
            </div>
          </div>

          <!-- Document Container -->
          <div class="bg-white rounded-lg shadow-lg p-8 print-container" id="document-content">
            ${renderedDocument}
          </div>

          <!-- Print Styles -->
          <style>
            @media print {
              body {
                background: white;
              }
              .navbar, .sidebar, #navbar, #sidebar {
                display: none !important;
              }
              .max-w-6xl {
                max-width: 100%;
              }
              .print-container {
                box-shadow: none;
                padding: 0;
              }
            }
          </style>
        </div>
      `;

      lucide.createIcons();
    } catch (error) {
      console.error('Error rendering document viewer:', error);
      showToast('Error loading document', 'error');
      navigateTo('/applications');
    }
  }

  /**
   * Print the application document
   */
  function printApplicationDocument() {
    window.print();
  }

  /**
   * Download application document as PDF
   * @param {string} studentName - Student name for filename
   * @param {string} documentName - Document name for filename
   */
  function downloadApplicationDocumentPDF(studentName, documentName) {
    const element = document.getElementById('document-content');
    const filename = `${studentName}_${documentName}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
  }

  /**
   * Extract semester from session string
   * @param {string} session - Session string (e.g., "2024-2025")
   * @returns {number} Estimated semester
   */
  function extractSemesterFromSession(session) {
    // This is a placeholder - in real implementation, you'd need actual semester data
    return 1;
  }

  // Export to global scope
  window.renderApplicationDocumentViewer = renderApplicationDocumentViewer;
  window.printApplicationDocument = printApplicationDocument;
  window.downloadApplicationDocumentPDF = downloadApplicationDocumentPDF;

  window.ApplicationDocumentViewerPage = {
    render: renderApplicationDocumentViewer
  };

})();
