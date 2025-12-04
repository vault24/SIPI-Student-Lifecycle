// Property-Based Tests for Document Selection Modal
// **Feature: document-generation-print, Property 5: Modal Document List Completeness**
// **Validates: Requirements 1.4**

describe('Document Selection Modal - Property Tests', () => {
  let modalContainer;

  beforeEach(() => {
    // Create modal container
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(modalContainer);
  });

  /**
   * Property 5: Modal Document List Completeness
   * For any student profile, when the document selection modal is opened,
   * the system SHALL display all seven document types (Testimonial, Character Certificate,
   * Academic Transcript, Marksheet, Student ID Card, Clearance Certificate, Admit Card)
   * with icons and descriptions.
   */
  test('Property 5: Modal displays all 7 document types with icons and descriptions', () => {
    // Arrange
    const studentId = 'test-student-123';
    const expectedDocumentTypes = [
      DOCUMENT_TYPES.TESTIMONIAL,
      DOCUMENT_TYPES.CHARACTER_CERTIFICATE,
      DOCUMENT_TYPES.ACADEMIC_TRANSCRIPT,
      DOCUMENT_TYPES.MARKSHEET,
      DOCUMENT_TYPES.STUDENT_ID_CARD,
      DOCUMENT_TYPES.CLEARANCE_CERTIFICATE,
      DOCUMENT_TYPES.ADMIT_CARD
    ];

    // Act
    showDocumentSelectionModal(studentId);

    // Assert - Verify modal is displayed
    const modal = modalContainer.querySelector('[id^="modal-"]');
    expect(modal).toBeTruthy();

    // Assert - Verify all 7 document types are present
    expectedDocumentTypes.forEach(docType => {
      const metadata = getDocumentMetadata(docType);
      
      // Check that document name is in the modal
      const documentNameElement = Array.from(modal.querySelectorAll('h3')).find(
        el => el.textContent.includes(metadata.name)
      );
      expect(documentNameElement).toBeTruthy();

      // Check that description is in the modal
      const descriptionElement = Array.from(modal.querySelectorAll('p')).find(
        el => el.textContent.includes(metadata.description)
      );
      expect(descriptionElement).toBeTruthy();

      // Check that icon is present
      const iconElement = modal.querySelector(`[data-lucide="${metadata.icon}"]`);
      expect(iconElement).toBeTruthy();
    });

    // Assert - Verify exactly 7 document buttons are present
    const documentButtons = modal.querySelectorAll('button[onclick*="selectDocument"]');
    expect(documentButtons.length).toBe(7);

    // Assert - Verify each button has correct onclick handler
    documentButtons.forEach((button, index) => {
      expect(button.getAttribute('onclick')).toContain('selectDocument');
      expect(button.getAttribute('onclick')).toContain(studentId);
    });
  });

  /**
   * Property 5 - Extended: Modal completeness across multiple invocations
   * For any student ID, when the modal is opened multiple times,
   * all 7 document types SHALL always be present
   */
  test('Property 5 Extended: Modal displays all 7 documents consistently across multiple invocations', () => {
    // Arrange
    const studentIds = ['student-1', 'student-2', 'student-3'];
    const expectedCount = 7;

    // Act & Assert
    studentIds.forEach(studentId => {
      // Clear previous modal
      const previousModal = modalContainer.querySelector('[id^="modal-"]');
      if (previousModal) {
        previousModal.remove();
      }

      // Show modal
      showDocumentSelectionModal(studentId);

      // Verify document count
      const modal = modalContainer.querySelector('[id^="modal-"]');
      const documentButtons = modal.querySelectorAll('button[onclick*="selectDocument"]');
      expect(documentButtons.length).toBe(expectedCount);

      // Verify all document types are present
      const documentNames = Array.from(modal.querySelectorAll('h3')).map(el => el.textContent);
      expect(documentNames.length).toBe(expectedCount);
    });
  });

  /**
   * Property 5 - Edge Case: Modal with special characters in student ID
   * For any student ID (including special characters), the modal SHALL
   * display all 7 document types correctly
   */
  test('Property 5 Edge Case: Modal displays all documents with special character student IDs', () => {
    // Arrange
    const specialStudentIds = [
      'student-123-abc',
      'student_456_def',
      'student.789.ghi'
    ];

    // Act & Assert
    specialStudentIds.forEach(studentId => {
      // Clear previous modal
      const previousModal = modalContainer.querySelector('[id^="modal-"]');
      if (previousModal) {
        previousModal.remove();
      }

      // Show modal
      showDocumentSelectionModal(studentId);

      // Verify modal is created
      const modal = modalContainer.querySelector('[id^="modal-"]');
      expect(modal).toBeTruthy();

      // Verify all 7 documents are present
      const documentButtons = modal.querySelectorAll('button[onclick*="selectDocument"]');
      expect(documentButtons.length).toBe(7);

      // Verify student ID is correctly passed to onclick handlers
      documentButtons.forEach(button => {
        expect(button.getAttribute('onclick')).toContain(`'${studentId}'`);
      });
    });
  });
});
