// Data Management for SLMS - localStorage wrapper and mock data

// Storage keys
const STORAGE_KEYS = {
    STUDENTS: 'slms_students',
    DOCUMENTS: 'slms_documents',
    MARKS: 'slms_marks',
    ATTENDANCE: 'slms_attendance',
    ALUMNI: 'slms_alumni',
    APPLICATIONS: 'slms_applications',
    CURRENT_USER: 'slms_current_user'
};

// LocalStorage wrapper functions
const storage = {
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Data access functions
const dataManager = {
    // Departments
    getDepartments() {
        const defaultDepartments = [
            { id: 'cst', name: 'Computer Science and Technology', code: 'CST' },
            { id: 'ct', name: 'Civil Technology', code: 'CT' },
            { id: 'et', name: 'Electronic Technology', code: 'ET' },
            { id: 'elt', name: 'Electronics Technology', code: 'ELT' },
            { id: 'rac', name: 'Refrigeration and Air Conditioning', code: 'RAC' }
        ];
        return storage.get('slms_departments') || defaultDepartments;
    },

    addDepartment(department) {
        const departments = this.getDepartments();
        department.id = generateUUID();
        departments.push(department);
        return storage.set('slms_departments', departments);
    },

    updateDepartment(id, updates) {
        const departments = this.getDepartments();
        const index = departments.findIndex(d => d.id === id);
        if (index !== -1) {
            departments[index] = { ...departments[index], ...updates };
            return storage.set('slms_departments', departments);
        }
        return false;
    },

    deleteDepartment(id) {
        const departments = this.getDepartments();
        const filtered = departments.filter(d => d.id !== id);
        return storage.set('slms_departments', filtered);
    },

    getStudentsByDepartmentAndSemester(departmentName, semester) {
        const students = this.getStudents();
        return students.filter(s =>
            s.department === departmentName &&
            (!semester || s.semester === parseInt(semester))
        );
    },

    // Students
    getStudents() {
        return storage.get(STORAGE_KEYS.STUDENTS) || [];
    },

    getStudent(id) {
        const students = this.getStudents();
        return students.find(s => s.id === id);
    },

    addStudent(student) {
        const students = this.getStudents();
        student.id = generateUUID();
        student.createdAt = new Date().toISOString();
        student.updatedAt = new Date().toISOString();
        students.push(student);
        return storage.set(STORAGE_KEYS.STUDENTS, students);
    },

    updateStudent(id, updates) {
        const students = this.getStudents();
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students[index] = { ...students[index], ...updates, updatedAt: new Date().toISOString() };
            return storage.set(STORAGE_KEYS.STUDENTS, students);
        }
        return false;
    },

    deleteStudent(id) {
        const students = this.getStudents();
        const filtered = students.filter(s => s.id !== id);
        return storage.set(STORAGE_KEYS.STUDENTS, filtered);
    },

    // Documents
    getDocuments(studentId = null) {
        const documents = storage.get(STORAGE_KEYS.DOCUMENTS) || [];
        return studentId ? documents.filter(d => d.studentId === studentId) : documents;
    },

    addDocument(document) {
        const documents = storage.get(STORAGE_KEYS.DOCUMENTS) || [];
        document.id = generateUUID();
        document.uploadDate = new Date().toISOString();
        documents.push(document);
        return storage.set(STORAGE_KEYS.DOCUMENTS, documents);
    },

    deleteDocument(id) {
        const documents = storage.get(STORAGE_KEYS.DOCUMENTS) || [];
        const filtered = documents.filter(d => d.id !== id);
        return storage.set(STORAGE_KEYS.DOCUMENTS, filtered);
    },

    // Marks
    getMarks(studentId = null) {
        const marks = storage.get(STORAGE_KEYS.MARKS) || [];
        return studentId ? marks.filter(m => m.studentId === studentId) : marks;
    },

    addMarks(marksData) {
        const marks = storage.get(STORAGE_KEYS.MARKS) || [];
        marksData.id = generateUUID();
        marks.push(marksData);
        return storage.set(STORAGE_KEYS.MARKS, marks);
    },

    updateMarks(id, updates) {
        const marks = storage.get(STORAGE_KEYS.MARKS) || [];
        const index = marks.findIndex(m => m.id === id);
        if (index !== -1) {
            marks[index] = { ...marks[index], ...updates };
            return storage.set(STORAGE_KEYS.MARKS, marks);
        }
        return false;
    },

    // Attendance
    getAttendance(studentId = null) {
        const attendance = storage.get(STORAGE_KEYS.ATTENDANCE) || [];
        return studentId ? attendance.filter(a => a.studentId === studentId) : attendance;
    },

    addAttendance(attendanceData) {
        const attendance = storage.get(STORAGE_KEYS.ATTENDANCE) || [];
        attendanceData.id = generateUUID();
        attendance.push(attendanceData);
        return storage.set(STORAGE_KEYS.ATTENDANCE, attendance);
    },

    // Alumni
    getAlumni() {
        return storage.get(STORAGE_KEYS.ALUMNI) || [];
    },

    addAlumni(alumniData) {
        const alumni = storage.get(STORAGE_KEYS.ALUMNI) || [];
        alumniData.id = generateUUID();
        alumniData.updatedAt = new Date().toISOString();
        alumni.push(alumniData);
        return storage.set(STORAGE_KEYS.ALUMNI, alumni);
    },

    updateAlumni(id, updates) {
        const alumni = storage.get(STORAGE_KEYS.ALUMNI) || [];
        const index = alumni.findIndex(a => a.id === id);
        if (index !== -1) {
            alumni[index] = { ...alumni[index], ...updates, updatedAt: new Date().toISOString() };
            return storage.set(STORAGE_KEYS.ALUMNI, alumni);
        }
        return false;
    },

    // Current User
    getCurrentUser() {
        return storage.get(STORAGE_KEYS.CURRENT_USER);
    },

    setCurrentUser(user) {
        return storage.set(STORAGE_KEYS.CURRENT_USER, user);
    },

    logout() {
        return storage.remove(STORAGE_KEYS.CURRENT_USER);
    }
};

