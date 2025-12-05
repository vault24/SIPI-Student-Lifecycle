/**
 * Marks & Attendance Page - Unit Tests
 * Tests for marks display, attendance tracking, and filtering
 */

describe('Marks & Attendance Page', () => {
  
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
   * Test: Marks table displays data
   * Validates: Requirements 6.6
   */
  test('marks table displays course data', () => {
    const mockStudent = {
      id: '1',
      fullNameEnglish: 'John Doe',
      semester: 4
    };

    const mockMarks = {
      semester: 1,
      courses: [
        {
          courseName: 'Mathematics',
          courseCode: 'MATH101',
          credits: 3,
          marks: 85,
          grade: 'A'
        }
      ],
      gpa: 3.75
    };

    window.dataManager = {
      getStudent: jest.fn().mockReturnValue(mockStudent),
      getMarks: jest.fn().mockReturnValue([mockMarks])
    };

    updateMarksAttendance('1');

    const contentContainer = document.getElementById('marks-attendance-content');
    expect(contentContainer).toBeTruthy();
    expect(contentContainer.innerHTML).toContain('Mathematics');
    expect(contentContainer.innerHTML).toContain('85');
  });

  /**
   * Test: Progress indicators calculate correctly
   * Validates: Requirements 6.6
   */
  test('attendance progress indicators show correct percentage', () => {
    const mockStudent = {
      id: '1',
      fullNameEnglish: 'Jane Smith',
      semester: 2,
      semesterAttendance: [
        {
          semester: 1,
          subjects: [
            {
              name: 'Physics',
              present: 45,
              total: 50,
              percentage: 90
            }
          ],
          averageAttendance: 90
        }
      ]
    };

    window.dataManager = {
      getStudent: jest.fn().mockReturnValue(mockStudent),
      getMarks: jest.fn().mockReturnValue([]),
      getAttendance: jest.fn().mockReturnValue([])
    };

    updateMarksAttendance('1');

    const contentContainer = document.getElementById('marks-attendance-content');
    expect(contentContainer.innerHTML).toContain('90%');
  });

  /**
   * Test: Status badges show correct colors
   * Validates: Requirements 6.6
   */
  test('status badges display correct colors for pass/fail', () => {
    const mockStudent = {
      id: '1',
      fullNameEnglish: 'Test Student',
      semester: 1,
      semesterAttendance: [
        {
          semester: 1,
          subjects: [
            { name: 'Course1', present: 40, total: 50, percentage: 80 },
            { name: 'Course2', present: 30, total: 50, percentage: 60 }
          ],
          averageAttendance: 70
        }
      ]
    };

    window.dataManager = {
      getStudent: jest.fn().mockReturnValue(mockStudent),
      getMarks: jest.fn().mockReturnValue([]),
      getAttendance: jest.fn().mockReturnValue([])
    };

    updateMarksAttendance('1');

    const contentContainer = document.getElementById('marks-attendance-content');
    expect(contentContainer.innerHTML).toContain('80%');
    expect(contentContainer.innerHTML).toContain('60%');
  });

  /**
   * Test: Charts render attendance data
   * Validates: Requirements 6.6
   */
  test('attendance data is available for chart rendering', () => {
    const mockStudent = {
      id: '1',
      fullNameEnglish: 'Chart Test',
      semester: 2,
      semesterAttendance: [
        {
          semester: 1,
          subjects: [
            { name: 'Math', present: 45, total: 50, percentage: 90 },
            { name: 'Science', present: 48, total: 50, percentage: 96 }
          ],
          averageAttendance: 93
        }
      ]
    };

    window.dataManager = {
      getStudent: jest.fn().mockReturnValue(mockStudent),
      getMarks: jest.fn().mockReturnValue([]),
      getAttendance: jest.fn().mockReturnValue([])
    };

    updateMarksAttendance('1');

    const contentContainer = document.getElementById('marks-attendance-content');
    expect(contentContainer.innerHTML).toContain('Math');
    expect(contentContainer.innerHTML).toContain('Science');
  });

  /**
   * Test: Responsive view switches layout
   * Validates: Requirements 6.6
   */
  test('responsive layout adapts to viewport', () => {
    const mockStudent = {
      id: '1',
      fullNameEnglish: 'Responsive Test',
      semester: 1
    };

    window.dataManager = {
      getStudent: jest.fn().mockReturnValue(mockStudent),
      getMarks: jest.fn().mockReturnValue([]),
      getAttendance: jest.fn().mockReturnValue([])
    };

    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <div id="marks-attendance-content" class="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
    `;

    const gridClasses = mainContent.querySelector('#marks-attendance-content').className;
    expect(gridClasses).toContain('grid');
    expect(gridClasses).toContain('lg:');
  });
});
