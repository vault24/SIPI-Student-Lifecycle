// Document Selection Modal Component
// Displays available document types for selection

/**
 * Show document selection modal
 * @param {string} studentId - Student ID
 */
function showDocumentSelectionModal(studentId) {
  // Remove any existing modals first
  const existingModals = document.querySelectorAll('[id^="modal-"]');
  existingModals.forEach(modal => modal.remove());

  let modalContainer = document.getElementById('modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
  }

  const modalId = generateUUID();

  const documentTypes = getAllDocumentTypes();
  const documentGrid = documentTypes.map(docType => {
    const metadata = getDocumentMetadata(docType);
    return `
      <button 
        class="document-select-btn group relative p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-left"
        data-student-id="${studentId}"
        data-doc-type="${docType}"
      >
        <!-- Icon -->
        <div class="w-12 h-12 bg-${metadata.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${metadata.color}-200 transition-colors">
          <i data-lucide="${metadata.icon}" class="w-6 h-6 text-${metadata.color}-600"></i>
        </div>

        <!-- Title -->
        <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          ${metadata.name}
        </h3>

        <!-- Description -->
        <p class="text-sm text-gray-600 mb-4">
          ${metadata.description}
        </p>

        <!-- Arrow Icon -->
        <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <i data-lucide="arrow-right" class="w-5 h-5 text-blue-600"></i>
        </div>
      </button>
    `;
  }).join('');

  const modal = document.createElement('div');
  modal.id = `modal-${modalId}`;
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop overflow-y-auto';
  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8 fade-in my-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-3xl font-bold text-gray-900">Generate Document</h2>
          <button class="close-modal-btn text-gray-400 hover:text-gray-600 transition-colors" data-modal-id="${modalId}">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>
        <p class="text-gray-600">Select the type of document you want to generate for this student.</p>
      </div>

      <!-- Document Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        ${documentGrid}
      </div>

      <!-- Footer -->
      <div class="flex justify-end pt-6 border-t border-gray-200">
        <button 
          class="close-modal-btn px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          data-modal-id="${modalId}"
        >
          Cancel
        </button>
      </div>
    </div>
  `;

  modalContainer.appendChild(modal);
  lucide.createIcons();

  // Add event listeners
  const closeButtons = modal.querySelectorAll('.close-modal-btn');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById(`modal-${modalId}`);
      if (modal) modal.remove();
    });
  });

  const selectButtons = modal.querySelectorAll('.document-select-btn');
  selectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const studentId = btn.getAttribute('data-student-id');
      const docType = btn.getAttribute('data-doc-type');
      
      // Remove modal
      const modal = document.getElementById(`modal-${modalId}`);
      if (modal) modal.remove();
      
      // Navigate after a short delay
      setTimeout(() => {
        navigateTo(`/document-viewer/${studentId}/${docType}`);
      }, 100);
    });
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Export to global scope
window.showDocumentSelectionModal = showDocumentSelectionModal;
