#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "🍜 MAXZI Analytics Dashboard - The Good Food Shop"
echo "════════════════════════════════════════════════════════════"
echo ""

# Check if database exists, initialize if not
if [ ! -f "backend/maxzi_analytics.db" ]; then
    echo "📦 Database not found. Initializing..."
    cd backend
    python3 database.py
    cd ..
    echo "✅ Database initialized successfully!"
    echo ""
fi

echo "🔧 Starting Backend API Server (Flask)..."
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend API is healthy and running on http://localhost:5000"
else
    echo "⚠️  Backend may still be starting..."
fi

echo ""
echo "⚛️  Starting Frontend React Application..."
cd frontend
npm start

# Cleanup on exit
trap "echo ''; echo '🛑 Shutting down...'; kill $BACKEND_PID 2>/dev/null" EXIT INT TERM
