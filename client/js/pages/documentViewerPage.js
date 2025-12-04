// Document Viewer Page
// Displays rendered documents with print and download options

(function() {
  'use strict';

  async function renderDocumentViewer(params) {
    const { studentId, documentType } = params;

    if (!studentId || !documentType) {
      showErrorToast('Invalid document parameters');
      navigateTo('/students');
      return;
    }

    renderNavbar('Document Viewer');

    // Show loading skeleton
    showLoadingSkeleton('main-content', 'card');

    try {
      // Fetch student data
      const student = await dataManager.getStudent(studentId);

      if (!student) {
        showErrorToast('Student not found');
        navigateTo('/students');
        return;
      }

      // Get document metadata
      const metadata = getDocumentMetadata(documentType);
      if (!metadata) {
        showErrorToast('Invalid document type');
        navigateTo(`/student/${studentId}`);
        return;
      }

      // Load and render the appropriate template
      const template = await loadDocumentTemplate(documentType);
      if (!template) {
        showErrorToast('Unable to load document template');
        navigateTo(`/student/${studentId}`);
        return;
      }

      // Replace placeholders with student data
      const renderedDocument = placeholderEngine.replacePlaceholders(template, student);

      // Check for unreplaced placeholders
      if (placeholderEngine.hasUnreplacedPlaceholders(renderedDocument)) {
        console.warn('Warning: Some placeholders were not replaced');
      }

      // Render the viewer
      const mainContent = document.getElementById('main-content');
      mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
          <!-- Header with Navigation and Actions -->
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button onclick="navigateTo('/student/${studentId}')" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                Back to Student
              </button>
              <span class="text-gray-600">/</span>
              <span class="text-white font-medium">${metadata.name}</span>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button onclick="printDocument()" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all hover-lift">
                <i data-lucide="printer" class="w-4 h-4"></i>
                Print Document
              </button>
              <button onclick="downloadDocumentPDF('${student.fullNameEnglish}', '${metadata.name}')" class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all hover-lift">
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
                border: none;
                padding: 0;
                margin: 0;
              }
              .document-header, .document-content, .document-footer {
                page-break-inside: avoid;
              }
            }
          </style>
        </div>
      `;

      lucide.createIcons();

    } catch (error) {
      console.error('Error rendering document viewer:', error);
      handleAPIError(error);
      navigateTo(`/student/${studentId}`);
    }
  }

  /**
   * Load document template from file
   * @param {string} documentType - Type of document
   * @returns {Promise<string>} - Template HTML
   */
  async function loadDocumentTemplate(documentType) {
    try {
      // Map document types to template function names
      const templateFunctionMap = {
        [DOCUMENT_TYPES.TESTIMONIAL]: 'getTestimonialTemplate',
        [DOCUMENT_TYPES.CHARACTER_CERTIFICATE]: 'getCharacterCertificateTemplate',
        [DOCUMENT_TYPES.ACADEMIC_TRANSCRIPT]: 'getAcademicTranscriptTemplate',
        [DOCUMENT_TYPES.MARKSHEET]: 'getMarksheetTemplate',
        [DOCUMENT_TYPES.STUDENT_ID_CARD]: 'getStudentIdCardTemplate',
        [DOCUMENT_TYPES.CLEARANCE_CERTIFICATE]: 'getClearanceCertificateTemplate',
        [DOCUMENT_TYPES.ADMIT_CARD]: 'getAdmitCardTemplate'
      };

      const templateFunctionName = templateFunctionMap[documentType];
      if (!templateFunctionName) {
        console.error('Unknown document type:', documentType);
        return null;
      }

      // Get template function from global scope
      const templateFunction = window[templateFunctionName];
      if (!templateFunction || typeof templateFunction !== 'function') {
        console.error(`Template function ${templateFunctionName} not found in global scope`);
        console.error('Available functions:', Object.keys(window).filter(key => key.includes('Template')));
        return null;
      }

      // Call the template function to get the HTML
      return templateFunction();
    } catch (error) {
      console.error('Error loading template:', error);
      return null;
    }
  }

  /**
   * Print the document
   */
  function printDocument() {
    window.print();
  }

  /**
   * Download document as PDF
   * @param {string} studentName - Student name for filename
   * @param {string} documentName - Document name for filename
   */
  async function downloadDocumentPDF(studentName, documentName) {
    try {
      // Check if html2pdf is available
      if (typeof html2pdf === 'undefined') {
        showErrorToast('PDF library not loaded. Please try again.');
        return;
      }

      const element = document.getElementById('document-content');
      const filename = `${studentName}_${documentName}_${new Date().toISOString().split('T')[0]}.pdf`;

      const options = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };

      html2pdf().set(options).from(element).save();
      showSuccessToast('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showErrorToast('Failed to download PDF. Please try printing instead.');
    }
  }

  // Export to global scope
  window.renderDocumentViewer = renderDocumentViewer;
  window.printDocument = printDocument;
  window.downloadDocumentPDF = downloadDocumentPDF;
  window.loadDocumentTemplate = loadDocumentTemplate;

  window.DocumentViewerPage = {
    render: renderDocumentViewer
  };

})();
