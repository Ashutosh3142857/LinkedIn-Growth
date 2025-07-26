#!/bin/bash

# LinkedIn Growth Automation - Startup Script
echo "🚀 Starting LinkedIn Growth Automation..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Create .env file for backend if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your API keys before running in production"
fi

# Function to run frontend
run_frontend() {
    echo "📦 Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
    
    echo "🌐 Starting React frontend on http://localhost:3000..."
    npm run dev
}

# Function to run backend
run_backend() {
    echo "🐍 Setting up Python backend..."
    cd backend
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        echo "📦 Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Python dependencies"
        exit 1
    fi
    
    echo "🔧 Starting FastAPI backend on http://localhost:8000..."
    python main.py
}

# Function to run both in parallel
run_both() {
    # Start backend in background
    (run_backend) &
    BACKEND_PID=$!
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    run_frontend &
    FRONTEND_PID=$!
    
    # Function to cleanup on exit
    cleanup() {
        echo "🛑 Shutting down services..."
        kill $BACKEND_PID 2>/dev/null
        kill $FRONTEND_PID 2>/dev/null
        exit 0
    }
    
    # Set trap to cleanup on script exit
    trap cleanup SIGINT SIGTERM
    
    # Wait for processes
    wait $FRONTEND_PID
    wait $BACKEND_PID
}

# Check command line arguments
case "${1:-both}" in
    "frontend")
        run_frontend
        ;;
    "backend")
        run_backend
        ;;
    "both"|*)
        run_both
        ;;
esac