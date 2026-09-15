@echo off
setlocal EnableExtensions
title Liga JR V38 FIX34 - Refresh Cache
color 0A
echo ============================================================
echo  V38 FIX34 - PRIMERA FUERZA + BOTONES + REFRESH CACHE
echo ============================================================
echo.
echo Los cambios FIX34 ya fueron enviados a GitHub main.
echo Este CMD espera GitHub Pages build 38-34 y abre el refresh.
echo NO hace commit, NO hace push y NO modifica archivos locales.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$u='https://jairofrancog7-star.github.io/Liga_Futbol/build-v38.json';$ok=$false;1..36|%%{try{$t=[DateTime]::UtcNow.Ticks;$r=Invoke-RestMethod ($u+'?t='+$t) -Headers @{'Cache-Control'='no-cache'} -TimeoutSec 12;if($r.build -eq '38-34'){$ok=$true;Write-Host 'GitHub Pages: BUILD 38-34 LISTO' -ForegroundColor Green;break}else{Write-Host ('Esperando Pages. Actual: '+$r.build) -ForegroundColor Yellow}}catch{Write-Host 'Esperando GitHub Pages...' -ForegroundColor Yellow};Start-Sleep 10};$open='https://jairofrancog7-star.github.io/Liga_Futbol/refresh-v34.html?t='+[DateTime]::UtcNow.Ticks;Start-Process $open;if(-not $ok){Write-Host 'GitHub main ya tiene FIX34; Pages puede seguir propagando.' -ForegroundColor Yellow}"
echo.
echo ============================================================
echo  REFRESH ABIERTO EN EL NAVEGADOR
echo ============================================================
echo.
echo IMPORTANTE: esta ventana NO se cierra al pulsar una tecla.
echo Para cerrarla, escriba SALIR y presione ENTER.
echo.
:KEEP_OPEN
set /p "JR34_CLOSE=Escriba SALIR para cerrar este CMD: "
if /I "%JR34_CLOSE%"=="SALIR" goto END
echo La ventana sigue abierta. Escriba SALIR cuando quiera cerrarla.
goto KEEP_OPEN
:END
echo Cerrando V38 FIX34...
timeout /t 1 /nobreak >nul
endlocal
exit /b 0
