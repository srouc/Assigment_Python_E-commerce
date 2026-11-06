@echo off
title ShopEase Backend (Django REST Framework)
echo ========================================================
echo   Starting ShopEase Backend Server (Django REST API)
echo   Database: SQLite3 (db.sqlite3)
echo   Local:    http://127.0.0.1:8000
echo   Admin:    http://127.0.0.1:8000/admin/
echo ========================================================
cd /d "%~dp0backend"
"%~dp0..\venv\Scripts\python.exe" manage.py runserver 0.0.0.0:8000
pause
