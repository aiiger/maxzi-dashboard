@echo off
echo ============================================================
echo 🍜 MAXZI Analytics Dashboard - The Good Food Shop
echo ============================================================
echo.

REM Check if database exists, initialize if not
if not exist "backend\maxzi_analytics.db" (
    echo 📦 Database not found. Initializing...
    cd backend
    python database.py
    cd ..
    echo ✅ Database initialized successfully!
    echo.
)

echo 🔧 Starting Backend API Server (Flask)...
start "MAXZI Backend API" cmd /k "cd backend && python app.py"

echo ⏳ Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo.
echo ⚛️  Starting Frontend React Application...
start "MAXZI Frontend Dashboard" cmd /k "cd frontend && npm start"

echo.
echo ════════════════════════════════════════════════════════════
echo ✅ MAXZI Dashboard is starting...
echo ════════════════════════════════════════════════════════════
echo.
echo 🔗 Backend API:  http://localhost:5000
echo 🌐 Frontend:     http://localhost:3000
echo.
echo Press any key to exit (servers will keep running)...
pause > nul
