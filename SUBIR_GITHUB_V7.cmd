@echo off
setlocal
title Liga Juventino Rosas - GitHub V7
cd /d "%~dp0"

echo ============================================================
echo   LIGA JUVENTINO ROSAS - GITHUB V7
echo ============================================================
echo.
echo VERSION: 7.0-fix-doc-examples
echo.
echo Esta version corrige los falsos positivos dentro de:
echo   LEER_ANTES_V6.txt
echo.
echo Esas lineas eran ejemplos de lo que NO se debe subir,
echo no credenciales reales.
echo.
pause

if not exist "%~dp0scripts\Subir-GitHub-V7.ps1" (
  echo ERROR: No se encontro scripts\Subir-GitHub-V7.ps1
  echo Extrae TODO el ZIP V7 en una carpeta nueva.
  pause
  exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\Subir-GitHub-V7.ps1"
set EXITCODE=%ERRORLEVEL%

echo.
if "%EXITCODE%"=="0" (
  echo ============================================================
  echo   LISTO: PROYECTO SUBIDO A GITHUB
  echo ============================================================
) else (
  echo ============================================================
  echo   EL PROCESO SE DETUVO CON ERROR %EXITCODE%
  echo ============================================================
)
echo.
pause
exit /b %EXITCODE%
