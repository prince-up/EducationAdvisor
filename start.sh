#!/bin/bash

echo "Starting Digital Career Advisor Project..."

echo ""
echo "Installing Backend Dependencies..."
cd backend
pip install -r requirements.txt

echo ""
echo "Starting Backend Server..."
python run.py &

echo ""
echo "Installing Frontend Dependencies..."
cd ../frontend
npm install

echo ""
echo "Starting Frontend Server..."
npm run dev &

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"

wait
