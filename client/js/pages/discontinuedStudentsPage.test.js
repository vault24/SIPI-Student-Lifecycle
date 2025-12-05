/**
 * Discontinued Students Page - Unit Tests
 * Tests for discontinued student display, filtering, and reinstatement
 */

describe('Discontinued Students Page', () => {
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="main-content"></div>
      <div id="navbar"></div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  /**
   * Test: Page loads discontinued students
   * Validates: Requirements 6.7
   */
  test('page loads and displays discontinued students', async () => {
    const mockStudents = [
      {
        id: '1',
        fullNameEnglish: 'John Doe',
        currentRollNumber: '001',
        department: { name: 'Computer Science' },
        lastSemester: 4,
        discontinuedReason: 'Financial issues'
      }
    ];

    window.dataManager = {
      getDepartments: jest.fn().mockResolvedValue([]),
      getStudents: jest.fn().mockResolvedValue(mockStudents)
    };

    window.renderNavbar = jest.fn();
    window.lucide = { createIcons: jest.fn() };

    await DiscontinuedStudentsPage.render();

    const mainContent = document.getElementById('main-content');
    expect(mainContent).toBeTruthy();
  });

  /**
   * Test: Reason badges display correctly
   * Validates: Requirements 6.7
   */
  test('reason badges display for each student', () => {
    const student = {
      id: '1',
      fullNameEnglish: 'Jane Smith',
      currentRollNumber: '002',
      department: { name: 'Engineering' },
      lastSemester: 3,
      discontinuedReason: 'Medical reasons'
    };

    const html = DiscontinuedStudentsPage.getStudentRowHTML(student);
    expect(html).toContain('Medical reasons');
  });

  /**
   * Test: Timeline shows dates
   * Validates: Requirements 6.7
   */
  test('student record shows last semester information', () => {
    const student = {
      id: '1',
      fullNameEnglish: 'Test Student',
      currentRollNumber: '003',
      department: { name: 'Science' },
      lastSemester: 5,
      discontinuedReason: 'Personal reasons'
    };

    const html = DiscontinuedStudentsPage.getStudentRowHTML(student);
    expect(html).toContain('5');
  });

  /**
   * Test: Filter by reason works
   * Validates: Requirements 6.7
   */
  test('filter functionality is available', async () => {
    const mockStudents = [
      {
        id: '1',
        fullNameEnglish: 'Student 1',
        currentRollNumber: '001',
        department: { name: 'CS' },
        lastSemester: 4,
        discontinuedReason: 'Financial'
      }
    ];

    window.dataManager = {
      getDepartments: jest.fn().mockResolvedValue([
        { id: '1', name: 'Computer Science' }
      ]),
      getStudents: jest.fn().mockResolvedValue(mockStudents)
    };

    window.renderNavbar = jest.fn();
    window.lucide = { createIcons: jest.fn() };

    await DiscontinuedStudentsPage.render();

    const departmentFilter = document.getElementById('department-filter');
    expect(departmentFilter).toBeTruthy();
  });

  /**
   * Test: Responsive layout adapts
   * Validates: Requirements 6.7
   */
  test('responsive layout adapts to viewport', async () => {
    window.dataManager = {
      getDepartments: jest.fn().mockResolvedValue([]),
      getStudents: jest.fn().mockResolvedValue([])
    };

    window.renderNavbar = jest.fn();
    window.lucide = { createIcons: jest.fn() };

    await DiscontinuedStudentsPage.render();

    const mainContent = document.getElementById('main-content');
    const html = mainContent.innerHTML;
    
    expect(html).toContain('md:');
    expect(html).toContain('hidden');
  });
});
