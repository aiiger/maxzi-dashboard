// ============================================
// FILTER MANAGER - Date, Location, Platform
// ============================================

class FilterManager {
    constructor() {
        this.filters = {
            dateRange: 'last7days',
            startDate: null,
            endDate: null,
            locations: [],
            platforms: ['deliveroo', 'talabat', 'noon', 'sapaad']
        };
        this.init();
    }

    init() {
        this.initDatePicker();
        this.setDefaultDateRange();
    }

    initDatePicker() {
        this.datePickerInstance = flatpickr('#dateFilterBtn', {
            mode: 'range',
            dateFormat: 'M d, Y',
            defaultDate: [
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                new Date()
            ],
            onClose: (selectedDates) => {
                if (selectedDates.length === 2) {
                    this.applyDateFilter(selectedDates[0], selectedDates[1]);
                }
            }
        });
    }

    setDefaultDateRange() {
        const endDate = new Date();
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        this.filters.startDate = startDate;
        this.filters.endDate = endDate;
        
        this.updateDateFilterText('Last 7 Days');
    }

    showDatePicker() {
        if (this.datePickerInstance) {
            this.datePickerInstance.open();
        }
    }

    applyDateFilter(startDate, endDate) {
        this.filters.startDate = startDate;
        this.filters.endDate = endDate;
        
        // Update button text
        const text = `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
        this.updateDateFilterText(text);
        
        // Apply filters
        this.applyFilters();
    }

    updateDateFilterText(text) {
        document.getElementById('dateFilterText').textContent = text;
    }

    showLocationFilter() {
        // Get unique locations from data
        const locations = this.getUniqueLocations();
        
        if (locations.length === 0) {
            alert('No location data available. Please upload data first.');
            return;
        }

        // Create modal for location selection
        this.showFilterModal('Locations', locations, this.filters.locations, (selected) => {
            this.filters.locations = selected;
            this.updateLocationFilterText();
            this.applyFilters();
        });
    }

    showPlatformFilter() {
        const platforms = [
            { id: 'deliveroo', name: 'Deliveroo' },
            { id: 'talabat', name: 'Talabat' },
            { id: 'noon', name: 'Noon Food' },
            { id: 'sapaad', name: 'Dine-In (SAPAAD)' }
        ];

        this.showFilterModal('Platforms', platforms, this.filters.platforms, (selected) => {
            this.filters.platforms = selected;
            this.updatePlatformFilterText();
            this.applyFilters();
        });
    }

    showFilterModal(title, items, selected, onApply) {
        // Create a simple modal for selection
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h3>Select ${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body" style="max-height: 400px;">
                    <div id="filterOptions"></div>
                    <div style="display: flex; gap: 12px; margin-top: 24px;">
                        <button class="export-btn" onclick="this.closest('.modal').querySelector('.apply-filter-btn').click()" style="flex: 1;">
                            Apply
                        </button>
                        <button class="filter-btn" onclick="this.closest('.modal').remove()" style="flex: 1;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add checkboxes
        const optionsContainer = modal.querySelector('#filterOptions');
        items.forEach(item => {
            const id = typeof item === 'string' ? item : item.id;
            const name = typeof item === 'string' ? item : item.name;
            const isChecked = selected.includes(id);

            const checkbox = document.createElement('div');
            checkbox.style.cssText = 'padding: 12px; display: flex; align-items: center; gap: 12px; cursor: pointer; border-radius: 8px; transition: background 0.2s;';
            checkbox.onmouseover = () => checkbox.style.background = 'rgba(139, 92, 246, 0.1)';
            checkbox.onmouseout = () => checkbox.style.background = 'transparent';
            
            checkbox.innerHTML = `
                <input type="checkbox" id="filter-${id}" value="${id}" ${isChecked ? 'checked' : ''} 
                       style="width: 18px; height: 18px; cursor: pointer;">
                <label for="filter-${id}" style="cursor: pointer; flex: 1;">${name}</label>
            `;
            optionsContainer.appendChild(checkbox);
        });

        // Apply button handler
        const applyBtn = document.createElement('button');
        applyBtn.className = 'apply-filter-btn';
        applyBtn.style.display = 'none';
        applyBtn.onclick = () => {
            const selectedIds = Array.from(optionsContainer.querySelectorAll('input:checked'))
                .map(cb => cb.value);
            onApply(selectedIds);
            modal.remove();
        };
        modal.appendChild(applyBtn);
    }

    getUniqueLocations() {
        const data = window.dataManager ? window.dataManager.getData() : {};
        const locations = new Set();

        Object.values(data).forEach(platformData => {
            platformData.forEach(item => {
                if (item.location) {
                    locations.add(item.location);
                }
            });
        });

        return Array.from(locations).sort();
    }

    updateLocationFilterText() {
        const count = this.filters.locations.length;
        const text = count === 0 ? 'All Locations' : `${count} Location${count > 1 ? 's' : ''}`;
        document.getElementById('locationFilterText').textContent = text;
    }

    updatePlatformFilterText() {
        const count = this.filters.platforms.length;
        const text = count === 4 ? 'All Platforms' : `${count} Platform${count > 1 ? 's' : ''}`;
        document.getElementById('platformFilterText').textContent = text;
    }

    applyFilters() {
        if (!window.dataManager) return;

        // Get filtered data
        const filteredData = window.dataManager.getFilteredData(this.filters);

        // Update dashboard with filtered data
        if (window.dashboard) {
            window.dashboard.updateDashboard(filteredData);
        }

        // Update charts
        if (window.chartManager) {
            window.chartManager.updateData(filteredData);
        }

        console.log('Filters applied:', this.filters);
    }

    resetFilters() {
        this.filters = {
            dateRange: 'last7days',
            startDate: null,
            endDate: null,
            locations: [],
            platforms: ['deliveroo', 'talabat', 'noon', 'sapaad']
        };
        
        this.setDefaultDateRange();
        this.updateLocationFilterText();
        this.updatePlatformFilterText();
        this.applyFilters();
    }

    formatDate(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    }

    getActiveFilters() {
        return { ...this.filters };
    }
}

// Initialize filter manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.filterManager = new FilterManager();
});
