@echo off
setlocal EnableExtensions
title Liga Juventino Rosas - V38 FIX51 America

set "BASE=https://jairofrancog7-star.github.io/Liga_Futbol"
set "URL=%BASE%/refresh-v51.html?force=%RANDOM%%RANDOM%#refresh"

echo ============================================================
echo  LIGA JUVENTINO ROSAS - V38 FIX51
echo  RESTAURAR ESCUDO DEL AMERICA EN LA PARTE SUPERIOR
echo ============================================================
echo.
echo Limpiando cache y abriendo la version corregida...
start "" "%URL%"
echo.
echo Si no cambia al instante, presiona Ctrl+F5 en la ventana.
echo El enlace directo ya fue actualizado en GitHub Pages.
echo.
pause
endlocal
