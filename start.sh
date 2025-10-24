#!/bin/bash

echo "🚀 Starting MAXZI Analytics Dashboard..."
echo ""
echo "📊 Initializing Backend (Flask API)..."
cd backend
python app.py &
BACKEND_PID=$!

echo ""
echo "⚛️  Starting Frontend (React)..."
cd ../frontend
npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
