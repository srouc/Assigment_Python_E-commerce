@echo off
title Launch ShopEase Full-Stack
echo ========================================================
echo   Launching ShopEase Full-Stack E-Commerce System
echo   Frontend: Next.js 14 (Port 3000)
echo   Backend:  Django REST Framework (Port 8000)
echo ========================================================
echo Starting Backend (Django REST API)...
start "ShopEase Backend (Django)" "%~dp0start_backend.bat"
timeout /t 2 /nobreak >nul
echo Starting Frontend (Next.js)...
start "ShopEase Frontend (Next.js)" "%~dp0start_frontend.bat"
echo ========================================================
echo Both servers launched in separate windows!
echo - Storefront:   http://localhost:3000
echo - Backend API:  http://127.0.0.1:8000/api/
echo - Admin Panel:  http://127.0.0.1:8000/admin/
echo ========================================================
pause
