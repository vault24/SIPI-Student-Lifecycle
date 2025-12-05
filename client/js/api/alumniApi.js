// Alumni API module
// This module provides alumni-related API calls using the backend API

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
        return await apiCall(() => http.post(`/alumni/${id}/add_career_position/`, positionData));
    },

    /**
     * Update support category
     */
    async updateSupportCategory(id, category, notes) {
        return await apiCall(() => http.put(`/alumni/${id}/update_support_category/`, {
            category: category,
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

// Make API available globally
window.alumniAPI = alumniAPI;
