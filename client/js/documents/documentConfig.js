// Document Configuration and Constants
// Defines all available document types and their metadata

const DOCUMENT_TYPES = {
  TESTIMONIAL: 'testimonial',
  CHARACTER_CERTIFICATE: 'character-certificate',
  ACADEMIC_TRANSCRIPT: 'academic-transcript',
  MARKSHEET: 'marksheet',
  STUDENT_ID_CARD: 'student-id-card',
  CLEARANCE_CERTIFICATE: 'clearance-certificate',
  ADMIT_CARD: 'admit-card'
};

const DOCUMENT_METADATA = {
  [DOCUMENT_TYPES.TESTIMONIAL]: {
    name: 'Testimonial',
    description: 'Official testimonial letter from the institution',
    icon: 'file-text',
    color: 'blue'
  },
  [DOCUMENT_TYPES.CHARACTER_CERTIFICATE]: {
    name: 'Character Certificate',
    description: 'Certificate of good character and conduct',
    icon: 'award',
    color: 'green'
  },
  [DOCUMENT_TYPES.ACADEMIC_TRANSCRIPT]: {
    name: 'Academic Transcript',
    description: 'Complete academic record with semester-wise results',
    icon: 'book-open',
    color: 'purple'
  },
  [DOCUMENT_TYPES.MARKSHEET]: {
    name: 'Marksheet',
    description: 'Subject-wise marks and grades',
    icon: 'bar-chart-2',
    color: 'orange'
  },
  [DOCUMENT_TYPES.STUDENT_ID_CARD]: {
    name: 'Student ID Card',
    description: 'Official student identification card',
    icon: 'credit-card',
    color: 'red'
  },
  [DOCUMENT_TYPES.CLEARANCE_CERTIFICATE]: {
    name: 'Clearance Certificate',
    description: 'Library and accounts clearance certificate',
    icon: 'check-circle',
    color: 'teal'
  },
  [DOCUMENT_TYPES.ADMIT_CARD]: {
    name: 'Admit Card',
    description: 'Exam admit card with center details',
    icon: 'ticket',
    color: 'indigo'
  }
};

// Get all document types as array
function getAllDocumentTypes() {
  return Object.values(DOCUMENT_TYPES);
}

// Get metadata for a document type
function getDocumentMetadata(documentType) {
  return DOCUMENT_METADATA[documentType] || null;
}

// Export to global scope
window.DOCUMENT_TYPES = DOCUMENT_TYPES;
window.DOCUMENT_METADATA = DOCUMENT_METADATA;
window.getAllDocumentTypes = getAllDocumentTypes;
window.getDocumentMetadata = getDocumentMetadata;
