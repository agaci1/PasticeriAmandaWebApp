#!/bin/bash

echo "🚀 Pasticeri Amanda Deployment Script"
echo "====================================="

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Please commit all changes before deploying"
    exit 1
fi

echo "✅ Git repository is clean"

# Build backend
echo "🔨 Building backend..."
cd backend
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi
echo "✅ Backend built successfully"

# Build frontend
echo "🔨 Building frontend..."
cd ../frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
echo "✅ Frontend built successfully"

echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Push your changes to GitHub"
echo "2. Go to Railway dashboard: https://railway.app/dashboard"
echo "3. Deploy backend and frontend services"
echo "4. Configure environment variables"
echo "5. Set up custom domain in Cloudflare"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 