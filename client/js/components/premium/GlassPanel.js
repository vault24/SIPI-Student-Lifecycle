/**
 * GlassPanel Component
 * A glassmorphism container with backdrop blur and semi-transparent styling
 */

class GlassPanel {
  constructor(options) {
    this.content = options.content || '';
    this.blur = options.blur || 10;
    this.opacity = options.opacity || 0.7;
    this.border = options.border !== false; // Default true
    this.padding = options.padding || 'p-6';
    this.rounded = options.rounded || 'rounded-xl';
    this.className = options.className || '';
  }

  /**
   * Get inline styles for custom blur and opacity
   */
  getInlineStyles() {
    const styles = [];
    
    if (this.blur !== 10) {
      styles.push(`backdrop-filter: blur(${this.blur}px)`);
      styles.push(`-webkit-backdrop-filter: blur(${this.blur}px)`);
    }
    
    if (this.opacity !== 0.7) {
      styles.push(`background: rgba(255, 255, 255, ${this.opacity})`);
    }
    
    return styles.length > 0 ? `style="${styles.join('; ')}"` : '';
  }

  /**
   * Get border class
   */
  getBorderClass() {
    return this.border ? 'border border-white/20' : '';
  }

  /**
   * Render the glass panel
   */
  render() {
    const inlineStyles = this.getInlineStyles();
    const borderClass = this.getBorderClass();

    return `
      <div class="glass-panel ${this.padding} ${this.rounded} ${borderClass} ${this.className} transition-all" ${inlineStyles}>
        ${this.content}
      </div>
    `;
  }

  /**
   * Render as a static method for quick use
   */
  static wrap(content, options = {}) {
    const panel = new GlassPanel({ ...options, content });
    return panel.render();
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.GlassPanel = GlassPanel;
}
