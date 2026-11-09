@echo off
title Launch ShopEase Full-Stack
echo ========================================================
echo   Launching ShopEase Full-Stack E-Commerce System
echo   Frontend: Next.js 14 (Port 3000)
echo   Backend:  Flask REST API (Port 8000)
echo ========================================================
echo Starting Backend (Flask REST API)...
start "ShopEase Backend (Flask)" "%~dp0start_backend.bat"
timeout /t 2 /nobreak >nul
echo Starting Frontend (Next.js)...
start "ShopEase Frontend (Next.js)" "%~dp0start_frontend.bat"
echo ========================================================
echo Both servers launched in separate windows!
echo - Storefront:   http://localhost:3000
echo - Backend API:  http://127.0.0.1:8000
echo ========================================================
pause
