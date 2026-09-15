@echo off
setlocal EnableExtensions
title Liga Juventino Rosas - V38 FIX51 America

set "BASE=https://jairofrancog7-star.github.io/Liga_Futbol"
set "URL=%BASE%/?refresh=38-51^&n=%RANDOM%%RANDOM%#more"

echo ============================================================
echo  LIGA JUVENTINO ROSAS - V38 FIX51
echo  RESTAURAR ESCUDO DEL AMERICA EN LA PARTE SUPERIOR
echo ============================================================
echo.
echo Abriendo la version corregida con cache nueva...
start "" "%URL%"
echo.
echo Si no cambia al instante, presiona Ctrl+F5 en la ventana.
echo El enlace directo ya fue actualizado en GitHub Pages.
echo.
pause
endlocal
