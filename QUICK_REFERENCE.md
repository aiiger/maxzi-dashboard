# 🚀 MAXZI DASHBOARD - QUICK REFERENCE CARD

## ⚡ INSTANT START

### **1. Download**
```
/home/claude/maxzi-dashboard/ → Download entire folder
```

### **2. Install**
```bash
# Backend
cd backend && pip install -r requirements.txt

# Frontend  
cd frontend && npm install
```

### **3. Run**
```bash
# macOS/Linux:  ./start.sh
# Windows:      start.bat
```

### **4. Open**
```
🌐 http://localhost:3000
```

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `backend/app.py` | Flask API server |
| `backend/database.py` | Database setup |
| `frontend/src/App.jsx` | Main React component |
| `README.md` | Full documentation |
| `FEATURES.md` | Complete feature list |
| `DELIVERY.md` | Setup instructions |

---

## 🔗 API ENDPOINTS

```
GET /api/overview           → Dashboard metrics
GET /api/locations          → All locations
GET /api/platforms          → Delivery platforms
GET /api/social-media       → Social metrics
GET /api/ai-insights        → AI predictions
GET /api/realtime           → Live data
GET /api/analytics/revenue-trend → 30-day chart
```

---

## 🎨 BRANDING

**Colors:**
- Primary: `#8BC34A` (MAXZI Green)
- Dark: `#689F38`
- Light: `#AED581`

**Fonts:**
- Headers: `'Cinzel', serif`
- Body: `'Inter', sans-serif`

---

## 📊 SAMPLE DATA

- **8 Locations** (Restaurant + Franchise)
- **3,881 Orders** (Deliveroo, Talabat, Noon)
- **AED 429K** Total revenue
- **30 Days** Historical data

---

## 🎯 FEATURES COUNT

✅ **150+ Features Implemented**

Key highlights:
- Real-time updates (5 sec)
- AI predictions
- Glassmorphism UI
- Chart.js visualizations
- Framer Motion animations
- Mobile responsive
- Component architecture

---

## 🔧 CUSTOMIZATION

**Change colors:** `frontend/src/App.css`
**Edit data:** `backend/database.py`
**API config:** `frontend/src/services/api.js`

---

## 🆘 TROUBLESHOOTING

**Backend won't start?**
```bash
cd backend && python app.py
```

**Frontend won't start?**
```bash
cd frontend && npm start
```

**Database issues?**
```bash
cd backend && python database.py
```

**CORS errors?**
```bash
pip install flask-cors
```

---

## 📞 QUICK LINKS

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- API Health: http://localhost:5000/api/health

---

## 💡 PRO TIPS

1. **Sidebar:** Hover to expand
2. **Cards:** Click to see details
3. **Charts:** Hover for tooltips
4. **AI Panel:** Click to expand predictions
5. **Live Badge:** Real-time data indicator

---

**Built for MAXZI - The Good Food Shop 🌿**

Print this card for quick reference! 📋