// Initialize mock data if not exists
function initializeMockData() {
    // Initialize departments first
    if (!storage.get('slms_departments')) {
        const defaultDepartments = [
            { id: 'cst', name: 'Computer Science and Technology', code: 'CST' },
            { id: 'ct', name: 'Civil Technology', code: 'CT' },
            { id: 'et', name: 'Electronic Technology', code: 'ET' },
            { id: 'elt', name: 'Electronics Technology', code: 'ELT' },
            { id: 'rac', name: 'Refrigeration and Air Conditioning', code: 'RAC' }
        ];
        storage.set('slms_departments', defaultDepartments);
    }

    if (!dataManager.getStudents().length) {
        const mockStudents = generateMockStudents(50);
        storage.set(STORAGE_KEYS.STUDENTS, mockStudents);

        // Generate documents for some students
        const mockDocuments = generateMockDocuments(mockStudents.slice(0, 20));
        storage.set(STORAGE_KEYS.DOCUMENTS, mockDocuments);

        // Generate marks for some students
        const mockMarks = generateMockMarks(mockStudents.slice(0, 30));
        storage.set(STORAGE_KEYS.MARKS, mockMarks);

        // Generate attendance for some students
        const mockAttendance = generateMockAttendance(mockStudents.slice(0, 30));
        storage.set(STORAGE_KEYS.ATTENDANCE, mockAttendance);

        // Generate alumni records
        const mockAlumni = generateMockAlumni(mockStudents.slice(40, 50));
        storage.set(STORAGE_KEYS.ALUMNI, mockAlumni);
    }
}

