#!/bin/bash

# Pasticeri Amanda WebApp - Stop Local Services
echo "🛑 Stopping Pasticeri Amanda WebApp services..."

# Stop backend
echo "📦 Stopping Backend..."
pkill -f "java.*pasticeri-amanda-backend" 2>/dev/null
pkill -f "spring-boot:run" 2>/dev/null

# Stop frontend
echo "🌐 Stopping Frontend..."
pkill -f "npm.*dev" 2>/dev/null
pkill -f "next.*dev" 2>/dev/null

# Check if processes are still running
sleep 2

if pgrep -f "pasticeri-amanda-backend" > /dev/null; then
    echo "⚠️  Backend is still running. Force stopping..."
    pkill -9 -f "pasticeri-amanda-backend"
fi

if pgrep -f "npm.*dev" > /dev/null; then
    echo "⚠️  Frontend is still running. Force stopping..."
    pkill -9 -f "npm.*dev"
fi

echo "✅ All services stopped!"
echo ""
echo "🔍 Check if ports are free:"
echo "   Backend (8081):  lsof -i :8081"
echo "   Frontend (3000): lsof -i :3000" 