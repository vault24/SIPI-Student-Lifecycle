// marksAttendancePage.js
// Extracted from app.js

(function() {
    'use strict';

async function renderMarksAttendance() {
    renderNavbar('Marks & Attendance');
    
    const students = await dataManager.getStudents();
    const departments = await dataManager.getDepartments();
    const selectedStudentId = students[0]?.id || null;
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Marks & Attendance</h2>
            </div>

            <!-- Search and Filters -->
            <div class="mb-6 space-y-4">
                <!-- Search Bar -->
                <div class="relative">
                    <input 
                        type="text" 
                        id="student-search" 
                        placeholder="Search by name or roll number..." 
                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onkeyup="filterStudentsMarksAttendance()"
                    >
                    <i data-lucide="search" class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>

                <!-- Filters Row -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select id="department-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onchange="filterStudentsMarksAttendance()">
                        <option value="">All Departments</option>
                        ${departments.map(dept => `<option value="${dept.name}">${dept.name}</option>`).join('')}
                    </select>
                    
                    <select id="semester-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onchange="filterStudentsMarksAttendance()">
                        <option value="">All Semesters</option>
                        ${Array.from({ length: 8 }, (_, i) => i + 1).map(sem => `<option value="${sem}">Semester ${sem}</option>`).join('')}
                    </select>
                    
                    <select id="status-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onchange="filterStudentsMarksAttendance()">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="graduated">Graduated</option>
                    </select>

                    <button onclick="clearMarksAttendanceFilters()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="x" class="w-4 h-4"></i>
                        Clear Filters
                    </button>
                </div>
            </div>

            <!-- Student Selector -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                <select id="student-selector" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    ${students.map(s => `<option value="${s.id}">${s.fullName} (${s.rollNumber}) - ${s.department}</option>`).join('')}
                </select>
                <p id="student-count" class="text-sm text-gray-500 mt-2">${students.length} student(s) found</p>
            </div>

            <!-- Semester Tabs -->
            <div id="semester-tabs" class="flex gap-2 mb-6 overflow-x-auto">
                <!-- Tabs will be rendered here -->
            </div>

            <!-- Content -->
            <div id="marks-attendance-content" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Content will be rendered here -->
            </div>
        </div>
    `;
    
    lucide.createIcons();
    
    // Add event listener
    document.getElementById('student-selector').addEventListener('change', (e) => {
        updateMarksAttendance(e.target.value);
    });
    
    // Initial render
    if (selectedStudentId) {
        updateMarksAttendance(selectedStudentId);
    }
}

let selectedSemester = 1;

function updateMarksAttendance(studentId) {
    const student = dataManager.getStudent(studentId);
    if (!student) return;
    
    // Render semester tabs
    const tabsContainer = document.getElementById('semester-tabs');
    tabsContainer.innerHTML = Array.from({ length: student.semester }, (_, i) => i + 1).map(sem => `
        <button onclick="selectSemester(${sem})" 
            class="px-4 py-2 rounded-lg transition-colors ${sem === selectedSemester ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
            Semester ${sem}
        </button>
    `).join('');
    
    // Get marks and attendance for selected semester
    const marksArray = dataManager.getMarks(studentId);
    const marks = Array.isArray(marksArray) ? marksArray.find(m => m.semester === selectedSemester) : null;
    
    // Get attendance from new semesterAttendance structure
    const semesterAttendanceData = student.semesterAttendance?.find(a => a.semester === selectedSemester);
    
    // Convert new format to old format for compatibility
    let attendance = null;
    if (semesterAttendanceData) {
        attendance = {
            semester: semesterAttendanceData.semester,
            courses: semesterAttendanceData.subjects.map(subject => ({
                courseName: subject.name,
                courseCode: subject.name.substring(0, 3).toUpperCase(),
                attendedClasses: subject.present,
                totalClasses: subject.total,
                percentage: subject.percentage
            })),
            overallPercentage: semesterAttendanceData.averageAttendance
        };
    } else {
        // Fallback to old structure if exists
        const attendanceArray = dataManager.getAttendance(studentId);
        attendance = Array.isArray(attendanceArray) ? attendanceArray.find(a => a.semester === selectedSemester) : null;
    }
    
    // Render content
    const contentContainer = document.getElementById('marks-attendance-content');
    contentContainer.innerHTML = `
        <!-- Marks Section -->
        <div>
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Marks</h3>
                <button onclick="addMarks('${studentId}')" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <i data-lucide="plus" class="w-4 h-4 inline"></i> Add Marks
                </button>
            </div>
            ${marks ? `
                <div class="space-y-3">
                    ${marks.courses.map(course => `
                        <div class="border border-gray-200 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-2">
                                <div>
                                    <h4 class="font-medium text-gray-900">${course.courseName}</h4>
                                    <p class="text-sm text-gray-500">${course.courseCode} â€¢ ${course.credits} Credits</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-gray-900">${course.marks}</div>
                                    <div class="text-sm text-gray-500">Grade: ${course.grade}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-blue-900">GPA</span>
                            <span class="text-2xl font-bold text-blue-900">${marks.gpa}</span>
                        </div>
                    </div>
                </div>
            ` : '<p class="text-gray-500">No marks recorded for this semester</p>'}
        </div>

        <!-- Attendance Section -->
        <div>
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Attendance</h3>
                <button onclick="addAttendance('${studentId}')" class="text-green-600 hover:text-green-700 text-sm font-medium">
                    <i data-lucide="plus" class="w-4 h-4 inline"></i> Add Attendance
                </button>
            </div>
            ${attendance ? `
                <div class="space-y-3">
                    ${attendance.courses.map(course => `
                        <div class="border border-gray-200 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-2">
                                <div>
                                    <h4 class="font-medium text-gray-900">${course.courseName}</h4>
                                    <p class="text-sm text-gray-500">${course.courseCode}</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-lg font-bold ${course.percentage >= 75 ? 'text-green-600' : 'text-red-600'}">
                                        ${course.percentage}%
                                    </div>
                                    <div class="text-xs text-gray-500">${course.attendedClasses}/${course.totalClasses}</div>
                                </div>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="h-2 rounded-full ${course.percentage >= 75 ? 'bg-green-600' : 'bg-red-600'}" 
                                     style="width: ${course.percentage}%"></div>
                            </div>
                        </div>
                    `).join('')}
                    <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-indigo-900">Overall Attendance</span>
                            <span class="text-2xl font-bold text-indigo-900">${attendance.overallPercentage}%</span>
                        </div>
                    </div>
                </div>
            ` : '<p class="text-gray-500">No attendance recorded for this semester</p>'}
        </div>
    `;
    
    lucide.createIcons();
}

function selectSemester(semester) {
    selectedSemester = semester;
    const studentId = document.getElementById('student-selector').value;
    updateMarksAttendance(studentId);
}

function addMarks(studentId) {
    const student = dataManager.getStudent(studentId);
    if (!student) {
        showToast('Student not found', 'error');
        return;
    }
    
    showFormModal({
        title: `Add Marks - ${student.fullName}`,
        fields: [
            { 
                id: 'semester', 
                label: 'Semester', 
                type: 'select', 
                required: true, 
                options: Array.from({ length: student.semester }, (_, i) => ({
                    value: (i + 1).toString(),
                    label: `Semester ${i + 1}`
                }))
            },
            { id: 'courseName', label: 'Course Name', type: 'text', required: true, placeholder: 'e.g., Mathematics' },
            { id: 'courseCode', label: 'Course Code', type: 'text', required: true, placeholder: 'e.g., MATH101' },
            { id: 'credits', label: 'Credits', type: 'number', required: true, placeholder: 'e.g., 3' },
            { id: 'marks', label: 'Marks Obtained', type: 'number', required: true, placeholder: 'e.g., 85', min: 0, max: 100 },
            { 
                id: 'grade', 
                label: 'Grade', 
                type: 'select', 
                required: true, 
                options: [
                    { value: 'A+', label: 'A+ (80-100)' },
                    { value: 'A', label: 'A (75-79)' },
                    { value: 'A-', label: 'A- (70-74)' },
                    { value: 'B+', label: 'B+ (65-69)' },
                    { value: 'B', label: 'B (60-64)' },
                    { value: 'B-', label: 'B- (55-59)' },
                    { value: 'C+', label: 'C+ (50-54)' },
                    { value: 'C', label: 'C (45-49)' },
                    { value: 'D', label: 'D (40-44)' },
                    { value: 'F', label: 'F (0-39)' }
                ]
            },
            { id: 'gpa', label: 'GPA', type: 'number', required: true, placeholder: 'e.g., 3.75', step: '0.01', min: 0, max: 4 }
        ],
        onSubmit: (formData) => {
            try {
                const marksData = {
                    studentId: studentId,
                    semester: parseInt(formData.semester),
                    courses: [{
                        courseName: formData.courseName,
                        courseCode: formData.courseCode,
                        credits: parseInt(formData.credits),
                        marks: parseInt(formData.marks),
                        grade: formData.grade
                    }],
                    gpa: parseFloat(formData.gpa)
                };
                
                // Check if marks already exist for this semester
                const existingMarksArray = dataManager.getMarks(studentId);
                const existingMarks = Array.isArray(existingMarksArray) ? existingMarksArray : [];
                const semesterMarks = existingMarks.find(m => m.semester === marksData.semester);
                
                if (semesterMarks) {
                    // Add course to existing semester marks
                    semesterMarks.courses.push(marksData.courses[0]);
                    semesterMarks.gpa = marksData.gpa; // Update GPA
                    dataManager.updateMarks(semesterMarks.id, semesterMarks);
                } else {
                    // Create new marks record
                    dataManager.addMarks(marksData);
                }
                
                showToast('Marks added successfully', 'success');
                updateMarksAttendance(studentId);
            } catch (error) {
                showToast(error.message || 'Failed to add marks', 'error');
            }
        }
    });
}

function addAttendance(studentId) {
    const student = dataManager.getStudent(studentId);
    if (!student) {
        showToast('Student not found', 'error');
        return;
    }
    
    showFormModal({
        title: `Add Attendance - ${student.fullName}`,
        fields: [
            { 
                id: 'semester', 
                label: 'Semester', 
                type: 'select', 
                required: true, 
                options: Array.from({ length: student.semester }, (_, i) => ({
                    value: (i + 1).toString(),
                    label: `Semester ${i + 1}`
                }))
            },
            { id: 'courseName', label: 'Course Name', type: 'text', required: true, placeholder: 'e.g., Mathematics' },
            { id: 'courseCode', label: 'Course Code', type: 'text', required: true, placeholder: 'e.g., MATH101' },
            { id: 'attendedClasses', label: 'Classes Attended', type: 'number', required: true, placeholder: 'e.g., 45', min: 0 },
            { id: 'totalClasses', label: 'Total Classes', type: 'number', required: true, placeholder: 'e.g., 50', min: 1 }
        ],
        onSubmit: (formData) => {
            try {
                const attended = parseInt(formData.attendedClasses);
                const total = parseInt(formData.totalClasses);
                
                if (attended > total) {
                    showToast('Attended classes cannot be more than total classes', 'error');
                    return;
                }
                
                const percentage = ((attended / total) * 100).toFixed(2);
                const semesterNum = parseInt(formData.semester);
                
                // Get or create semesterAttendance array on student object
                const currentStudent = dataManager.getStudent(studentId);
                let semesterAttendance = currentStudent.semesterAttendance || [];
                
                // Find existing semester attendance
                let existingSemester = semesterAttendance.find(a => a.semester === semesterNum);
                
                const newSubject = {
                    name: formData.courseName,
                    present: attended,
                    total: total,
                    percentage: parseFloat(percentage)
                };
                
                if (existingSemester) {
                    // Add subject to existing semester
                    existingSemester.subjects.push(newSubject);
                    
                    // Recalculate average attendance
                    const totalPresent = existingSemester.subjects.reduce((sum, s) => sum + s.present, 0);
                    const totalClasses = existingSemester.subjects.reduce((sum, s) => sum + s.total, 0);
                    existingSemester.averageAttendance = parseFloat(((totalPresent / totalClasses) * 100).toFixed(2));
                } else {
                    // Create new semester attendance
                    semesterAttendance.push({
                        semester: semesterNum,
                        subjects: [newSubject],
                        averageAttendance: parseFloat(percentage)
                    });
                }
                
                // Update student with new semesterAttendance
                dataManager.updateStudent(studentId, { semesterAttendance: semesterAttendance });
                
                showToast('Attendance added successfully', 'success');
                updateMarksAttendance(studentId);
            } catch (error) {
                showToast(error.message || 'Failed to add attendance', 'error');
            }
        }
    });
}

function filterStudentsMarksAttendance() {
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    const departmentFilter = document.getElementById('department-filter').value;
    const semesterFilter = document.getElementById('semester-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    let students = dataManager.getStudents();
    
    // Apply search filter
    if (searchTerm) {
        students = students.filter(student => 
            student.fullName.toLowerCase().includes(searchTerm) ||
            student.rollNumber.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply department filter
    if (departmentFilter) {
        students = students.filter(student => student.department === departmentFilter);
    }
    
    // Apply semester filter
    if (semesterFilter) {
        students = students.filter(student => student.semester === parseInt(semesterFilter));
    }
    
    // Apply status filter
    if (statusFilter) {
        students = students.filter(student => student.status === statusFilter);
    }
    
    // Update student selector
    const studentSelector = document.getElementById('student-selector');
    studentSelector.innerHTML = students.map(s => 
        `<option value="${s.id}">${s.fullName} (${s.rollNumber}) - ${s.department}</option>`
    ).join('');
    
    // Update count
    document.getElementById('student-count').textContent = `${students.length} student(s) found`;
    
    // Update marks and attendance for first student if available
    if (students.length > 0) {
        updateMarksAttendance(students[0].id);
    } else {
        const contentContainer = document.getElementById('marks-attendance-content');
        contentContainer.innerHTML = `
            <div class="col-span-2 text-center py-12">
                <i data-lucide="inbox" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                <p class="text-gray-600">Try adjusting your search or filters.</p>
            </div>
        `;
        lucide.createIcons();
    }
}

function clearMarksAttendanceFilters() {
    document.getElementById('student-search').value = '';
    document.getElementById('department-filter').value = '';
    document.getElementById('semester-filter').value = '';
    document.getElementById('status-filter').value = '';
    filterStudentsMarksAttendance();
}

window.renderMarksAttendance = renderMarksAttendance;
window.selectSemester = selectSemester;
window.addMarks = addMarks;
window.addAttendance = addAttendance;
window.filterStudentsMarksAttendance = filterStudentsMarksAttendance;
window.clearMarksAttendanceFilters = clearMarksAttendanceFilters;


// Alumni Page

    // Export to global scope
    window.MarksAttendancePage = {
        render: renderMarksAttendance
    };

})();
