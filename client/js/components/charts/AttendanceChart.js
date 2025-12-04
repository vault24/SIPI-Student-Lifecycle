// AttendanceChart Component
// Renders semester-wise attendance overview as a bar chart

(function() {
    'use strict';

    /**
     * AttendanceChart Component
     * Renders a bar chart showing average attendance percentages across semesters
     * 
     * @param {Object} config - Configuration object
     * @param {string} config.containerId - ID of the container element for the chart
     * @param {Array<string>} config.semesters - Array of semester labels (e.g., ['Sem 1', 'Sem 2', ...])
     * @param {Array<number>} config.attendancePercentages - Array of attendance percentages (0-100)
     * @returns {Chart} Chart.js instance
     */
    function AttendanceChart(config) {
        if (!config || !config.containerId || !config.semesters || !config.attendancePercentages) {
            throw new Error('AttendanceChart requires containerId, semesters, and attendancePercentages');
        }

        const ctx = document.getElementById(config.containerId);
        if (!ctx) {
            throw new Error(`Container element with ID "${config.containerId}" not found`);
        }

        // Validate data
        if (config.semesters.length !== config.attendancePercentages.length) {
            throw new Error('Semesters and attendancePercentages arrays must have the same length');
        }

        // Validate attendance percentages are between 0 and 100
        const validPercentages = config.attendancePercentages.every(p => p >= 0 && p <= 100);
        if (!validPercentages) {
            throw new Error('All attendance percentages must be between 0 and 100');
        }

        // Create and return Chart.js instance
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: config.semesters,
                datasets: [{
                    label: 'Average Attendance %',
                    data: config.attendancePercentages,
                    backgroundColor: '#3B82F6',
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '%';
                            }
                        }
                    }
                }
            }
        });

        return chart;
    }

    // Export to global scope
    window.AttendanceChart = AttendanceChart;

})();
