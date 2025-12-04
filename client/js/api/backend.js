/**
 * Backend API Service
 * 
 * This module provides functions to interact with the Django REST API backend.
 * It replaces the localStorage-based dataManager with actual HTTP requests.
 * Uses the http client module for all requests.
 */

/**
 * Wrapper for API calls with error handling
 * @param {Function} fn - Async function to execute
 * @returns {Promise<any>}
 */
async function apiCall(fn) {
    try {
        return await fn();
    } catch (error) {
        // Error is already handled by http client and errorHandler
        // Just re-throw for the caller to handle if needed
        throw error;
    }
}

// ============================================================================
// STUDENTS API
// ============================================================================

const studentsAPI = {
    /**
     * Get all students with optional filtering
     */
    async getAll(filters = {}) {
        return await apiCall(() => http.get('/students/', { params: filters }));
    },

    /**
     * Get a single student by ID
     */
    async getById(id) {
        return await apiCall(() => http.get(`/students/${id}/`));
    },

    /**
     * Create a new student
     */
    async create(studentData) {
        return await apiCall(() => http.post('/students/', studentData));
    },

    /**
     * Update an existing student
     */
    async update(id, studentData) {
        return await apiCall(() => http.put(`/students/${id}/`, studentData));
    },

    /**
     * Delete a student
     */
    async delete(id) {
        return await apiCall(() => http.del(`/students/${id}/`));
    },

    /**
     * Search students
     */
    async search(query) {
        return await apiCall(() => http.get('/students/search/', { params: { q: query } }));
    },

    /**
     * Upload student photo
     */
    async uploadPhoto(id, photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        return await apiCall(() => http.upload(`/students/${id}/upload-photo/`, formData));
    },

    /**
     * Transition student to alumni
     */
    async transitionToAlumni(id, graduationYear) {
        return await apiCall(() => http.post(`/students/${id}/transition-to-alumni/`, { graduationYear }));
    },

    /**
     * Disconnect student studies
     */
    async disconnectStudies(id, reason, lastSemester) {
        return await apiCall(() => http.post(`/students/${id}/disconnect-studies/`, {
            discontinuedReason: reason,
            lastSemester: lastSemester,
        }));
    },


};

// ============================================================================
// ALUMNI API
// ============================================================================

const alumniAPI = {
    /**
     * Get all alumni with optional filtering
     */
    async getAll(filters = {}) {
        return await apiCall(() => http.get('/alumni/', { params: filters }));
    },

    /**
     * Get a single alumni by ID
     */
    async getById(id) {
        return await apiCall(() => http.get(`/alumni/${id}/`));
    },

    /**
     * Update an existing alumni
     */
    async update(id, alumniData) {
        return await apiCall(() => http.put(`/alumni/${id}/`, alumniData));
    },

    /**
     * Add career position
     */
    async addCareerPosition(id, positionData) {
        return await apiCall(() => http.post(`/alumni/${id}/add-career-position/`, positionData));
    },

    /**
     * Update support category
     */
    async updateSupportCategory(id, category, notes) {
        return await apiCall(() => http.put(`/alumni/${id}/update-support-category/`, {
            currentSupportCategory: category,
            notes: notes,
        }));
    },

    /**
     * Get alumni statistics
     */
    async getStats() {
        return await apiCall(() => http.get('/alumni/stats/'));
    },
};

// ============================================================================
// APPLICATIONS API
// ============================================================================

const applicationsAPI = {
    /**
     * Get all applications with optional filtering
     */
    async getAll(filters = {}) {
        return await apiCall(() => http.get('/applications/', { params: filters }));
    },

    /**
     * Get a single application by ID
     */
    async getById(id) {
        return await apiCall(() => http.get(`/applications/${id}/`));
    },

    /**
     * Submit a new application (public endpoint)
     */
    async submit(applicationData) {
        return await apiCall(() => http.post('/applications/submit/', applicationData));
    },

    /**
     * Review an application
     */
    async review(id, status, reviewedBy, reviewNotes) {
        return await apiCall(() => http.put(`/applications/${id}/review/`, {
            status: status,
            reviewedBy: reviewedBy,
            reviewNotes: reviewNotes,
        }));
    },

    /**
     * Delete an application
     */
    async delete(id) {
        return await apiCall(() => http.del(`/applications/${id}/`));
    },
};

// ============================================================================
// DOCUMENTS API
// ============================================================================

const documentsAPI = {
    /**
     * Get all documents with optional filtering
     */
    async getAll(filters = {}) {
        return await apiCall(() => http.get('/documents/', { params: filters }));
    },

    /**
     * Get a single document by ID
     */
    async getById(id) {
        return await apiCall(() => http.get(`/documents/${id}/`));
    },

    /**
     * Upload a new document
     */
    async upload(studentId, category, file) {
        const formData = new FormData();
        formData.append('student', studentId);
        formData.append('category', category);
        formData.append('file', file);
        return await apiCall(() => http.upload('/documents/', formData));
    },

    /**
     * Delete a document
     */
    async delete(id) {
        return await apiCall(() => http.del(`/documents/${id}/`));
    },
};

// ============================================================================
// DEPARTMENTS API
// ============================================================================

const departmentsAPI = {
    /**
     * Get all departments
     */
    async getAll() {
        return await apiCall(() => http.get('/departments/'));
    },

    /**
     * Get a single department by ID
     */
    async getById(id) {
        return await apiCall(() => http.get(`/departments/${id}/`));
    },

    /**
     * Create a new department
     */
    async create(departmentData) {
        return await apiCall(() => http.post('/departments/', departmentData));
    },

    /**
     * Update an existing department
     */
    async update(id, departmentData) {
        return await apiCall(() => http.put(`/departments/${id}/`, departmentData));
    },

    /**
     * Delete a department
     */
    async delete(id) {
        return await apiCall(() => http.del(`/departments/${id}/`));
    },

    /**
     * Get students in a department
     */
    async getStudents(id, semester = null) {
        const params = semester ? { semester } : {};
        return await apiCall(() => http.get(`/departments/${id}/students/`, { params }));
    },
};

// ============================================================================
// DASHBOARD API
// ============================================================================

const dashboardAPI = {
    /**
     * Get dashboard statistics
     */
    async getStats() {
        return await apiCall(() => http.get('/dashboard/stats/'));
    },
};

// ============================================================================
// EXPORT API
// ============================================================================

// Make API available globally
window.backendAPI = {
    students: studentsAPI,
    alumni: alumniAPI,
    applications: applicationsAPI,
    documents: documentsAPI,
    departments: departmentsAPI,
    dashboard: dashboardAPI,
};
