@echo off
title Deep Whiteboard Server
echo.
echo =================================
echo  Starting Deep Whiteboard
echo =================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting development server...
echo Your default browser will now open...
echo.
echo IMPORTANT: Keep this window open to use the application.
echo.

REM Start the Vite development server
start http://localhost:8080
npm run dev

pause
