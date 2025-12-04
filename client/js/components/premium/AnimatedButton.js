/**
 * AnimatedButton Component
 * A button with multiple variants and smooth animations
 */

class AnimatedButton {
  constructor(options) {
    this.label = options.label || 'Button';
    this.icon = options.icon || null;
    this.iconPosition = options.iconPosition || 'left'; // 'left' or 'right'
    this.variant = options.variant || 'primary'; // 'primary', 'secondary', 'gradient', 'ghost', 'outline'
    this.size = options.size || 'md'; // 'sm', 'md', 'lg'
    this.onClick = options.onClick || null;
    this.disabled = options.disabled || false;
    this.loading = options.loading || false;
    this.fullWidth = options.fullWidth || false;
    this.className = options.className || '';
    this.id = options.id || '';
  }

  /**
   * Get variant classes
   */
  getVariantClasses() {
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg',
      secondary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg',
      gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-xl',
      success: 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-md hover:shadow-lg',
      warning: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg',
      danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg',
      ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
      outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    };
    return variants[this.variant] || variants.primary;
  }

  /**
   * Get size classes
   */
  getSizeClasses() {
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };
    return sizes[this.size] || sizes.md;
  }

  /**
   * Render icon
   */
  renderIcon() {
    if (!this.icon) return '';
    return `<i data-lucide="${this.icon}" class="w-5 h-5"></i>`;
  }

  /**
   * Render loading spinner
   */
  renderLoadingSpinner() {
    return `
      <div class="loading-spinner"></div>
    `;
  }

  /**
   * Render the button
   */
  render() {
    const variantClasses = this.getVariantClasses();
    const sizeClasses = this.getSizeClasses();
    const widthClass = this.fullWidth ? 'w-full' : '';
    const disabledClass = this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : 'hover-lift cursor-pointer';
    const onClickAttr = this.onClick && !this.disabled && !this.loading ? `onclick="${this.onClick}"` : '';
    const disabledAttr = this.disabled || this.loading ? 'disabled' : '';
    const idAttr = this.id ? `id="${this.id}"` : '';

    const iconLeft = this.icon && this.iconPosition === 'left' && !this.loading ? this.renderIcon() : '';
    const iconRight = this.icon && this.iconPosition === 'right' && !this.loading ? this.renderIcon() : '';
    const spinner = this.loading ? this.renderLoadingSpinner() : '';

    return `
      <button 
        ${idAttr}
        class="flex items-center justify-center gap-2 ${variantClasses} ${sizeClasses} ${widthClass} ${disabledClass} ${this.className} rounded-lg font-medium transition-all duration-200 ease-smooth"
        ${onClickAttr}
        ${disabledAttr}
      >
        ${spinner}
        ${iconLeft}
        <span>${this.label}</span>
        ${iconRight}
      </button>
    `;
  }

  /**
   * Create a button element and return it
   */
  createElement() {
    const div = document.createElement('div');
    div.innerHTML = this.render().trim();
    return div.firstChild;
  }

  /**
   * Static method to create common button types
   */
  static primary(label, onClick, options = {}) {
    return new AnimatedButton({ label, onClick, variant: 'primary', ...options }).render();
  }

  static secondary(label, onClick, options = {}) {
    return new AnimatedButton({ label, onClick, variant: 'secondary', ...options }).render();
  }

  static gradient(label, onClick, options = {}) {
    return new AnimatedButton({ label, onClick, variant: 'gradient', ...options }).render();
  }

  static success(label, onClick, options = {}) {
    return new AnimatedButton({ label, onClick, variant: 'success', ...options }).render();
  }

  static danger(label, onClick, options = {}) {
    return new AnimatedButton({ label, onClick, variant: 'danger', ...options }).render();
  }

  static ghost(label, onClick, options = {}) {
    return new AnimatedButton({ label, onClick, variant: 'ghost', ...options }).render();
  }

  static outline(label, onClick, options = {}) {
    return new AnimatedButton({ label, onClick, variant: 'outline', ...options }).render();
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.AnimatedButton = AnimatedButton;
}
