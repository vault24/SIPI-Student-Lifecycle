/**
 * DarkModeToggle Component
 * Theme toggle with sun/moon icon transition and persistence
 */

class DarkModeToggle {
  constructor(options = {}) {
    this.theme = this.getInitialTheme();
    this.onChange = options.onChange || null;
    this.size = options.size || 'md'; // 'sm', 'md', 'lg'
    this.showLabel = options.showLabel || false;
  }

  /**
   * Get initial theme from localStorage or system preference
   */
  getInitialTheme() {
    // Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    }

    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Trigger callback
    if (this.onChange) {
      this.onChange(theme);
    }
  }

  /**
   * Toggle theme
   */
  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.theme);
    this.updateUI();
  }

  /**
   * Update UI after theme change
   */
  updateUI() {
    const button = document.getElementById('dark-mode-toggle-btn');
    if (!button) return;

    const sunIcon = button.querySelector('[data-icon="sun"]');
    const moonIcon = button.querySelector('[data-icon="moon"]');

    if (this.theme === 'dark') {
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    } else {
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    }
  }

  /**
   * Get size classes
   */
  getSizeClasses() {
    const sizes = {
      sm: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-14 h-14'
    };
    return sizes[this.size] || sizes.md;
  }

  /**
   * Get icon size
   */
  getIconSize() {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    return sizes[this.size] || sizes.md;
  }

  /**
   * Render the toggle button
   */
  render() {
    const sizeClasses = this.getSizeClasses();
    const iconSize = this.getIconSize();
    const isDark = this.theme === 'dark';

    return `
      <button
        id="dark-mode-toggle-btn"
        onclick="window.darkModeToggle?.toggle()"
        class="${sizeClasses} flex items-center justify-center rounded-lg glass-button hover:scale-105 transition-all duration-200"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        <!-- Sun Icon (Light Mode) -->
        <i 
          data-lucide="sun" 
          data-icon="sun"
          class="${iconSize} text-amber-500 ${isDark ? 'hidden' : ''} transition-all"
        ></i>
        
        <!-- Moon Icon (Dark Mode) -->
        <i 
          data-lucide="moon" 
          data-icon="moon"
          class="${iconSize} text-indigo-400 ${!isDark ? 'hidden' : ''} transition-all"
        ></i>
      </button>
      ${this.showLabel ? `
        <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          ${isDark ? 'Dark' : 'Light'} Mode
        </span>
      ` : ''}
    `;
  }

  /**
   * Initialize the toggle
   */
  init() {
    // Apply initial theme
    this.applyTheme(this.theme);

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.theme = e.matches ? 'dark' : 'light';
          this.applyTheme(this.theme);
          this.updateUI();
        }
      });
    }
  }

  /**
   * Static method to create and initialize toggle
   */
  static create(containerId, options = {}) {
    const toggle = new DarkModeToggle(options);
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return null;
    }

    container.innerHTML = toggle.render();
    toggle.init();
    
    // Store instance globally for onclick handler
    window.darkModeToggle = toggle;
    
    // Initialize Lucide icons
    if (window.lucide) {
      lucide.createIcons();
    }
    
    return toggle;
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.theme;
  }

  /**
   * Set theme programmatically
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.error('Invalid theme. Use "light" or "dark"');
      return;
    }
    
    this.theme = theme;
    this.applyTheme(theme);
    this.updateUI();
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.DarkModeToggle = DarkModeToggle;
  
  // Auto-initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    // Create a global instance if not already created
    if (!window.darkModeToggle) {
      window.darkModeToggle = new DarkModeToggle();
      window.darkModeToggle.init();
    }
  });
}
