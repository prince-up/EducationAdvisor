@echo off
echo Setting up Voice Chatbot for Digital Career Advisor...
echo.

echo Installing frontend dependencies...
cd frontend
npm install
echo.

echo Installing backend dependencies...
cd ../backend
pip install -r requirements.txt
echo.

echo Setup complete! 
echo.
echo To start the application:
echo 1. Start backend: cd backend && python run.py
echo 2. Start frontend: cd frontend && npm run dev
echo.
echo The voice chatbot will be available on the homepage!
pause
