# MAXZI Analytics Dashboard - Quick Start Guide

## Prerequisites

Before you begin, make sure you have:

- **Python 3.7+** installed
- **Node.js 14+** and npm installed
- **SQLite** (usually comes with Python)

## Installation & Setup

### Option 1: Automated Start (Recommended)

#### On Linux/macOS:
```bash
chmod +x start.sh
./start.sh
```

#### On Windows:
```bash
start.bat
```

The script will automatically:
1. Initialize the SQLite database (if not exists)
2. Start the Flask backend API server
3. Start the React frontend application
4. Open your browser to the dashboard

### Option 2: Manual Setup

#### Step 1: Initialize Database
```bash
cd backend
python3 database.py
```

You should see:
```
✅ Database initialized successfully!
📊 Sample data loaded for 8 locations
🍜 3881 orders across 3 platforms
```

#### Step 2: Install Backend Dependencies
```bash
cd backend
pip3 install -r requirements.txt
```

#### Step 3: Install Frontend Dependencies
```bash
cd frontend
npm install
```

#### Step 4: Start Backend (Terminal 1)
```bash
cd backend
python3 app.py
```

Backend will run on: **http://localhost:5000**

#### Step 5: Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

Frontend will run on: **http://localhost:3000**

## Accessing the Dashboard

Once both servers are running, open your browser to:

**http://localhost:3000**

You should see the MAXZI Analytics Dashboard with:
- Real-time KPI metrics
- Revenue charts
- Platform performance (Deliveroo, Talabat, Noon Food)
- Location analytics for 8 locations
- AI-powered insights and recommendations

## Database Information

### Current Data
- **Total Orders:** 3,881
- **Total Revenue:** AED 429,225
- **Locations:** 8 (Al Quoz, Circle Mall JVC, Yas Mall, Al Furjan, Food Truck, Al Jada, Al Jimi Mall, Avenue Mall)
- **Platforms:** Deliveroo, Talabat, Noon Food
- **Time Range:** Last 7 days of sample data

### Database File
- **Location:** `backend/maxzi_analytics.db`
- **Size:** ~396KB
- **Type:** SQLite3

### Tables
1. **orders** - Individual order records
2. **daily_performance** - Aggregated daily metrics
3. **location_performance** - Location-specific metrics

## API Endpoints

The backend provides the following REST API endpoints:

### Dashboard
- `GET /api/health` - API health check
- `GET /api/overview` - Dashboard overview metrics

### Locations
- `GET /api/locations` - All locations with performance
- `GET /api/locations/<id>` - Detailed location analytics

### Platforms
- `GET /api/platforms` - Deliveroo, Talabat, Noon Food metrics

### Analytics
- `GET /api/realtime` - Real-time metrics
- `GET /api/ai-insights` - AI predictions & recommendations
- `GET /api/analytics/revenue-trend` - 30-day trend data
- `GET /api/social-media` - Social media metrics
- `GET /api/gmb` - Google My Business data

## Troubleshooting

### Backend won't start
**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
cd backend
pip3 install -r requirements.txt
```

### Frontend won't start
**Error:** `npm: command not found`

**Solution:** Install Node.js from https://nodejs.org/

**Error:** `Missing dependencies`

**Solution:**
```bash
cd frontend
npm install
```

### Database errors
**Error:** `no such table: orders`

**Solution:** Initialize the database:
```bash
cd backend
python3 database.py
```

### Port already in use
**Error:** `Address already in use`

**Backend (Port 5000):**
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9  # Linux/macOS
netstat -ano | findstr :5000   # Windows
```

**Frontend (Port 3000):**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9  # Linux/macOS
netstat -ano | findstr :3000   # Windows
```

### CORS errors
Make sure the backend is running and CORS is enabled in `backend/app.py`:
```python
from flask_cors import CORS
CORS(app)
```

## Customization

### Change API Port
Edit `backend/app.py`:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Change 5000 to your port
```

Update `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:YOUR_PORT/api';
```

### Add Your Own Data
Replace the sample data in `backend/database.py` or import from CSV:
```python
import csv
import sqlite3

conn = sqlite3.connect('maxzi_analytics.db')
cursor = conn.cursor()

with open('your_data.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        cursor.execute('''
            INSERT INTO orders (order_id, location_id, platform, date, revenue, aov)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (row['order_id'], row['location_id'], row['platform'],
              row['date'], row['revenue'], row['aov']))

conn.commit()
conn.close()
```

## Next Steps

1. **Explore the Dashboard** - Navigate through all sections
2. **Check the API** - Visit http://localhost:5000/api/health
3. **Review Documentation** - Read README.md and FEATURES.md
4. **Customize** - Update locations, add your data
5. **Deploy** - Follow DELIVERY.md for production deployment

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review README.md for detailed documentation
3. Check FEATURES.md for complete feature list
4. Review DELIVERY.md for deployment guide

## System Requirements

- **Backend:** Python 3.7+, 100MB RAM
- **Frontend:** Node.js 14+, Chrome/Firefox/Safari
- **Database:** SQLite3 (no separate installation needed)
- **Disk Space:** ~500MB for dependencies

## Verified Working Environment

This dashboard has been successfully tested and verified working on:
- Linux (Ubuntu)
- Python 3.11
- Node.js 18
- SQLite3

**Last Verified:** October 24, 2025
