#!/bin/bash

echo "🚀 Starting Pastiçeri Amanda Backend in Development Mode..."
echo "📁 Database will be stored in: ./data/pasticeri_amanda_db.mv.db"
echo "🌐 Server will run on: http://localhost:8081"
echo "🔧 H2 Console available at: http://localhost:8081/h2-console"
echo ""

# Create data directory if it doesn't exist
mkdir -p data

# Start the application
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev 