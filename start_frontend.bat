@echo off
title ShopEase Frontend (Next.js)
echo ========================================================
echo   Starting ShopEase Frontend (Next.js Storefront)
echo   URL: http://localhost:3000
echo ========================================================
cd /d "%~dp0frontend"
npm run dev
pause
