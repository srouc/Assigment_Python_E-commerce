@echo off
title Launch ShopEase Full-Stack
echo ========================================================
echo   Launching ShopEase (Backend + Frontend)
echo ========================================================
echo Starting Backend (Django)...
start "ShopEase Backend (Django)" "%~dp0start_backend.bat"
timeout /t 2 /nobreak >nul
echo Starting Frontend (Next.js)...
start "ShopEase Frontend (Next.js)" "%~dp0start_frontend.bat"
echo ========================================================
echo Both servers launched in separate windows!
echo - Storefront: http://localhost:3000
echo - Backend API: http://127.0.0.1:8000/api/
echo - Admin Portal: http://127.0.0.1:8000/admin/
echo ========================================================
pause

