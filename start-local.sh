#!/bin/bash

# Pasticeri Amanda WebApp - Local Development Starter
# This script starts both backend and frontend services

echo "🚀 Starting Pasticeri Amanda WebApp locally..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Start Backend
echo "📦 Starting Backend (Spring Boot)..."
cd backend

# Check if backend is already running
if check_port 8081; then
    echo "✅ Starting backend on port 8081..."
    ./start-dev.sh > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo "🔧 Backend started with PID: $BACKEND_PID"
else
    echo "❌ Backend port 8081 is already in use"
    echo "   You can check what's running with: lsof -i :8081"
fi

cd ..

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "🌐 Starting Frontend (Next.js)..."
cd frontend

# Check if frontend is already running
if check_port 3000; then
    echo "✅ Starting frontend on port 3000..."
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "🎨 Frontend started with PID: $FRONTEND_PID"
else
    echo "❌ Frontend port 3000 is already in use"
    echo "   You can check what's running with: lsof -i :3000"
fi

cd ..

echo ""
echo "🎉 Pasticeri Amanda WebApp is starting up!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8081"
echo "🏥 Health:   http://localhost:8081/api/health"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop all services:"
echo "   pkill -f 'java.*pasticeri-amanda-backend'"
echo "   pkill -f 'npm.*dev'"
echo ""
echo "⏳ Waiting for services to be ready..."
echo "   (This may take 30-60 seconds for first startup)"

# Wait and check if services are ready
sleep 10

echo ""
echo "🔍 Checking service status..."

# Check backend health
if curl -s http://localhost:8081/api/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy!"
else
    echo "⏳ Backend is starting up..."
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is responding!"
else
    echo "⏳ Frontend is starting up..."
fi

echo ""
echo "🎯 Your application should be available at:"
echo "   🌐 http://localhost:3000"
echo ""
echo "💡 If you see 'starting up' messages, wait a bit longer and refresh your browser." 