@echo off
setlocal
cd /d "%~dp0"
set "WINRAR=%ProgramFiles%\WinRAR\WinRAR.exe"
if not exist "%WINRAR%" set "WINRAR=%ProgramFiles(x86)%\WinRAR\WinRAR.exe"

if not exist "%WINRAR%" (
  echo WinRAR no esta instalado.
  echo Puedes usar directamente el ZIP que te entregue ChatGPT.
  echo Si quieres un RAR real, instala WinRAR y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

"%WINRAR%" a -r -ep1 "Liga_Juventino_Rosas_GitHub_Payload.rar" "*"
echo.
echo RAR creado:
echo %CD%\Liga_Juventino_Rosas_GitHub_Payload.rar
pause
