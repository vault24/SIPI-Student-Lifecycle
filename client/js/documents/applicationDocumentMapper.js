/**
 * Application Document Mapper
 * Maps application types to available document templates
 * Handles the automation of document generation after application approval
 */

const APPLICATION_DOCUMENT_MAPPING = {
  'Testimonial': ['testimonial'],
  'Certificate': ['character-certificate', 'clearance-certificate'],
  'Character Certificate': ['character-certificate'],
  'Transcript': ['academic-transcript', 'marksheet'],
  'Stipend': ['character-certificate', 'academic-transcript'],
  'Transfer': ['character-certificate', 'academic-transcript', 'clearance-certificate'],
  'Admit Card': ['admit-card'],
  'Other Documents': ['testimonial', 'character-certificate', 'academic-transcript', 'marksheet', 'student-id-card', 'clearance-certificate', 'admit-card']
};

/**
 * Get available documents for an application type
 * @param {string} applicationType - The type of application
 * @returns {array} Array of document type keys
 */
function getDocumentsForApplicationType(applicationType) {
  return APPLICATION_DOCUMENT_MAPPING[applicationType] || [];
}

/**
 * Get document metadata for application type
 * @param {string} applicationType - The type of application
 * @returns {array} Array of document metadata objects
 */
function getDocumentMetadataForApplicationType(applicationType) {
  const documentTypes = getDocumentsForApplicationType(applicationType);
  return documentTypes.map(docType => ({
    type: docType,
    metadata: getDocumentMetadata(docType)
  })).filter(doc => doc.metadata !== null);
}

/**
 * Check if application type has associated documents
 * @param {string} applicationType - The type of application
 * @returns {boolean}
 */
function hasDocumentsForApplicationType(applicationType) {
  return getDocumentsForApplicationType(applicationType).length > 0;
}

/**
 * Get the primary document for an application type
 * (the first one in the mapping)
 * @param {string} applicationType - The type of application
 * @returns {string|null} Document type or null
 */
function getPrimaryDocumentForApplicationType(applicationType) {
  const documents = getDocumentsForApplicationType(applicationType);
  return documents.length > 0 ? documents[0] : null;
}

// Export to global scope
window.APPLICATION_DOCUMENT_MAPPING = APPLICATION_DOCUMENT_MAPPING;
window.getDocumentsForApplicationType = getDocumentsForApplicationType;
window.getDocumentMetadataForApplicationType = getDocumentMetadataForApplicationType;
window.hasDocumentsForApplicationType = hasDocumentsForApplicationType;
window.getPrimaryDocumentForApplicationType = getPrimaryDocumentForApplicationType;