// Mock data generators
function generateMockStudents(count) {
    const students = [];
    const departments = ['Computer Science and Technology', 'Civil Technology', 'Electronic Technology', 'Electronics Technology', 'Refrigeration and Air Conditioning'];
    const statuses = ['active', 'active', 'active', 'inactive', 'graduated'];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        students.push({
            id: generateUUID(),
            fullName: `${firstName} ${lastName}`,
            rollNumber: `2023${String(i + 1).padStart(4, '0')}`,
            registrationNumber: `REG${String(i + 1).padStart(6, '0')}`,
            semester: Math.floor(Math.random() * 8) + 1,
            department: departments[Math.floor(Math.random() * departments.length)],
            dateOfBirth: `199${Math.floor(Math.random() * 10)}-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            nidNumber: `NID${String(Math.floor(Math.random() * 1000000)).padStart(10, '0')}`,
            phone: `+1${String(Math.floor(Math.random() * 10000000000)).padStart(10, '0')}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.edu`,
            address: `${Math.floor(Math.random() * 9999) + 1} Main St, City, State ${String(Math.floor(Math.random() * 90000) + 10000)}`,
            profilePhoto: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            enrollmentDate: `2023-0${Math.floor(Math.random() * 9) + 1}-01`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }

    return students;
}

function generateMockDocuments(students) {
    const documents = [];
    const categories = ['NID', 'Marksheet', 'Certificate', 'Attendance Sheet', 'Other'];

    students.forEach(student => {
        const docCount = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < docCount; i++) {
            documents.push({
                id: generateUUID(),
                studentId: student.id,
                fileName: `${categories[i % categories.length]}_${student.rollNumber}.pdf`,
                fileType: 'application/pdf',
                category: categories[i % categories.length],
                uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
                fileSize: Math.floor(Math.random() * 5000000) + 100000,
                fileUrl: '#'
            });
        }
    });

    return documents;
}

function generateMockMarks(students) {
    const marks = [];
    const courses = [
        { code: 'CS101', name: 'Introduction to Programming', credits: 3 },
        { code: 'CS102', name: 'Data Structures', credits: 4 },
        { code: 'CS201', name: 'Algorithms', credits: 4 },
        { code: 'CS202', name: 'Database Systems', credits: 3 },
        { code: 'MATH101', name: 'Calculus I', credits: 3 }
    ];

    students.forEach(student => {
        for (let sem = 1; sem <= student.semester; sem++) {
            const semesterCourses = courses.map(course => {
                const marksValue = Math.floor(Math.random() * 40) + 60;
                return {
                    ...course,
                    marks: marksValue,
                    grade: getGrade(marksValue)
                };
            });

            const gpa = calculateGPA(semesterCourses);

            marks.push({
                id: generateUUID(),
                studentId: student.id,
                semester: sem,
                courses: semesterCourses,
                gpa: gpa,
                cgpa: gpa
            });
        }
    });

    return marks;
}

function generateMockAttendance(students) {
    const attendance = [];
    const courses = [
        { code: 'CS101', name: 'Introduction to Programming' },
        { code: 'CS102', name: 'Data Structures' },
        { code: 'CS201', name: 'Algorithms' },
        { code: 'CS202', name: 'Database Systems' },
        { code: 'MATH101', name: 'Calculus I' }
    ];

    students.forEach(student => {
        for (let sem = 1; sem <= student.semester; sem++) {
            const semesterCourses = courses.map(course => {
                const totalClasses = 40;
                const attendedClasses = Math.floor(Math.random() * 15) + 25;
                return {
                    ...course,
                    totalClasses,
                    attendedClasses,
                    percentage: Math.round((attendedClasses / totalClasses) * 100)
                };
            });

            const overallPercentage = Math.round(
                semesterCourses.reduce((sum, c) => sum + c.percentage, 0) / semesterCourses.length
            );

            attendance.push({
                id: generateUUID(),
                studentId: student.id,
                semester: sem,
                courses: semesterCourses,
                overallPercentage
            });
        }
    });

    return attendance;
}

function generateMockAlumni(students) {
    const alumni = [];
    const statuses = ['Job', 'Higher Study', 'Business', 'Other'];
    const companies = ['Tech Corp', 'Innovation Labs', 'Digital Solutions', 'Global Systems', 'Future Tech'];
    const positions = ['Software Engineer', 'Data Analyst', 'Project Manager', 'Consultant', 'Developer'];

    students.forEach(student => {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        alumni.push({
            id: generateUUID(),
            studentId: student.id,
            currentStatus: status,
            companyOrUniversity: status === 'Higher Study' ? 'State University' : companies[Math.floor(Math.random() * companies.length)],
            positionOrRole: status === 'Higher Study' ? 'Masters Student' : positions[Math.floor(Math.random() * positions.length)],
            startDate: '2023-06-01',
            contactInfo: {
                phone: student.phone,
                email: student.email,
                linkedin: `https://linkedin.com/in/${student.fullName.toLowerCase().replace(' ', '-')}`
            },
            graduationYear: 2023,
            updatedAt: new Date().toISOString()
        });
    });

    return alumni;
}

// Helper functions
function getGrade(marks) {
    if (marks >= 90) return 'A+';
    if (marks >= 85) return 'A';
    if (marks >= 80) return 'A-';
    if (marks >= 75) return 'B+';
    if (marks >= 70) return 'B';
    if (marks >= 65) return 'B-';
    if (marks >= 60) return 'C+';
    if (marks >= 55) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
}

function calculateGPA(courses) {
    const gradePoints = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalCredits += course.credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
}

// Application Management Functions
const applicationManager = {
    // Get all applications
    getApplications() {
        return storage.get(STORAGE_KEYS.APPLICATIONS) || [];
    },

    // Get application by ID
    getApplication(id) {
        const applications = this.getApplications();
        return applications.find(app => app.id === id);
    },

    // Submit new application
    submitApplication(applicationData) {
        const applications = this.getApplications();
        const newApplication = {
            id: generateUUID(),
            ...applicationData,
            status: 'pending', // pending, approved, rejected
            submittedAt: new Date().toISOString(),
            reviewedAt: null,
            reviewedBy: null,
            reviewNotes: ''
        };
        applications.push(newApplication);
        return storage.set(STORAGE_KEYS.APPLICATIONS, applications) ? newApplication : null;
    },

    // Update application status
    updateApplicationStatus(id, status, notes = '', reviewedBy = 'Admin') {
        const applications = this.getApplications();
        const index = applications.findIndex(app => app.id === id);
        if (index !== -1) {
            applications[index].status = status;
            applications[index].reviewedAt = new Date().toISOString();
            applications[index].reviewedBy = reviewedBy;
            applications[index].reviewNotes = notes;
            return storage.set(STORAGE_KEYS.APPLICATIONS, applications);
        }
        return false;
    },

    // Delete application
    deleteApplication(id) {
        const applications = this.getApplications();
        const filtered = applications.filter(app => app.id !== id);
        return storage.set(STORAGE_KEYS.APPLICATIONS, filtered);
    },

    // Get applications by status
    getApplicationsByStatus(status) {
        const applications = this.getApplications();
        return applications.filter(app => app.status === status);
    }
};

// Export
window.dataManager = dataManager;
window.applicationManager = applicationManager;
window.initializeMockData = initializeMockData;
