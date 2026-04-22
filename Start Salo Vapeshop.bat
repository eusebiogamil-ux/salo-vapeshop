@echo off
title Salo Vapeshop

echo Starting Salo Vapeshop...
echo.

:: Start backend
start "Backend" cmd /k "D: && cd \"Downloads\Claude Code\backend\" && .venv\Scripts\activate && uvicorn app.main:app --port 8000"

:: Wait 3 seconds for backend to start
timeout /t 3 /nobreak > nul

:: Start frontend
start "Frontend" cmd /k "D: && cd \"Downloads\Claude Code\frontend\" && npm run dev"

:: Wait 3 seconds for frontend to start
timeout /t 3 /nobreak > nul

:: Open browser
start http://localhost:5173

echo.
echo Salo Vapeshop is running!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Close the Backend and Frontend windows to stop the app.
