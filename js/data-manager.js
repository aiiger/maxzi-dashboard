// ============================================
// DATA MANAGER - CSV Upload & Storage
// ============================================

class DataManager {
    constructor() {
        this.data = {
            deliveroo: [],
            talabat: [],
            noon: [],
            sapaad: []
        };
        this.init();
    }

    init() {
        this.setupDropzones();
        this.loadDataFromStorage();
    }

    setupDropzones() {
        const platforms = ['deliveroo', 'talabat', 'noon', 'sapaad'];
        
        platforms.forEach(platform => {
            const dropzone = document.getElementById(`${platform}Dropzone`);
            const fileInput = document.getElementById(`${platform}File`);

            // Click to browse
            dropzone.addEventListener('click', () => {
                fileInput.click();
            });

            // Drag and drop
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('active');
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('active');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('active');
                
                const file = e.dataTransfer.files[0];
                if (file && file.name.endsWith('.csv')) {
                    this.handleFile(file, platform, dropzone);
                } else {
                    this.showError(dropzone, 'Please upload a CSV file');
                }
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFile(file, platform, dropzone);
                }
            });
        });
    }

    handleFile(file, platform, dropzone) {
        this.showLoading(dropzone);

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                this.processData(results.data, platform, dropzone);
            },
            error: (error) => {
                this.showError(dropzone, `Parse error: ${error.message}`);
            }
        });
    }

    processData(csvData, platform, dropzone) {
        try {
            // Validate and normalize data
            const normalizedData = this.normalizeData(csvData, platform);
            
            // Store data
            this.data[platform] = normalizedData;
            this.saveToStorage();

            // Update UI
            this.showSuccess(dropzone, `${normalizedData.length} orders loaded`);
            
            // Update dashboard
            if (window.dashboard) {
                window.dashboard.updateDashboard(this.data);
            }

            // Update charts
            if (window.chartManager) {
                window.chartManager.updateData(this.data);
            }

        } catch (error) {
            this.showError(dropzone, `Processing error: ${error.message}`);
        }
    }

    normalizeData(csvData, platform) {
        // Normalize different CSV formats to a common structure
        return csvData.map(row => {
            const normalized = {
                platform: platform,
                date: this.parseDate(row),
                orderId: row['Order ID'] || row['order_id'] || row.id || '',
                location: row['Location'] || row['location'] || row['Restaurant'] || '',
                revenue: this.parseRevenue(row),
                orders: parseInt(row['Orders'] || row['orders'] || 1),
                aov: this.parseRevenue(row) / (parseInt(row['Orders'] || row['orders'] || 1)),
                rating: parseFloat(row['Rating'] || row['rating'] || 0),
                rawData: row // Keep original data
            };

            return normalized;
        });
    }

    parseDate(row) {
        // Try to find date in various column names
        const dateValue = row['Date'] || row['date'] || row['Order Date'] || row['order_date'] || new Date().toISOString();
        
        try {
            return new Date(dateValue).toISOString();
        } catch {
            return new Date().toISOString();
        }
    }

    parseRevenue(row) {
        // Try to find revenue in various column names
        const revenueValue = row['Revenue'] || row['revenue'] || row['Total'] || row['total'] || 
                            row['Amount'] || row['amount'] || row['Net Sales'] || row['net_sales'] || 0;
        
        // Remove currency symbols and parse
        const cleaned = String(revenueValue).replace(/[^0-9.-]+/g, '');
        return parseFloat(cleaned) || 0;
    }

    saveToStorage() {
        try {
            localStorage.setItem('maxziData', JSON.stringify(this.data));
            localStorage.setItem('maxziDataTimestamp', new Date().toISOString());
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    loadDataFromStorage() {
        try {
            const stored = localStorage.getItem('maxziData');
            if (stored) {
                this.data = JSON.parse(stored);
                console.log('Data loaded from storage');
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    showLoading(dropzone) {
        dropzone.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
                <circle cx="12" cy="12" r="10"></circle>
            </svg>
            <p>Processing...</p>
        `;
        dropzone.classList.remove('error', 'success');
    }

    showSuccess(dropzone, message) {
        dropzone.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>${message}</p>
            <p style="font-size: 12px; margin-top: 8px;">Click to upload new file</p>
        `;
        dropzone.classList.remove('error');
        dropzone.classList.add('success');
    }

    showError(dropzone, message) {
        dropzone.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <p style="color: #EF4444;">${message}</p>
            <p style="font-size: 12px; margin-top: 8px;">Click to try again</p>
        `;
        dropzone.classList.remove('success');
        dropzone.classList.add('error');
    }

    getData() {
        return this.data;
    }

    getFilteredData(filters) {
        let filtered = { ...this.data };

        // Apply date filter
        if (filters.startDate && filters.endDate) {
            Object.keys(filtered).forEach(platform => {
                filtered[platform] = filtered[platform].filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate >= filters.startDate && itemDate <= filters.endDate;
                });
            });
        }

        // Apply location filter
        if (filters.locations && filters.locations.length > 0) {
            Object.keys(filtered).forEach(platform => {
                filtered[platform] = filtered[platform].filter(item => {
                    return filters.locations.includes(item.location);
                });
            });
        }

        // Apply platform filter
        if (filters.platforms && filters.platforms.length > 0) {
            const result = {};
            filters.platforms.forEach(platform => {
                result[platform] = filtered[platform] || [];
            });
            filtered = result;
        }

        return filtered;
    }

    clearData(platform = null) {
        if (platform) {
            this.data[platform] = [];
        } else {
            this.data = {
                deliveroo: [],
                talabat: [],
                noon: [],
                sapaad: []
            };
        }
        this.saveToStorage();
    }
}

// Initialize data manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dataManager = new DataManager();
});
