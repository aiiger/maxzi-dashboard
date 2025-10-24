// ============================================
// CHART MANAGER - Chart.js Configuration
// ============================================

class ChartManager {
    constructor() {
        this.revenueChart = null;
        this.chartPeriod = 7;
        this.init();
    }

    init() {
        this.initializeRevenueChart();
    }

    initializeRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');

        this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Revenue',
                    data: [],
                    borderColor: '#8B5CF6',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#8B5CF6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(139, 92, 246, 0.5)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return 'AED ' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#A0AEC0',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return 'AED ' + (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#A0AEC0',
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }

    updateData(data) {
        if (!this.revenueChart) return;

        // Aggregate revenue by date
        const revenueByDate = this.aggregateRevenueByDate(data, this.chartPeriod);
        
        // Update chart
        this.revenueChart.data.labels = revenueByDate.labels;
        this.revenueChart.data.datasets[0].data = revenueByDate.values;
        this.revenueChart.update('active');
    }

    aggregateRevenueByDate(data, days) {
        const dateMap = new Map();
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

        // Initialize all dates with 0
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            dateMap.set(dateStr, 0);
        }

        // Aggregate revenue from all platforms
        Object.values(data).forEach(platformData => {
            platformData.forEach(item => {
                const itemDate = new Date(item.date);
                if (itemDate >= startDate && itemDate <= endDate) {
                    const dateStr = itemDate.toISOString().split('T')[0];
                    const currentRevenue = dateMap.get(dateStr) || 0;
                    dateMap.set(dateStr, currentRevenue + item.revenue);
                }
            });
        });

        // Convert to arrays
        const sortedDates = Array.from(dateMap.keys()).sort();
        const labels = sortedDates.map(date => this.formatChartDate(new Date(date), days));
        const values = sortedDates.map(date => dateMap.get(date));

        return { labels, values };
    }

    formatChartDate(date, days) {
        if (days <= 7) {
            // Show day of week for 7 days or less
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return days[date.getDay()];
        } else if (days <= 30) {
            // Show date for 30 days or less
            return `${date.getMonth() + 1}/${date.getDate()}`;
        } else {
            // Show month for longer periods
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} ${date.getDate()}`;
        }
    }

    updatePeriod(days) {
        this.chartPeriod = parseInt(days);
        
        // Get current data and update
        if (window.dataManager) {
            const data = window.dataManager.getData();
            this.updateData(data);
        }
    }

    destroy() {
        if (this.revenueChart) {
            this.revenueChart.destroy();
        }
    }
}

// Initialize chart manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Chart.js to load
    if (typeof Chart !== 'undefined') {
        window.chartManager = new ChartManager();
    } else {
        console.error('Chart.js not loaded');
    }
});
