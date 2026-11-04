@echo off
title ShopEase Backend (Django REST)
echo ========================================================
echo   Starting ShopEase Backend Server (Django REST API)
echo   Local:   http://127.0.0.1:8000
echo   Network: http://localhost:8000
echo ========================================================
cd /d "%~dp0backend"
"%~dp0..\venv\Scripts\python.exe" manage.py runserver 0.0.0.0:8000
pause
