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
      const template = await loadDocumentTemplate(documentType, student);
      if (!template) {
        showErrorToast('Unable to load document template');
        navigateTo(`/student/${studentId}`);
        return;
      }

      // Replace placeholders with student data (only if template uses placeholders)
      const renderedDocument = template.includes('{{') ? placeholderEngine.replacePlaceholders(template, student) : template;

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
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
              }
              
              html {
                margin: 0 !important;
                padding: 0 !important;
              }
              
              /* Hide all UI elements */
              #navbar, #sidebar, .navbar, .sidebar, nav, footer {
                display: none !important;
              }
              
              /* Hide header with navigation and buttons */
              .max-w-6xl > div:first-child {
                display: none !important;
              }
              
              /* Hide action buttons */
              button {
                display: none !important;
              }
              
              /* Show document container */
              .max-w-6xl {
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              
              .print-container {
                box-shadow: none !important;
                border: none !important;
                padding: 40px !important;
                margin: 0 !important;
                background: white !important;
                max-width: 100% !important;
                width: 100% !important;
                display: block !important;
              }
              
              .document-container {
                display: block !important;
                visibility: visible !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              
              .document-header, .document-content, .document-footer {
                page-break-inside: avoid;
              }
              
              /* Prevent page margins */
              @page {
                margin: 0.5in;
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
   * @param {object} student - Student data object
   * @returns {Promise<string>} - Template HTML
   */
  async function loadDocumentTemplate(documentType, student) {
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

      // Call the template function with student data
      // Some templates need student data, others don't
      return templateFunction(student);
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
