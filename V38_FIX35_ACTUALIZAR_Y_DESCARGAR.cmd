@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Liga JR V38 FIX35 - Actualizar y descargar publicaciones
color 0A
echo ============================================================
echo  V38 FIX35 - PADRON + AMERICA 35+ + PUBLICACIONES
echo ============================================================
echo.
echo FIX35 ya fue publicado directamente en GitHub main.
echo Este CMD verifica BUILD 38-35 o superior, abre el refresh
echo y descarga las publicaciones sociales en Descargas.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='SilentlyContinue';$base='https://jairofrancog7-star.github.io/Liga_Futbol';$ok=$false;for($i=0;$i -lt 48;$i++){try{$r=Invoke-RestMethod ($base+'/build-v38.json?t='+[DateTime]::UtcNow.Ticks) -Headers @{'Cache-Control'='no-cache'} -TimeoutSec 12;$m=[regex]::Match([string]$r.build,'^38-(\d+)$');if($m.Success -and [int]$m.Groups[1].Value -ge 35){Write-Host ('GitHub Pages: BUILD '+$r.build+' LISTO') -ForegroundColor Green;$ok=$true;break}else{Write-Host ('Esperando Pages. Actual: '+$r.build) -ForegroundColor Yellow}}catch{Write-Host 'Esperando GitHub Pages...' -ForegroundColor Yellow};Start-Sleep 10};$refresh=$base+'/refresh-v35.html?t='+[DateTime]::UtcNow.Ticks;Start-Process $refresh;$dest=Join-Path $env:USERPROFILE 'Downloads\LigaJR_FIX35_PUBLICACIONES';New-Item -ItemType Directory -Force -Path $dest|Out-Null;$files=@('resumen-tablas.png','resumen-jornada.png','comunicado-america-veteranos-35.png','tabla-primera-fuerza.png','jornada-primera-fuerza.png','tabla-intermedia.png','jornada-intermedia.png','tabla-segunda-fuerza.png','jornada-segunda-fuerza.png','tabla-veteranos-50.png','jornada-veteranos-50.png');foreach($f in $files){try{Invoke-WebRequest ($base+'/publicaciones/latest/'+$f+'?t='+[DateTime]::UtcNow.Ticks) -OutFile (Join-Path $dest $f) -Headers @{'Cache-Control'='no-cache'} -TimeoutSec 20;Write-Host ('DESCARGADO: '+$f) -ForegroundColor Cyan}catch{Write-Host ('Aun no disponible: '+$f) -ForegroundColor DarkYellow}};Start-Process $dest;if(-not $ok){Write-Host 'Main ya tiene FIX35; Pages puede seguir propagando.' -ForegroundColor Yellow}"
echo.
echo FIX35 abierto. Publicaciones: %%USERPROFILE%%\Downloads\LigaJR_FIX35_PUBLICACIONES
echo.
echo Esta ventana solo se cierra si escribes SALIR y presionas ENTER.
:KEEP
set /p "CERRAR=Escriba SALIR para cerrar: "
if /I "%CERRAR%"=="SALIR" goto END
echo La ventana sigue abierta.
goto KEEP
:END
endlocal
exit /b 0
