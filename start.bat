@echo off
echo 🚀 Starting Asklytics - GenAI Business Analytics Platform
echo ==================================================

REM Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java is not installed. Please install Java 17 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo 📦 Starting Backend...
cd backend
if not exist "target\asklytics-backend-1.0.0.jar" (
    echo 🔨 Building backend...
    mvn clean install -DskipTests
)

echo 🌐 Starting Spring Boot application...
start "Asklytics Backend" java -jar target\asklytics-backend-1.0.0.jar

echo 📦 Starting Frontend...
cd ..\frontend
if not exist "node_modules" (
    echo 🔨 Installing frontend dependencies...
    npm install
)

echo 🌐 Starting React development server...
start "Asklytics Frontend" npm start

echo ✅ Asklytics is starting up!
echo 📊 Backend: http://localhost:8080
echo 🎨 Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul 