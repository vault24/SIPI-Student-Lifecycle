/**
 * MicroChart Component
 * Small inline charts using Chart.js with minimal styling
 */

class MicroChart {
  constructor(options) {
    this.type = options.type || 'line'; // 'line', 'bar', 'sparkline'
    this.data = options.data || [];
    this.color = options.color || '#6366f1';
    this.height = options.height || 40;
    this.gradient = options.gradient || false;
    this.animated = options.animated !== false; // Default true
    this.id = options.id || `micro-chart-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate default data if none provided
   */
  getDefaultData() {
    if (this.data.length > 0) return this.data;
    
    // Generate random data for demo
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
  }

  /**
   * Get gradient fill
   */
  getGradientFill(ctx) {
    if (!this.gradient) return 'transparent';
    
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, this.color + '40'); // 25% opacity
    gradient.addColorStop(1, this.color + '00'); // 0% opacity
    return gradient;
  }

  /**
   * Get Chart.js configuration
   */
  getChartConfig(ctx) {
    const data = this.getDefaultData();
    const labels = Array.from({ length: data.length }, () => '');

    const baseConfig = {
      type: this.type === 'sparkline' ? 'line' : this.type,
      data: {
        labels: labels,
        datasets: [{
          data: data,
          borderColor: this.color,
          backgroundColor: this.getGradientFill(ctx),
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: this.gradient
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: this.animated ? 750 : 0,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { 
            display: false,
            grid: { display: false }
          },
          y: { 
            display: false,
            grid: { display: false }
          }
        },
        elements: {
          line: {
            borderWidth: 2
          },
          bar: {
            borderRadius: 4
          }
        }
      }
    };

    return baseConfig;
  }

  /**
   * Render the canvas element
   */
  render() {
    return `
      <div class="micro-chart-container" style="height: ${this.height}px;">
        <canvas id="${this.id}" height="${this.height}"></canvas>
      </div>
    `;
  }

  /**
   * Initialize the chart after rendering
   */
  init() {
    const canvas = document.getElementById(this.id);
    if (!canvas) {
      console.error(`Canvas with id "${this.id}" not found`);
      return null;
    }

    const ctx = canvas.getContext('2d');
    const config = this.getChartConfig(ctx);
    
    return new Chart(ctx, config);
  }

  /**
   * Static method to create and initialize a chart
   */
  static create(containerId, options) {
    const chart = new MicroChart(options);
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return null;
    }

    container.innerHTML = chart.render();
    return chart.init();
  }

  /**
   * Static method to create a line chart
   */
  static line(data, color = '#6366f1', options = {}) {
    return new MicroChart({ type: 'line', data, color, ...options });
  }

  /**
   * Static method to create a bar chart
   */
  static bar(data, color = '#6366f1', options = {}) {
    return new MicroChart({ type: 'bar', data, color, ...options });
  }

  /**
   * Static method to create a sparkline
   */
  static sparkline(data, color = '#6366f1', options = {}) {
    return new MicroChart({ type: 'sparkline', data, color, gradient: true, ...options });
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.MicroChart = MicroChart;
}
