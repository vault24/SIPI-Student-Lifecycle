// Router for SLMS - Hash-based routing system

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.params = {};
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    // Register a route
    register(path, handler) {
        this.routes[path] = handler;
    }

    // Navigate to a route
    navigate(path) {
        window.location.hash = path;
    }

    // Handle route changes
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        this.currentRoute = hash;
        
        // Extract route and parameters
        const { route, params } = this.matchRoute(hash);
        this.params = params;
        
        // Find and execute handler
        const handler = this.routes[route];
        if (handler) {
            handler(params);
        } else {
            // 404 handler
            this.handle404();
        }
        
        // Update active navigation
        this.updateActiveNav();
    }

    // Match route with parameters
    matchRoute(hash) {
        // Try exact match first
        if (this.routes[hash]) {
            return { route: hash, params: {} };
        }

        // Try pattern matching for dynamic routes
        for (const route in this.routes) {
            const pattern = route.replace(/:[^\s/]+/g, '([^/]+)');
            const regex = new RegExp(`^${pattern}$`);
            const match = hash.match(regex);
            
            if (match) {
                const paramNames = route.match(/:[^\s/]+/g) || [];
                const params = {};
                
                paramNames.forEach((param, index) => {
                    const paramName = param.slice(1);
                    params[paramName] = match[index + 1];
                });
                
                return { route, params };
            }
        }

        return { route: null, params: {} };
    }

    // Get current route parameters
    getParams() {
        return this.params;
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }

    // Update active navigation highlighting
    updateActiveNav() {
        const navLinks = document.querySelectorAll('[data-nav-link]');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${this.currentRoute}` || 
                (href === '#/' && this.currentRoute === '/')) {
                link.classList.add('bg-blue-50', 'text-blue-600', 'border-l-4', 'border-blue-600');
                link.classList.remove('text-gray-700', 'hover:bg-gray-50');
            } else {
                link.classList.remove('bg-blue-50', 'text-blue-600', 'border-l-4', 'border-blue-600');
                link.classList.add('text-gray-700', 'hover:bg-gray-50');
            }
        });
    }

    // 404 handler
    handle404() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div class="text-6xl mb-4">🔍</div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
                <p class="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                <button onclick="navigateTo('/')" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                    Go to Dashboard
                </button>
            </div>
        `;
    }
}

// Create global router instance
const router = new Router();

// Global navigation function
function navigateTo(path) {
    router.navigate(path);
}

// Export router
window.router = router;
window.navigateTo = navigateTo;
