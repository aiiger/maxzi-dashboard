# MAXZI Intelligence Dashboard 2025

## 🎨 Modern, Cutting-Edge Dashboard for Restaurant Analytics

A beautiful, fully-functional dashboard with:
- ✅ Animated gradient background (NO boring blue!)
- ✅ Glassmorphism design
- ✅ Collapsible sidebar navigation
- ✅ CSV upload for 4 platforms (Deliveroo, Talabat, Noon, SAPAAD)
- ✅ Advanced filtering (Date, Location, Platform)
- ✅ Interactive Chart.js charts
- ✅ Export to HTML & PDF
- ✅ Responsive design

---

## 📁 File Structure

```
maxzi-dashboard/
├── index.html              # Main entry point
├── css/
│   ├── styles.css         # Base styles, animated background, sidebar
│   ├── components.css     # Cards, modals, UI components
│   └── animations.css     # Smooth transitions & effects
├── js/
│   ├── dashboard.js       # Main app controller
│   ├── data-manager.js    # CSV upload & parsing
│   ├── filters.js         # Date/location/platform filters
│   ├── charts.js          # Chart.js configuration
│   └── export.js          # HTML/PDF report generation
└── README.md              # This file
```

---

## 🚀 How to Run

### Option 1: Simple HTTP Server (Recommended)

```bash
# Navigate to the dashboard folder
cd maxzi-dashboard

# Start a local server (Python 3)
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Or Node.js
npx http-server -p 8000
```

Then open: `http://localhost:8000`

### Option 2: Open Directly

Just double-click `index.html` (some features may not work)

---

## 📤 How to Upload Data

1. Click the **"📤 Upload Data"** button in the sidebar
2. Upload CSV files for each platform:
   - **Deliveroo** - Orders, revenue, locations
   - **Talabat** - Orders, revenue, locations
   - **Noon Food** - Orders, revenue, locations  
   - **SAPAAD** - Dine-in orders, revenue, locations

### CSV Format Expected

Your CSV should have these columns (flexible names):
- `Date` or `date` or `Order Date`
- `Revenue` or `revenue` or `Total` or `Amount`
- `Location` or `location` or `Restaurant`
- `Orders` or `orders` (optional, defaults to 1 per row)
- `Rating` or `rating` (optional)
- `Order ID` or `order_id` (optional)

**Example CSV:**
```csv
Date,Location,Revenue,Orders,Rating
2025-01-20,Al Quoz,15000,120,4.7
2025-01-21,JVC,12500,95,4.8
```

---

## 🔍 Features

### 📊 Overview Dashboard
- **KPI Cards**: Total Revenue, Orders, AOV, Rating
- **Revenue Chart**: Interactive 7/30/90-day trend chart
- **Platform Cards**: Performance breakdown by platform

### 🔽 Filters
- **Date Range**: Last 7 days, Last 30 days, Custom range
- **Location**: Multi-select location filter
- **Platform**: Select specific platforms to analyze

### 📄 Export Reports
- **HTML**: Beautiful styled reports
- **PDF**: Print-ready PDF exports
- Includes all metrics, charts, and recommendations

### 🎯 Navigation Sections
- **ANALYTICS**
  - Overview Dashboard
  - Operations Monitor (coming soon)
  - Platform Deep Dive (coming soon)
  - Location Intelligence (coming soon)

- **BUSINESS**
  - Menu Engineering (coming soon)
  - Smash & Sear (coming soon)
  - Reports (coming soon)

- **ENGAGEMENT**
  - Social Intelligence (coming soon)
  - Reputation Monitor (coming soon)

---

## 🎨 Design Features

- **Animated Gradient Orbs**: Floating purple/teal/green orbs
- **Glassmorphism**: Frosted glass effect on cards
- **Smooth Animations**: Fade-in, slide-in, hover effects
- **Responsive**: Works on desktop, tablet, mobile
- **Dark Theme**: Easy on the eyes

---

## 🛠️ Technologies Used

- **Chart.js** - Data visualization
- **PapaParse** - CSV parsing
- **Flatpickr** - Date picker
- **html2pdf.js** - PDF export
- **Vanilla JavaScript** - No frameworks needed
- **Modern CSS** - Glassmorphism, gradients, animations

---

## 📝 Notes

- Data is stored in browser localStorage
- No backend required - runs 100% client-side
- Works offline after initial load
- Clear browser data to reset dashboard

---

## 🔮 Roadmap

- [ ] Operations Monitor view
- [ ] Platform Deep Dive analytics
- [ ] Location Intelligence heatmaps
- [ ] Menu Engineering matrix
- [ ] Social media integration (Meta API)
- [ ] Google My Business integration
- [ ] Automated data refresh
- [ ] Multi-user support

---

## 💡 Tips

1. **Collapse Sidebar**: Click the toggle button to maximize content area
2. **Quick Date Filter**: Click date filter for preset ranges
3. **Chart Period**: Switch between 7D/30D/90D views
4. **Export Reports**: Generate beautiful HTML/PDF reports anytime
5. **Filter Combinations**: Combine date, location, and platform filters

---

## 🎯 Built with ❤️ for MAXZI Restaurant Group

**Version**: 1.0.0  
**Last Updated**: January 2025

---

Need help? The dashboard is self-explanatory, but if you have questions:
1. All data stays in your browser (privacy first!)
2. Upload fresh CSVs anytime to update data
3. Filters apply across all views
4. Export includes current filter settings
