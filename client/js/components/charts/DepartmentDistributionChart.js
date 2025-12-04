// DepartmentDistributionChart Component
// Renders department-wise student distribution as a pie chart

(function() {
    'use strict';

    /**
     * DepartmentDistributionChart Component
     * Renders a pie chart showing student distribution across departments
     * 
     * @param {Object} config - Configuration object
     * @param {string} config.containerId - ID of the container element for the chart
     * @param {Array<string>} config.departments - Array of department names
     * @param {Array<number>} config.studentCounts - Array of student counts per department
     * @returns {Chart} Chart.js instance
     */
    function DepartmentDistributionChart(config) {
        if (!config || !config.containerId || !config.departments || !config.studentCounts) {
            throw new Error('DepartmentDistributionChart requires containerId, departments, and studentCounts');
        }

        const ctx = document.getElementById(config.containerId);
        if (!ctx) {
            throw new Error(`Container element with ID "${config.containerId}" not found`);
        }

        // Validate data
        if (config.departments.length !== config.studentCounts.length) {
            throw new Error('Departments and studentCounts arrays must have the same length');
        }

        // Validate student counts are non-negative integers
        const validCounts = config.studentCounts.every(count => Number.isInteger(count) && count >= 0);
        if (!validCounts) {
            throw new Error('All student counts must be non-negative integers');
        }

        // Define color palette for pie chart
        const colors = [
            '#3B82F6',
            '#6366F1',
            '#8B5CF6',
            '#A855F7',
            '#EC4899',
            '#F43F5E',
            '#F97316',
            '#EAB308'
        ];

        // Create and return Chart.js instance
        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: config.departments,
                datasets: [{
                    data: config.studentCounts,
                    backgroundColor: colors.slice(0, config.departments.length),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        return chart;
    }

    // Export to global scope
    window.DepartmentDistributionChart = DepartmentDistributionChart;

})();
