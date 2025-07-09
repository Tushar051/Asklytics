#!/bin/bash

echo "🚀 Starting Asklytics - GenAI Business Analytics Platform"
echo "=================================================="

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: mongod"
fi

echo "📦 Starting Backend..."
cd backend
if [ ! -f "target/asklytics-backend-1.0.0.jar" ]; then
    echo "🔨 Building backend..."
    mvn clean install -DskipTests
fi

echo "🌐 Starting Spring Boot application..."
java -jar target/asklytics-backend-1.0.0.jar &
BACKEND_PID=$!

echo "📦 Starting Frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "🔨 Installing frontend dependencies..."
    npm install
fi

echo "🌐 Starting React development server..."
npm start &
FRONTEND_PID=$!

echo "✅ Asklytics is starting up!"
echo "📊 Backend: http://localhost:8080"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 