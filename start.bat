@echo off
echo 🚀 Starting MAXZI Analytics Dashboard...
echo.
echo 📊 Starting Backend (Flask API)...
start "MAXZI Backend" cmd /k "cd backend && python app.py"

timeout /t 3 /nobreak > nul

echo.
echo ⚛️  Starting Frontend (React)...
start "MAXZI Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Dashboard starting...
echo 📊 Backend: http://localhost:5000
echo ⚛️  Frontend: http://localhost:3000
echo.
pause
