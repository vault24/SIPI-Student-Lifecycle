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
        <div class="max-w-7xl mx-auto">
            <!-- Premium Page Header with Gradient Background -->
            <div class="glass-panel p-8 rounded-2xl backdrop-blur-md border border-white/20 mb-8 entrance-animation">
                <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Marks & Attendance</h1>
                <p class="text-gray-600 dark:text-gray-400 text-lg">Track student academic performance and attendance records</p>
            </div>

            <!-- Premium Search and Filters -->
            <div class="glass-panel p-6 md:p-8 mb-8 rounded-2xl backdrop-blur-md border border-white/20 entrance-animation">
                <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Search & Filter</p>
                
                <!-- Search Bar -->
                <div class="relative mb-4">
                    <input 
                        type="text" 
                        id="student-search" 
                        placeholder="Search by name or roll number..." 
                        class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm font-medium transition-all"
                        onkeyup="filterStudentsMarksAttendance().catch(e => console.error('Filter error:', e))"
                    >
                    <i data-lucide="search" class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>

                <!-- Filters Row -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select id="department-filter" class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm font-medium transition-all" onchange="filterStudentsMarksAttendance().catch(e => console.error('Filter error:', e))">
                        <option value="">All Departments</option>
                        ${departments.map(dept => `<option value="${dept.name}">${dept.name}</option>`).join('')}
                    </select>
                    
                    <select id="semester-filter" class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm font-medium transition-all" onchange="filterStudentsMarksAttendance().catch(e => console.error('Filter error:', e))">
                        <option value="">All Semesters</option>
                        ${Array.from({ length: 8 }, (_, i) => i + 1).map(sem => `<option value="${sem}">Semester ${sem}</option>`).join('')}
                    </select>
                    
                    <select id="status-filter" class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm font-medium transition-all" onchange="filterStudentsMarksAttendance().catch(e => console.error('Filter error:', e))">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="graduated">Graduated</option>
                    </select>

                    <button onclick="clearMarksAttendanceFilters().catch(e => console.error('Filter error:', e))" class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium dark:text-white">
                        <i data-lucide="x" class="w-4 h-4"></i>
                        Clear Filters
                    </button>
                </div>
            </div>

            <!-- Student Selector -->
            <div class="glass-panel p-6 md:p-8 mb-8 rounded-2xl backdrop-blur-md border border-white/20 entrance-animation">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Student</label>
                <select id="student-selector" class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm font-medium transition-all">
                    ${students.map(s => `<option value="${s.id}">${s.fullNameEnglish || s.fullName} (${s.currentRollNumber || s.rollNumber}) - ${s.department?.name || s.department}</option>`).join('')}
                </select>
                <p id="student-count" class="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">${students.length} student(s) found</p>
            </div>

            <!-- Semester Tabs -->
            <div id="semester-tabs" class="flex gap-2 mb-8 overflow-x-auto pb-2">
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
    
    // Render semester tabs with premium styling
    const tabsContainer = document.getElementById('semester-tabs');
    tabsContainer.innerHTML = Array.from({ length: student.semester }, (_, i) => i + 1).map(sem => `
        <button onclick="selectSemester(${sem})" 
            class="px-6 py-3 rounded-xl transition-all font-semibold text-sm whitespace-nowrap transform hover:scale-105 ${sem === selectedSemester ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl' : 'glass-panel backdrop-blur-md border border-white/20 text-gray-700 dark:text-gray-300 hover:border-white/40'}">
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
    
    // Render content with premium styling
    const contentContainer = document.getElementById('marks-attendance-content');
    contentContainer.innerHTML = `
        <!-- Marks Section -->
        <div class="entrance-animation">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Marks</h3>
                <button onclick="addMarks('${studentId}')" class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-medium text-sm">
                    <i data-lucide="plus" class="w-4 h-4"></i> Add Marks
                </button>
            </div>
            ${marks ? `
                <div class="space-y-4">
                    ${marks.courses.map(course => `
                        <div class="premium-card rounded-xl p-5 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105">
                            <div class="flex items-center justify-between mb-3">
                                <div>
                                    <h4 class="font-bold text-gray-900 dark:text-white">${course.courseName}</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">${course.courseCode} • ${course.credits} Credits</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${course.marks}</div>
                                    <div class="text-sm text-gray-600 dark:text-gray-400 font-semibold">Grade: ${course.grade}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    <div class="glass-panel p-6 rounded-xl backdrop-blur-md border border-white/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 mt-4">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-gray-900 dark:text-white text-lg">GPA</span>
                            <span class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${marks.gpa}</span>
                        </div>
                    </div>
                </div>
            ` : '<div class="glass-panel p-8 rounded-xl backdrop-blur-md border border-white/20 text-center"><p class="text-gray-600 dark:text-gray-400 font-medium">No marks recorded for this semester</p></div>'}
        </div>

        <!-- Attendance Section -->
        <div class="entrance-animation">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Attendance</h3>
                <button onclick="addAttendance('${studentId}')" class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-medium text-sm">
                    <i data-lucide="plus" class="w-4 h-4"></i> Add Attendance
                </button>
            </div>
            ${attendance ? `
                <div class="space-y-4">
                    ${attendance.courses.map(course => `
                        <div class="premium-card rounded-xl p-5 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h4 class="font-bold text-gray-900 dark:text-white">${course.courseName}</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">${course.courseCode}</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-3xl font-bold ${course.percentage >= 75 ? 'text-green-600' : 'text-red-600'}">
                                        ${course.percentage}%
                                    </div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400 font-semibold">${course.attendedClasses}/${course.totalClasses}</div>
                                </div>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div class="h-3 rounded-full bg-gradient-to-r ${course.percentage >= 75 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600'} transition-all duration-500" 
                                     style="width: ${course.percentage}%"></div>
                            </div>
                        </div>
                    `).join('')}
                    <div class="glass-panel p-6 rounded-xl backdrop-blur-md border border-white/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 mt-4">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-gray-900 dark:text-white text-lg">Overall Attendance</span>
                            <span class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">${attendance.overallPercentage}%</span>
                        </div>
                    </div>
                </div>
            ` : '<div class="glass-panel p-8 rounded-xl backdrop-blur-md border border-white/20 text-center"><p class="text-gray-600 dark:text-gray-400 font-medium">No attendance recorded for this semester</p></div>'}
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
        title: `Add Marks - ${student.fullNameEnglish || student.fullName}`,
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
        title: `Add Attendance - ${student.fullNameEnglish || student.fullName}`,
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

async function filterStudentsMarksAttendance() {
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    const departmentFilter = document.getElementById('department-filter').value;
    const semesterFilter = document.getElementById('semester-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    let students = await dataManager.getStudents();
    
    // Ensure students is an array
    if (!Array.isArray(students)) {
        students = [];
    }
    
    // Apply search filter
    if (searchTerm) {
        students = students.filter(student => 
            (student.fullNameEnglish || student.fullName || '').toLowerCase().includes(searchTerm) ||
            (student.currentRollNumber || student.rollNumber || '').toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply department filter
    if (departmentFilter) {
        students = students.filter(student => 
            (student.department?.name || student.department) === departmentFilter
        );
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
        `<option value="${s.id}">${s.fullNameEnglish || s.fullName} (${s.currentRollNumber || s.rollNumber}) - ${s.department?.name || s.department}</option>`
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

async function clearMarksAttendanceFilters() {
    document.getElementById('student-search').value = '';
    document.getElementById('department-filter').value = '';
    document.getElementById('semester-filter').value = '';
    document.getElementById('status-filter').value = '';
    await filterStudentsMarksAttendance();
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
