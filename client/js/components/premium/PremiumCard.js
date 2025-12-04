/**
 * PremiumCard Component
 * A premium stat card with gradient backgrounds, icons, trends, and micro-charts
 */

class PremiumCard {
  constructor(options) {
    this.title = options.title || '';
    this.value = options.value || 0;
    this.icon = options.icon || 'activity';
    this.gradient = options.gradient || 'primary';
    this.trend = options.trend || null; // { value: number, direction: 'up'|'down' }
    this.microChart = options.microChart || null; // Chart.js config
    this.color = options.color || 'blue';
    this.onClick = options.onClick || null;
  }

  /**
   * Get gradient class based on gradient type
   */
  getGradientClass() {
    const gradients = {
      primary: 'from-blue-600 to-indigo-700',
      secondary: 'from-purple-600 to-pink-600',
      accent: 'from-cyan-500 to-blue-500',
      success: 'from-green-500 to-teal-500',
      warning: 'from-amber-500 to-orange-500',
      danger: 'from-red-500 to-pink-500',
      info: 'from-blue-500 to-cyan-500'
    };
    return gradients[this.gradient] || gradients.primary;
  }

  /**
   * Get color classes based on color
   */
  getColorClasses() {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', icon: 'text-indigo-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'text-purple-600' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', icon: 'text-pink-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-600' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', icon: 'text-teal-600' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', icon: 'text-cyan-600' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600', icon: 'text-amber-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'text-orange-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600', icon: 'text-red-600' }
    };
    return colors[this.color] || colors.blue;
  }

  /**
   * Render trend indicator
   */
  renderTrend() {
    if (!this.trend) return '';

    const isUp = this.trend.direction === 'up';
    const colorClass = isUp ? 'text-green-600' : 'text-red-600';
    const icon = isUp ? 'trending-up' : 'trending-down';
    const prefix = isUp ? '+' : '';

    return `
      <div class="flex items-center gap-1 text-sm ${colorClass} animate-fade-in">
        <i data-lucide="${icon}" class="w-4 h-4"></i>
        <span class="font-medium">${prefix}${this.trend.value}%</span>
      </div>
    `;
  }

  /**
   * Render micro chart container
   */
  renderMicroChart() {
    if (!this.microChart) return '';

    const chartId = `micro-chart-${Math.random().toString(36).substr(2, 9)}`;
    
    return `
      <div class="mt-4">
        <canvas id="${chartId}" height="40"></canvas>
      </div>
    `;
  }

  /**
   * Render the premium card
   */
  render() {
    const colors = this.getColorClasses();
    const clickHandler = this.onClick ? `onclick="${this.onClick}"` : '';
    const cursorClass = this.onClick ? 'cursor-pointer' : '';

    return `
      <div class="glass-card p-6 hover-lift ${cursorClass} animate-fade-in-up" ${clickHandler}>
        <!-- Header with Icon and Trend -->
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center shadow-md animate-scale-in">
            <i data-lucide="${this.icon}" class="w-7 h-7 ${colors.icon}"></i>
          </div>
          ${this.renderTrend()}
        </div>

        <!-- Value and Title -->
        <div class="space-y-1">
          <h3 class="text-3xl font-bold ${colors.text} transition-all">${this.value}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">${this.title}</p>
        </div>

        <!-- Micro Chart -->
        ${this.renderMicroChart()}
      </div>
    `;
  }

  /**
   * Initialize micro chart after rendering
   */
  initMicroChart(containerId) {
    if (!this.microChart) return;

    const canvas = document.querySelector(`#${containerId} canvas`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Default micro chart configuration
    const defaultConfig = {
      type: 'line',
      data: this.microChart.data || {
        labels: ['', '', '', '', '', '', ''],
        datasets: [{
          data: [12, 19, 3, 5, 2, 3, 9],
          borderColor: this.getColorClasses().icon.replace('text-', ''),
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    };

    new Chart(ctx, { ...defaultConfig, ...this.microChart });
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.PremiumCard = PremiumCard;
}
