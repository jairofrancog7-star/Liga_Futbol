@echo off
setlocal
title Liga Juventino Rosas - V38.60 Refresh
color 0A
cls
echo ============================================================
echo  LIGA JUVENTINO ROSAS - V38.60
echo  REFRESH WEB + VERSION MOVIL / PC
echo ============================================================
echo.
echo Abriendo la version 38-60 sin cache anterior...
start "" "https://jairofrancog7-star.github.io/Liga_Futbol/?refresh=38-60&n=%RANDOM%%RANDOM%"
echo.
echo APK Android 1.5.1:
echo https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/downloads/Liga_Juventino_Rosas.apk
echo.
echo Si el navegador estaba abierto, usa Ctrl+F5 una sola vez.
echo El Service Worker del proyecto esta configurado para borrar caches viejos.
echo.
pause
endlocal
