// API Configuration
// Update this if your backend is running on a different URL

const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api',
    
    // Check if backend is available
    async checkConnection() {
        try {
            const response = await fetch(`${this.BASE_URL}/students/`);
            return response.ok;
        } catch (error) {
            console.warn('Backend not available:', error);
            return false;
        }
    }
};

// Make it globally available
window.API_CONFIG = API_CONFIG;

