/**
 * Documents Page - Unit Tests
 * Tests for document rendering, filtering, and CRUD operations
 */

describe('Documents Page', () => {
  
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="main-content"></div>
      <div id="navbar"></div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  /**
   * Test: Documents load and display correctly
   * Validates: Requirements 6.4
   */
  test('documents load and display in grid', async () => {
    const mockDocuments = [
      {
        id: '1',
        file_name: 'document1.pdf',
        category: 'Certificate',
        file_size: 1024,
        upload_date: '2024-01-01',
        file: '#',
        student_name: 'John Doe'
      },
      {
        id: '2',
        file_name: 'document2.pdf',
        category: 'Marksheet',
        file_size: 2048,
        upload_date: '2024-01-02',
        file: '#',
        student_name: 'Jane Smith'
      }
    ];

    // Mock the API
    window.backendAPI = {
      documents: {
        getAll: jest.fn().mockResolvedValue(mockDocuments)
      }
    };

    window.renderNavbar = jest.fn();
    window.lucide = { createIcons: jest.fn() };

    await renderDocuments();

    const grid = document.getElementById('documents-grid');
    expect(grid).toBeTruthy();
    expect(grid.children.length).toBe(2);
  });

  /**
   * Test: File upload modal opens
   * Validates: Requirements 6.4
   */
  test('file upload modal opens with form', async () => {
    window.backendAPI = {
      students: {
        getAll: jest.fn().mockResolvedValue([
          { id: '1', full_name_english: 'John Doe', current_roll_number: '001' }
        ])
      }
    };

    window.showFormModal = jest.fn();

    await uploadDocumentGeneral();

    expect(window.showFormModal).toHaveBeenCalled();
    const callArgs = window.showFormModal.mock.calls[0][0];
    expect(callArgs.title).toBe('Upload Document');
    expect(callArgs.fields.length).toBeGreaterThan(0);
  });

  /**
   * Test: File upload processes correctly
   * Validates: Requirements 6.4, 10.5
   */
  test('file upload processes and refreshes list', async () => {
    const mockUpload = jest.fn().mockResolvedValue({ success: true });
    window.backendAPI = {
      documents: {
        upload: mockUpload,
        getAll: jest.fn().mockResolvedValue([])
      }
    };

    window.showFormModal = jest.fn((config) => {
      config.onSubmit({
        studentId: '1',
        category: 'Certificate',
        file: new File(['test'], 'test.pdf')
      });
    });

    window.showToast = jest.fn();
    window.renderNavbar = jest.fn();
    window.lucide = { createIcons: jest.fn() };

    await uploadDocumentGeneral();

    expect(mockUpload).toHaveBeenCalled();
  });

  /**
   * Test: Delete button shows confirmation
   * Validates: Requirements 6.4
   */
  test('delete button shows confirmation modal', () => {
    window.showConfirmModal = jest.fn();

    deleteDocumentConfirm('123');

    expect(window.showConfirmModal).toHaveBeenCalled();
    const callArgs = window.showConfirmModal.mock.calls[0][0];
    expect(callArgs.title).toBe('Delete Document');
    expect(callArgs.type).toBe('danger');
  });

  /**
   * Test: Filter by reason works
   * Validates: Requirements 6.4
   */
  test('filter by category filters results', async () => {
    const mockDocuments = [
      {
        id: '1',
        file_name: 'cert.pdf',
        category: 'Certificate',
        file_size: 1024,
        upload_date: '2024-01-01',
        file: '#',
        student_name: 'John'
      }
    ];

    window.backendAPI = {
      documents: {
        getAll: jest.fn().mockResolvedValue(mockDocuments)
      }
    };

    window.renderNavbar = jest.fn();
    window.lucide = { createIcons: jest.fn() };

    await renderDocuments();

    const filterSelect = document.getElementById('filter-category');
    expect(filterSelect).toBeTruthy();
    expect(filterSelect.options.length).toBeGreaterThan(1);
  });

  /**
   * Test: Responsive layout adapts
   * Validates: Requirements 6.4, 8.3
   */
  test('responsive layout adapts to viewport', async () => {
    window.backendAPI = {
      documents: {
        getAll: jest.fn().mockResolvedValue([])
      }
    };

    window.renderNavbar = jest.fn();
    window.lucide = { createIcons: jest.fn() };

    await renderDocuments();

    const grid = document.getElementById('documents-grid');
    const gridClasses = grid.parentElement.className;
    
    expect(gridClasses).toContain('grid');
    expect(gridClasses).toContain('md:');
    expect(gridClasses).toContain('lg:');
  });
});
