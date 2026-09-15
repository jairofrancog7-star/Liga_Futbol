@echo off
setlocal EnableExtensions
title Liga Juventino Rosas - V38 FIX53

set "BASE=https://jairofrancog7-star.github.io/Liga_Futbol"
set "URL=%BASE%/?refresh=38-53^&fix=liga-header-top-20260915#home"

echo ============================================================
echo  LIGA JUVENTINO ROSAS - V38 FIX53
echo  LOGO DE LIGA ARRIBA + CATEGORIAS ARRIBA
echo ============================================================
echo.
echo Abriendo la version corregida con cache nueva...
start "" "%URL%"
echo.
echo Si no cambia al instante, presiona Ctrl+F5.
echo.
pause
endlocal
