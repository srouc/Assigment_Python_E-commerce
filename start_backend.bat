@echo off
title ShopEase Backend (Flask + MySQL)
echo ========================================================
echo   Starting ShopEase Backend Server (Flask REST API)
echo   Database: MySQL shopease_db (phpMyAdmin / XAMPP)
echo   Local:    http://127.0.0.1:8000
echo   Network:  http://localhost:8000
echo ========================================================
cd /d "%~dp0backend"
"%~dp0..\venv\Scripts\python.exe" app.py
pause
