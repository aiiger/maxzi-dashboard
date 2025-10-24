// ============================================
// EXPORT MANAGER - HTML & PDF Reports
// ============================================

class ExportManager {
    constructor() {
        this.init();
    }

    init() {
        console.log('Export Manager initialized');
    }

    showExportOptions() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Export Report</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 24px;">
                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #A0AEC0;">Report Type</h4>
                        <div style="display: flex; gap: 12px;">
                            <button id="exportHTML" class="export-btn" style="flex: 1;">
                                📄 HTML Report
                            </button>
                            <button id="exportPDF" class="export-btn" style="flex: 1;">
                                📕 PDF Report
                            </button>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 24px;">
                        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #A0AEC0;">Date Range</h4>
                        <input type="text" id="exportDateRange" placeholder="Select date range" 
                               style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white;">
                    </div>

                    <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); padding: 16px; border-radius: 8px; font-size: 13px; color: #A0AEC0;">
                        <strong style="color: #8B5CF6;">📊 Report includes:</strong><br>
                        • Executive Summary & KPIs<br>
                        • Platform Performance Breakdown<br>
                        • Location Intelligence<br>
                        • Revenue Charts & Trends<br>
                        • Actionable Recommendations
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize date picker for export
        flatpickr('#exportDateRange', {
            mode: 'range',
            dateFormat: 'M d, Y',
            defaultDate: [
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                new Date()
            ]
        });

        // Export handlers
        document.getElementById('exportHTML').onclick = () => {
            this.exportAsHTML();
            modal.remove();
        };

        document.getElementById('exportPDF').onclick = () => {
            this.exportAsPDF();
            modal.remove();
        };
    }

    exportAsHTML() {
        const data = this.prepareExportData();
        const html = this.generateHTMLReport(data);
        
        // Create blob and download
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Maxzi_Report_${this.getDateString()}.html`;
        a.click();
        URL.revokeObjectURL(url);

        this.showSuccessMessage('HTML report downloaded successfully!');
    }

    exportAsPDF() {
        const data = this.prepareExportData();
        const html = this.generateHTMLReport(data);

        // Create temporary container
        const container = document.createElement('div');
        container.innerHTML = html;
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);

        // Generate PDF using html2pdf
        const opt = {
            margin: 10,
            filename: `Maxzi_Report_${this.getDateString()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(container).save().then(() => {
            document.body.removeChild(container);
            this.showSuccessMessage('PDF report downloaded successfully!');
        });
    }

    prepareExportData() {
        const data = window.dataManager ? window.dataManager.getData() : {};
        const filters = window.filterManager ? window.filterManager.getActiveFilters() : {};
        
        // Calculate metrics
        const metrics = this.calculateMetrics(data);
        
        return {
            data,
            filters,
            metrics,
            generatedAt: new Date().toISOString()
        };
    }

    calculateMetrics(data) {
        let totalRevenue = 0;
        let totalOrders = 0;
        const platformMetrics = {};

        Object.keys(data).forEach(platform => {
            const platformData = data[platform] || [];
            const revenue = platformData.reduce((sum, item) => sum + item.revenue, 0);
            const orders = platformData.length;

            totalRevenue += revenue;
            totalOrders += orders;

            platformMetrics[platform] = {
                revenue,
                orders,
                aov: orders > 0 ? revenue / orders : 0
            };
        });

        return {
            totalRevenue,
            totalOrders,
            avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            platformMetrics
        };
    }

    generateHTMLReport(exportData) {
        const { metrics, filters, generatedAt } = exportData;

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAXZI Performance Report - ${this.getDateString()}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%);
            color: #FFFFFF;
            padding: 40px 20px;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            background: linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%);
            padding: 40px;
            border-radius: 16px;
            margin-bottom: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 48px;
            margin-bottom: 12px;
        }
        
        .header p {
            font-size: 18px;
            opacity: 0.9;
        }
        
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .kpi-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
        }
        
        .kpi-label {
            font-size: 14px;
            color: #A0AEC0;
            margin-bottom: 8px;
        }
        
        .kpi-value {
            font-size: 32px;
            font-weight: 700;
            font-family: 'Space Grotesk', sans-serif;
            background: linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .section {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 32px;
        }
        
        .section h2 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 28px;
            margin-bottom: 24px;
            background: linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .platform-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .platform-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
        }
        
        .platform-name {
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 16px;
        }
        
        .platform-stat {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .footer {
            text-align: center;
            color: #718096;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MAXZI</h1>
            <p>Performance Report - ${this.formatDateRange(filters)}</p>
            <p style="font-size: 14px; margin-top: 8px;">Generated: ${new Date(generatedAt).toLocaleString()}</p>
        </div>

        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-label">Total Revenue</div>
                <div class="kpi-value">AED ${metrics.totalRevenue.toLocaleString()}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">Total Orders</div>
                <div class="kpi-value">${metrics.totalOrders.toLocaleString()}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">Average Order Value</div>
                <div class="kpi-value">AED ${metrics.avgOrderValue.toFixed(2)}</div>
            </div>
        </div>

        <div class="section">
            <h2>Platform Performance</h2>
            <div class="platform-grid">
                ${this.generatePlatformCards(metrics.platformMetrics)}
            </div>
        </div>

        <div class="footer">
            <p><strong>MAXZI Intelligence Dashboard</strong></p>
            <p>This report contains confidential and proprietary information.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    generatePlatformCards(platformMetrics) {
        const platformNames = {
            deliveroo: 'Deliveroo',
            talabat: 'Talabat',
            noon: 'Noon Food',
            sapaad: 'Dine-In (SAPAAD)'
        };

        return Object.keys(platformMetrics).map(platform => {
            const data = platformMetrics[platform];
            return `
                <div class="platform-card">
                    <div class="platform-name">${platformNames[platform] || platform}</div>
                    <div class="platform-stat">
                        <span>Revenue:</span>
                        <span><strong>AED ${data.revenue.toLocaleString()}</strong></span>
                    </div>
                    <div class="platform-stat">
                        <span>Orders:</span>
                        <span><strong>${data.orders.toLocaleString()}</strong></span>
                    </div>
                    <div class="platform-stat">
                        <span>AOV:</span>
                        <span><strong>AED ${data.aov.toFixed(2)}</strong></span>
                    </div>
                </div>
            `;
        }).join('');
    }

    formatDateRange(filters) {
        if (!filters.startDate || !filters.endDate) {
            return 'All Time';
        }
        const start = new Date(filters.startDate).toLocaleDateString();
        const end = new Date(filters.endDate).toLocaleDateString();
        return `${start} - ${end}`;
    }

    getDateString() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    showSuccessMessage(message) {
        // Simple alert for now - could be replaced with toast notification
        alert(message);
    }
}

// Initialize export manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.exportManager = new ExportManager();
});
