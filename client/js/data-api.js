// Data Management for SLMS - API-based data manager
// This replaces the localStorage-based dataManager with API calls

// Helper function to convert backend format to frontend format
function convertStudentFromBackend(backendStudent) {
    return {
        id: backendStudent.id,
        fullNameBangla: backendStudent.full_name_bangla,
        fullNameEnglish: backendStudent.full_name_english,
        fullName: backendStudent.full_name_english, // For compatibility
        fatherName: backendStudent.father_name,
        fatherNID: backendStudent.father_nid,
        motherName: backendStudent.mother_name,
        motherNID: backendStudent.mother_nid,
        dateOfBirth: backendStudent.date_of_birth,
        birthCertificateNo: backendStudent.birth_certificate_no,
        nidNumber: backendStudent.nid_number || '',
        gender: backendStudent.gender,
        religion: backendStudent.religion || '',
        bloodGroup: backendStudent.blood_group || '',
        maritalStatus: backendStudent.marital_status || '',
        
        // Present Address
        presentAddress: {
            division: backendStudent.present_division,
            district: backendStudent.present_district,
            subDistrict: backendStudent.present_sub_district,
            policeStation: backendStudent.present_police_station,
            postOffice: backendStudent.present_post_office,
            municipality: backendStudent.present_municipality,
            village: backendStudent.present_village,
            ward: backendStudent.present_ward,
        },
        
        // Permanent Address
        permanentAddress: {
            division: backendStudent.permanent_division,
            district: backendStudent.permanent_district,
            subDistrict: backendStudent.permanent_sub_district,
            policeStation: backendStudent.permanent_police_station,
            postOffice: backendStudent.permanent_post_office,
            municipality: backendStudent.permanent_municipality,
            village: backendStudent.permanent_village,
            ward: backendStudent.permanent_ward,
        },
        
        // Contact
        mobileStudent: backendStudent.mobile_student,
        phone: backendStudent.mobile_student, // For compatibility
        guardianMobile: backendStudent.guardian_mobile,
        email: backendStudent.email || '',
        emergencyContact: backendStudent.emergency_contact,
        
        // Educational Background
        highestExam: backendStudent.highest_exam,
        board: backendStudent.board,
        group: backendStudent.group,
        rollNumber: backendStudent.roll_number,
        registrationNumber: backendStudent.registration_number,
        passingYear: backendStudent.passing_year,
        gpa: backendStudent.gpa,
        institutionName: backendStudent.institution_name || '',
        additionalQualifications: backendStudent.additional_qualifications || [],
        
        // Current Academic
        currentRollNumber: backendStudent.current_roll_number,
        currentRegistrationNumber: backendStudent.current_registration_number,
        semester: backendStudent.semester,
        department: backendStudent.department,
        session: backendStudent.session,
        shift: backendStudent.shift,
        currentGroup: backendStudent.current_group,
        
        // Profile Photo
        profilePhoto: backendStudent.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(backendStudent.full_name_english)}&background=random`,
        
        // System fields
        status: backendStudent.status,
        enrollmentDate: backendStudent.enrollment_date,
        createdAt: backendStudent.created_at,
        updatedAt: backendStudent.updated_at,
    };
}

// API-based data manager
const dataManager = {
    // Departments (still using local storage for now, can be moved to API later)
    getDepartments() {
        const defaultDepartments = [
            { id: 'cst', name: 'Computer Science and Technology', code: 'CST' },
            { id: 'ct', name: 'Civil Technology', code: 'CT' },
            { id: 'et', name: 'Electronic Technology', code: 'ET' },
            { id: 'elt', name: 'Electronics Technology', code: 'ELT' },
            { id: 'rac', name: 'Refrigeration and Air Conditioning', code: 'RAC' }
        ];
        return defaultDepartments;
    },

    // Students - API calls
    async getStudents() {
        try {
            const response = await window.api.students.getAll();
            const students = Array.isArray(response) ? response : (response.results || []);
            return students.map(convertStudentFromBackend);
        } catch (error) {
            console.error('Error fetching students:', error);
            showToast('Failed to load students', 'error');
            return [];
        }
    },

    async getStudent(id) {
        try {
            const response = await window.api.students.getById(id);
            return convertStudentFromBackend(response);
        } catch (error) {
            console.error('Error fetching student:', error);
            showToast('Failed to load student', 'error');
            return null;
        }
    },

    async addStudent(student) {
        try {
            const response = await window.api.students.create(student);
            showToast('Student added successfully!', 'success');
            return convertStudentFromBackend(response);
        } catch (error) {
            console.error('Error adding student:', error);
            showToast('Failed to add student: ' + (error.message || 'Unknown error'), 'error');
            return null;
        }
    },

    async updateStudent(id, updates) {
        try {
            const response = await window.api.students.update(id, updates);
            showToast('Student updated successfully!', 'success');
            return convertStudentFromBackend(response);
        } catch (error) {
            console.error('Error updating student:', error);
            showToast('Failed to update student: ' + (error.message || 'Unknown error'), 'error');
            return null;
        }
    },

    async deleteStudent(id) {
        try {
            await window.api.students.delete(id);
            showToast('Student deleted successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Error deleting student:', error);
            showToast('Failed to delete student: ' + (error.message || 'Unknown error'), 'error');
            return false;
        }
    },

    async getStudentsByDepartmentAndSemester(departmentName, semester) {
        // This will be handled by API filters
        const students = await this.getStudents();
        return students.filter(s =>
            s.department === departmentName &&
            (!semester || s.semester === parseInt(semester))
        );
    },

    // Documents - API calls
    async getDocuments(studentId = null) {
        try {
            const params = studentId ? { student_id: studentId } : {};
            const response = await window.api.documents.getAll(params);
            const documents = Array.isArray(response) ? response : (response.results || []);
            return documents.map(doc => ({
                id: doc.id,
                studentId: doc.student,
                fileName: doc.file_name,
                fileType: doc.file_type,
                category: doc.document_type,
                uploadDate: doc.upload_date,
                fileSize: doc.file_size,
                fileUrl: doc.file_url,
            }));
        } catch (error) {
            console.error('Error fetching documents:', error);
            return [];
        }
    },

    async addDocument(document) {
        try {
            // document should have: studentId, file, documentType, description
            const response = await window.api.documents.upload(
                document.studentId,
                document.file,
                document.documentType || 'other',
                document.description || ''
            );
            showToast('Document uploaded successfully!', 'success');
            return response.data || response;
        } catch (error) {
            console.error('Error uploading document:', error);
            showToast('Failed to upload document: ' + (error.message || 'Unknown error'), 'error');
            return null;
        }
    },

    async deleteDocument(id) {
        try {
            await window.api.documents.delete(id);
            showToast('Document deleted successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Error deleting document:', error);
            showToast('Failed to delete document', 'error');
            return false;
        }
    },

    // Applications - API calls
    async getApplications() {
        try {
            const response = await window.api.applications.getAll();
            return Array.isArray(response) ? response : (response.results || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            return [];
        }
    },

    async getApplication(id) {
        try {
            return await window.api.applications.getById(id);
        } catch (error) {
            console.error('Error fetching application:', error);
            return null;
        }
    },

    async submitApplication(applicationData) {
        try {
            const response = await window.api.applications.submit(applicationData);
            showToast('Application submitted successfully!', 'success');
            return response.data || response;
        } catch (error) {
            console.error('Error submitting application:', error);
            showToast('Failed to submit application: ' + (error.message || 'Unknown error'), 'error');
            return null;
        }
    },

    async updateApplicationStatus(id, status, notes = '', reviewedBy = 'Admin') {
        try {
            if (status === 'approved') {
                await window.api.applications.approve(id, reviewedBy, notes);
            } else if (status === 'rejected') {
                await window.api.applications.reject(id, reviewedBy, notes);
            }
            showToast(`Application ${status} successfully!`, 'success');
            return true;
        } catch (error) {
            console.error('Error updating application status:', error);
            showToast('Failed to update application status', 'error');
            return false;
        }
    },

    async deleteApplication(id) {
        try {
            await window.api.applications.delete(id);
            showToast('Application deleted successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Error deleting application:', error);
            showToast('Failed to delete application', 'error');
            return false;
        }
    },

    async getApplicationsByStatus(status) {
        const applications = await this.getApplications();
        return applications.filter(app => app.status === status);
    },

    // Marks and Attendance (still using localStorage for now)
    getMarks(studentId = null) {
        const marks = JSON.parse(localStorage.getItem('slms_marks') || '[]');
        return studentId ? marks.filter(m => m.studentId === studentId) : marks;
    },

    addMarks(marksData) {
        const marks = this.getMarks();
        marksData.id = generateUUID();
        marks.push(marksData);
        localStorage.setItem('slms_marks', JSON.stringify(marks));
        return true;
    },

    updateMarks(id, updates) {
        const marks = this.getMarks();
        const index = marks.findIndex(m => m.id === id);
        if (index !== -1) {
            marks[index] = { ...marks[index], ...updates };
            localStorage.setItem('slms_marks', JSON.stringify(marks));
            return true;
        }
        return false;
    },

    getAttendance(studentId = null) {
        const attendance = JSON.parse(localStorage.getItem('slms_attendance') || '[]');
        return studentId ? attendance.filter(a => a.studentId === studentId) : attendance;
    },

    addAttendance(attendanceData) {
        const attendance = this.getAttendance();
        attendanceData.id = generateUUID();
        attendance.push(attendanceData);
        localStorage.setItem('slms_attendance', JSON.stringify(attendance));
        return true;
    },

    // Alumni (still using localStorage for now)
    getAlumni() {
        return JSON.parse(localStorage.getItem('slms_alumni') || '[]');
    },

    addAlumni(alumniData) {
        const alumni = this.getAlumni();
        alumniData.id = generateUUID();
        alumniData.updatedAt = new Date().toISOString();
        alumni.push(alumniData);
        localStorage.setItem('slms_alumni', JSON.stringify(alumni));
        return true;
    },

    updateAlumni(id, updates) {
        const alumni = this.getAlumni();
        const index = alumni.findIndex(a => a.id === id);
        if (index !== -1) {
            alumni[index] = { ...alumni[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem('slms_alumni', JSON.stringify(alumni));
            return true;
        }
        return false;
    },

    // Current User (still using localStorage)
    getCurrentUser() {
        const user = localStorage.getItem('slms_current_user');
        return user ? JSON.parse(user) : null;
    },

    setCurrentUser(user) {
        localStorage.setItem('slms_current_user', JSON.stringify(user));
        return true;
    },

    logout() {
        localStorage.removeItem('slms_current_user');
        return true;
    }
};

// Application Manager (using API)
const applicationManager = {
    getApplications() {
        return dataManager.getApplications();
    },

    getApplication(id) {
        return dataManager.getApplication(id);
    },

    submitApplication(applicationData) {
        return dataManager.submitApplication(applicationData);
    },

    updateApplicationStatus(id, status, notes = '', reviewedBy = 'Admin') {
        return dataManager.updateApplicationStatus(id, status, notes, reviewedBy);
    },

    deleteApplication(id) {
        return dataManager.deleteApplication(id);
    },

    getApplicationsByStatus(status) {
        return dataManager.getApplicationsByStatus(status);
    }
};

// Export
window.dataManager = dataManager;
window.applicationManager = applicationManager;

