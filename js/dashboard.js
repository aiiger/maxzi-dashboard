// ============================================
// MAIN DASHBOARD CONTROLLER
// ============================================

class MaxziDashboard {
    constructor() {
        this.currentView = 'overview';
        this.sidebarCollapsed = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.initializeCharts();
    }

    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.switchView(view);
            });
        });

        // Upload button
        document.getElementById('uploadBtn').addEventListener('click', () => {
            this.openUploadModal();
        });

        // Close upload modal
        document.getElementById('closeUploadModal').addEventListener('click', () => {
            this.closeUploadModal();
        });

        // Filter buttons
        document.getElementById('dateFilterBtn').addEventListener('click', () => {
            this.openDateFilter();
        });

        document.getElementById('locationFilterBtn').addEventListener('click', () => {
            this.openLocationFilter();
        });

        document.getElementById('platformFilterBtn').addEventListener('click', () => {
            this.openPlatformFilter();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportReport();
        });

        // Chart period buttons
        document.querySelectorAll('.chart-period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.dataset.period;
                this.updateChartPeriod(period);
            });
        });

        // Close modal on backdrop click
        document.getElementById('uploadModal').addEventListener('click', (e) => {
            if (e.target.id === 'uploadModal') {
                this.closeUploadModal();
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
        this.sidebarCollapsed = !this.sidebarCollapsed;
        
        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', this.sidebarCollapsed);
    }

    switchView(viewName) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update view content
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');

        // Update title
        const titles = {
            overview: 'Overview Dashboard',
            operations: 'Operations Monitor',
            platforms: 'Platform Deep Dive',
            locations: 'Location Intelligence',
            menu: 'Menu Engineering',
            smash: 'Smash & Sear Analytics',
            reports: 'Reports & Exports',
            social: 'Social Intelligence',
            reputation: 'Reputation Monitor'
        };
        document.getElementById('viewTitle').textContent = titles[viewName];

        this.currentView = viewName;
    }

    openUploadModal() {
        document.getElementById('uploadModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeUploadModal() {
        document.getElementById('uploadModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    openDateFilter() {
        // This will be implemented by filters.js
        if (window.filterManager) {
            window.filterManager.showDatePicker();
        }
    }

    openLocationFilter() {
        // This will be implemented by filters.js
        if (window.filterManager) {
            window.filterManager.showLocationFilter();
        }
    }

    openPlatformFilter() {
        // This will be implemented by filters.js
        if (window.filterManager) {
            window.filterManager.showPlatformFilter();
        }
    }

    exportReport() {
        // This will be implemented by export.js
        if (window.exportManager) {
            window.exportManager.showExportOptions();
        } else {
            alert('Export functionality coming soon!');
        }
    }

    updateChartPeriod(period) {
        // Update active button
        document.querySelectorAll('.chart-period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Update chart data
        if (window.chartManager) {
            window.chartManager.updatePeriod(period);
        }
    }

    loadInitialData() {
        // Check if we have data in localStorage
        const hasData = localStorage.getItem('maxziData');
        
        if (hasData) {
            this.loadDataFromStorage();
        } else {
            this.showWelcomeMessage();
        }

        // Restore sidebar state
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
            document.getElementById('sidebar').classList.add('collapsed');
            this.sidebarCollapsed = true;
        }
    }

    loadDataFromStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('maxziData'));
            this.updateDashboard(data);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load saved data');
        }
    }

    updateDashboard(data) {
        // Update KPIs
        this.updateKPIs(data);
        
        // Update charts
        if (window.chartManager) {
            window.chartManager.updateData(data);
        }
    }

    updateKPIs(data) {
        // Calculate totals
        const totalRevenue = this.calculateTotalRevenue(data);
        const totalOrders = this.calculateTotalOrders(data);
        const avgOrderValue = totalRevenue / totalOrders || 0;
        const avgRating = this.calculateAvgRating(data);

        // Update UI
        document.getElementById('totalRevenue').textContent = this.formatCurrency(totalRevenue);
        document.getElementById('totalOrders').textContent = this.formatNumber(totalOrders);
        document.getElementById('avgOrderValue').textContent = this.formatCurrency(avgOrderValue);
        document.getElementById('avgRating').textContent = avgRating.toFixed(1);

        // Update platform-specific data
        this.updatePlatformCards(data);
    }

    updatePlatformCards(data) {
        const platforms = ['deliveroo', 'talabat', 'noon', 'sapaad'];
        
        platforms.forEach(platform => {
            const platformData = data[platform] || [];
            const revenue = this.calculatePlatformRevenue(platformData);
            const orders = platformData.length;
            const aov = orders > 0 ? revenue / orders : 0;

            document.getElementById(`${platform}Revenue`).textContent = this.formatCurrency(revenue);
            document.getElementById(`${platform}Orders`).textContent = this.formatNumber(orders);
            document.getElementById(`${platform}AOV`).textContent = this.formatCurrency(aov);
        });
    }

    calculateTotalRevenue(data) {
        let total = 0;
        ['deliveroo', 'talabat', 'noon', 'sapaad'].forEach(platform => {
            if (data[platform]) {
                total += this.calculatePlatformRevenue(data[platform]);
            }
        });
        return total;
    }

    calculateTotalOrders(data) {
        let total = 0;
        ['deliveroo', 'talabat', 'noon', 'sapaad'].forEach(platform => {
            if (data[platform]) {
                total += data[platform].length;
            }
        });
        return total;
    }

    calculatePlatformRevenue(platformData) {
        return platformData.reduce((sum, order) => {
            const revenue = parseFloat(order.revenue || order.total || order.amount || 0);
            return sum + revenue;
        }, 0);
    }

    calculateAvgRating(data) {
        // This will be calculated from the data once we have rating fields
        return 4.7; // Placeholder
    }

    formatCurrency(amount) {
        return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }

    formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    showWelcomeMessage() {
        console.log('Welcome to MAXZI Intelligence Dashboard! Upload data to get started.');
    }

    showError(message) {
        console.error(message);
        // TODO: Show toast notification
    }

    initializeCharts() {
        // Charts will be initialized by charts.js
        console.log('Initializing charts...');
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new MaxziDashboard();
});
