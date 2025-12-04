/**
 * Data Management for SLMS - Backend API Integration
 * 
 * This module replaces the localStorage-based dataManager with actual
 * HTTP requests to the Django REST API backend.
 * 
 * Note: This file uses the global window.backendAPI object
 */

(function() {
    'use strict';

// Get API references from global scope
const studentsAPI = window.backendAPI.students;
const alumniAPI = window.backendAPI.alumni;
const applicationsAPI = window.backendAPI.applications;
const documentsAPI = window.backendAPI.documents;
const departmentsAPI = window.backendAPI.departments;
const dashboardAPI = window.backendAPI.dashboard;

// Helper function to show loading state
function showLoading(message = 'Loading...') {
    // You can implement a loading indicator here
    console.log(message);
}

// Helper function to hide loading state
function hideLoading() {
    // You can implement hiding loading indicator here
    console.log('Loading complete');
}

// Helper function to show error
function showError(message) {
    console.error('Error:', message);
    alert(`Error: ${message}`);
}

// Data Manager - Backend API Integration
const dataManager = {
    // ============================================================================
    // DEPARTMENTS
    // ============================================================================
    
    async getDepartments() {
        try {
            showLoading('Loading departments...');
            let departments = await departmentsAPI.getAll();
            hideLoading();
            // Handle paginated response
            if (departments && departments.results) {
                departments = departments.results;
            }
            return Array.isArray(departments) ? departments : [];
        } catch (error) {
            hideLoading();
            showError('Failed to load departments: ' + error.message);
            return [];
        }
    },

    async getDepartmentById(id) {
        try {
            showLoading('Loading department...');
            const department = await departmentsAPI.getById(id);
            hideLoading();
            return department;
        } catch (error) {
            hideLoading();
            showError('Failed to load department: ' + error.message);
            return null;
        }
    },

    async addDepartment(department) {
        try {
            showLoading('Adding department...');
            const result = await departmentsAPI.create(department);
            hideLoading();
            return result;
        } catch (error) {
            hideLoading();
            showError('Failed to add department: ' + error.message);
            return null;
        }
    },

    async updateDepartment(id, updates) {
        try {
            showLoading('Updating department...');
            await departmentsAPI.update(id, updates);
            hideLoading();
            return true;
        } catch (error) {
            hideLoading();
            showError('Failed to update department: ' + error.message);
            return false;
        }
    },

    async deleteDepartment(id) {
        try {
            showLoading('Deleting department...');
            await departmentsAPI.delete(id);
            hideLoading();
            return true;
        } catch (error) {
            hideLoading();
            showError('Failed to delete department: ' + error.message);
            return false;
        }
    },

    async getStudentsByDepartmentAndSemester(departmentId, semester) {
        try {
            showLoading('Loading students...');
            const result = await departmentsAPI.getStudents(departmentId, semester);
            hideLoading();
            return result.students || [];
        } catch (error) {
            hideLoading();
            showError('Failed to load students: ' + error.message);
            return [];
        }
    },

    // ============================================================================
    // STUDENTS
    // ============================================================================
    
    async getStudents(filters = {}) {
        try {
            showLoading('Loading students...');
            const response = await studentsAPI.getAll(filters);
            hideLoading();
            return response.results || [];
        } catch (error) {
            hideLoading();
            showError('Failed to load students: ' + error.message);
            return [];
        }
    },

    async getStudent(id) {
        try {
            showLoading('Loading student details...');
            const student = await studentsAPI.getById(id);
            hideLoading();
            return student;
        } catch (error) {
            hideLoading();
            showError('Failed to load student: ' + error.message);
            return null;
        }
    },

    async addStudent(student) {
        try {
            showLoading('Adding student...');
            const result = await studentsAPI.create(student);
            hideLoading();
            return result;
        } catch (error) {
            hideLoading();
            showError('Failed to add student: ' + error.message);
            throw error;
        }
    },

    async updateStudent(id, updates) {
        try {
            showLoading('Updating student...');
            await studentsAPI.update(id, updates);
            hideLoading();
            return true;
        } catch (error) {
            hideLoading();
            showError('Failed to update student: ' + error.message);
            return false;
        }
    },

    async deleteStudent(id) {
        try {
            showLoading('Deleting student...');
            await studentsAPI.delete(id);
            hideLoading();
            return true;
        } catch (error) {
            hideLoading();
            if (error.message.includes('alumni')) {
                showError('Cannot delete student: Student is an alumni');
            } else {
                showError('Failed to delete student: ' + error.message);
            }
            throw error;
        }
    },

    async searchStudents(query) {
        try {
            showLoading('Searching students...');
            const students = await studentsAPI.search(query);
            hideLoading();
            return students;
        } catch (error) {
            hideLoading();
            showError('Failed to search students: ' + error.message);
            return [];
        }
    },

    async uploadStudentPhoto(id, photoFile) {
        try {
            showLoading('Uploading photo...');
            const result = await studentsAPI.uploadPhoto(id, photoFile);
            hideLoading();
            return result;
        } catch (error) {
            hideLoading();
            showError('Failed to upload photo: ' + error.message);
            throw error;
        }
    },

    // ============================================================================
    // DOCUMENTS
    // ============================================================================
    
    async getDocuments(studentId = null) {
        try {
            showLoading('Loading documents...');
            const filters = studentId ? { student: studentId } : {};
            const response = await documentsAPI.getAll(filters);
            hideLoading();
            return response.results || [];
        } catch (error) {
            hideLoading();
            showError('Failed to load documents: ' + error.message);
            return [];
        }
    },

    async addDocument(studentId, category, file) {
        try {
            showLoading('Uploading document...');
            const result = await documentsAPI.upload(studentId, category, file);
            hideLoading();
            return result;
        } catch (error) {
            hideLoading();
            showError('Failed to upload document: ' + error.message);
            throw error;
        }
    },

    async deleteDocument(id) {
        try {
            showLoading('Deleting document...');
            await documentsAPI.delete(id);
            hideLoading();
            return true;
        } catch (error) {
            hideLoading();
            showError('Failed to delete document: ' + error.message);
            return false;
        }
    },

    // ============================================================================
    // MARKS & ATTENDANCE (Stored in Student semesterResults/semesterAttendance)
    // ============================================================================
    
    async getMarks(studentId = null) {
        // Marks are stored in student.semesterResults
        if (studentId) {
            try {
                const student = await this.getStudent(studentId);
                return student?.semesterResults || [];
            } catch (error) {
                console.error('Failed to load marks:', error.message);
                return [];
            }
        }
        return [];
    },

    async getAttendance(studentId = null) {
        // Attendance is stored in student.semesterAttendance
        if (studentId) {
            try {
                const student = await this.getStudent(studentId);
                return student?.semesterAttendance || [];
            } catch (error) {
                console.error('Failed to load attendance:', error.message);
                return [];
            }
        }
        return [];
    },

    // ============================================================================
    // ALUMNI MANAGEMENT
    // ============================================================================
    
    async getAlumni(filters = {}) {
        try {
            showLoading('Loading alumni...');
            const response = await alumniAPI.getAll(filters);
            hideLoading();
            return response.results || [];
        } catch (error) {
            hideLoading();
            showError('Failed to load alumni: ' + error.message);
            return [];
        }
    },

    async getAlumniById(id) {
        try {
            showLoading('Loading alumni details...');
            const alumni = await alumniAPI.getById(id);
            hideLoading();
            return alumni;
        } catch (error) {
            hideLoading();
            showError('Failed to load alumni: ' + error.message);
            return null;
        }
    },

    async getAlumniByStudentId(studentId) {
        // Get all alumni and filter by studentId
        try {
            const allAlumni = await this.getAlumni();
            return allAlumni.find(a => a.student === studentId);
        } catch (error) {
            return null;
        }
    },

    async addAlumni(alumniData) {
        try {
            showLoading('Adding alumni...');
            const result = await alumniAPI.create(alumniData);
            hideLoading();
            return result;
        } catch (error) {
            hideLoading();
            showError('Failed to add alumni: ' + error.message);
            throw error;
        }
    },

    async updateAlumni(id, updates) {
        try {
            showLoading('Updating alumni...');
            await alumniAPI.update(id, updates);
            hideLoading();
            return true;
        } catch (error) {
            hideLoading();
            showError('Failed to update alumni: ' + error.message);
            return false;
        }
    },

    async hasCompletedEighthSemester(studentId) {
        try {
            const student = await this.getStudent(studentId);
            if (!student || !student.semesterResults) return false;
            
            const semesters = student.semesterResults.map(r => r.semester);
            
            // Check if 8th semester exists and all previous semesters exist
            if (!semesters.includes(8)) return false;
            
            for (let i = 1; i <= 7; i++) {
                if (!semesters.includes(i)) return false;
            }
            
            return true;
        } catch (error) {
            return false;
        }
    },

    async transitionToAlumni(studentId, graduationYear) {
        try {
            showLoading('Transitioning to alumni...');
            
            // Check if already an alumni
            const existingAlumni = await this.getAlumniByStudentId(studentId);
            if (existingAlumni) {
                throw new Error('Student has already been transitioned to alumni');
            }

            // Validate 8th semester completion
            const hasCompleted = await this.hasCompletedEighthSemester(studentId);
            if (!hasCompleted) {
                throw new Error('Cannot transition to alumni: Student must complete all 8 semesters');
            }

            // Transition via API
            const result = await studentsAPI.transitionToAlumni(studentId, graduationYear);
            hideLoading();
            return result;
        } catch (error) {
            hideLoading();
            showError(error.message);
            throw error;
        }
    },

    async addCareerPosition(alumniId, positionData) {
        try {
            showLoading('Adding career position...');
            const result = await alumniAPI.addCareerPosition(alumniId, positionData);
            hideLoading();
            return result;
        } catch (error) {
            hideLoading();
            showError('Failed to add career position: ' + error.message);
            throw error;
        }
    },

    async getCareerHistory(alumniId) {
        try {
            const alumni = await this.getAlumniById(alumniId);
            return alumni ? alumni.careerHistory : [];
        } catch (error) {
            return [];
        }
    },

    async updateSupportCategory(alumniId, category, notes = '') {
        try {
            showLoading('Updating support category...');
            await alumniAPI.updateSupportCategory(alumniId, category, notes);
            hideLoading();
            return true;
        } catch (error) {
            hideLoading();
            showError('Failed to update support category: ' + error.message);
            throw error;
        }
    },

    async getSupportHistory(alumniId) {
        try {
            const alumni = await this.getAlumniById(alumniId);
            return alumni ? alumni.supportHistory : [];
        } catch (error) {
            return [];
        }
    },

    async getAlumniBySupportCategory(category) {
        return await this.getAlumni({ currentSupportCategory: category });
    },

    async getAlumniStats() {
        try {
            showLoading('Loading alumni statistics...');
            const stats = await alumniAPI.getStats();
            hideLoading();
            return stats;
        } catch (error) {
            hideLoading();
            showError('Failed to load alumni statistics: ' + error.message);
            return {
                total: 0,
                recent: 0,
                established: 0,
                bySupport: {},
                byPosition: {},
                byYear: {}
            };
        }
    },

    async disconnectStudies(studentId, reason, lastSemester) {
        try {
            showLoading('Disconnecting studies...');
            const result = await studentsAPI.disconnectStudies(studentId, reason, lastSemester);
            hideLoading();
            return result;
        } catch (error) {
            hideLoading();
            showError('Failed to disconnect studies: ' + error.message);
            throw error;
        }
    },

    // ============================================================================
    // DASHBOARD
    // ============================================================================
    
    async getDashboardStats() {
        try {
            showLoading('Loading dashboard statistics...');
            const stats = await dashboardAPI.getStats();
            hideLoading();
            return stats;
        } catch (error) {
            hideLoading();
            showError('Failed to load dashboard statistics: ' + error.message);
            return null;
        }
    }
};

// Application Manager - Backend API Integration
const applicationManager = {
    async getApplications(filters = {}) {
        try {
            showLoading('Loading applications...');
            const response = await applicationsAPI.getAll(filters);
            hideLoading();
            return response.results || [];
        } catch (error) {
            hideLoading();
            showError('Failed to load applications: ' + error.message);
            return [];
        }
    },

    async getApplication(id) {
        try {
            showLoading('Loading application...');
            const application = await applicationsAPI.getById(id);
            hideLoading();
            return application;
        } catch (error) {
            hideLoading();
            showError('Failed to load application: ' + error.message);
            return null;
        }
    },

    async submitApplication(applicationData) {
        try {
            showLoading('Submitting application...');
            const result = await applicationsAPI.submit(applicationData);
            hideLoading();
            return result;
        } catch (error) {
            hideLoading();
            showError('Failed to submit application: ' + error.message);
            return null;
        }
    },

    async updateApplicationStatus(id, status, notes = '', reviewedBy = 'Admin') {
        try {
            showLoading('Updating application status...');
            await applicationsAPI.review(id, status, reviewedBy, notes);
            hideLoading();
            return true;
        } catch (error) {
            hideLoading();
            showError('Failed to update application status: ' + error.message);
            return false;
        }
    },

    async deleteApplication(id) {
        try {
            showLoading('Deleting application...');
            await applicationsAPI.delete(id);
            hideLoading();
            return true;
        } catch (error) {
            hideLoading();
            showError('Failed to delete application: ' + error.message);
            return false;
        }
    },

    async getApplicationsByStatus(status) {
        return await this.getApplications({ status });
    }
};

// Export to window for global access
window.dataManager = dataManager;
window.applicationManager = applicationManager;

// Remove mock data initialization functions
window.initializeMockData = () => {
    console.log('✅ Mock data initialization disabled - using backend API');
};

window.migrateAlumniData = () => {
    console.log('✅ Alumni data migration disabled - using backend API');
};

})(); // End of IIFE
