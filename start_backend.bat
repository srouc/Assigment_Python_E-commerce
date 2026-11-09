@echo off
title ShopEase Backend (Flask REST API)
echo ========================================================
echo   Starting ShopEase Backend Server (Flask REST API)
echo   Database: MySQL (Port 3306) / SQLite Fallback
echo   Local API: http://127.0.0.1:8000
echo ========================================================
cd /d "%~dp0backend"
"%~dp0..\venv\Scripts\python.exe" app.py
pause
