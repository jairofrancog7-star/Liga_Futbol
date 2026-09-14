param([string]$Repo="C:\Users\Owner\Desktop\LIGA_V38\Liga_Futbol_V38_631_10619")
$ErrorActionPreference="Stop"
$Feature="feature/v38-home-clima-campos"

Write-Host "============================================================"
Write-Host " PUBLICAR V38 FIX18 EN GITHUB PAGES - OPCIONAL"
Write-Host "============================================================"
Write-Host ""
Write-Host "Esto SI puede modificar main." -ForegroundColor Yellow
$answer=Read-Host "Escribe exactamente PUBLICAR para continuar"
if($answer -cne "PUBLICAR"){
  Write-Host "Cancelado. main no fue tocado."
  Read-Host "Enter"
  exit 0
}
if(-not(Test-Path $Repo)){$Repo=(Read-Host "Ruta del repositorio").Trim('"')}
if((& git -C $Repo rev-parse --is-inside-work-tree 2>$null).Trim() -ne "true"){throw "No es repo Git."}
$Repo=(& git -C $Repo rev-parse --show-toplevel).Trim()

& git -C $Repo switch $Feature
if($LASTEXITCODE -ne 0){throw "No pude cambiar a $Feature."}
& node (Join-Path $Repo "scripts\test-v38-fix18.js") $Repo
if($LASTEXITCODE -ne 0){throw "FIX18 no paso pruebas. main no fue tocado."}
& git -C $Repo fetch origin --prune
if($LASTEXITCODE -ne 0){throw "fetch fallo."}
& git -C $Repo push -u origin $Feature
if($LASTEXITCODE -ne 0){throw "push rama fallo. main no fue tocado."}

& git -C $Repo switch main
if($LASTEXITCODE -ne 0){throw "No pude cambiar a main."}
$published=$false
try{
  & git -C $Repo pull --ff-only origin main
  if($LASTEXITCODE -ne 0){throw "main no pudo fast-forward."}
  & git -C $Repo merge --no-ff $Feature -m "Publish V38 FIX18 diverse real soccer motion"
  if($LASTEXITCODE -ne 0){
    & git -C $Repo merge --abort 2>$null
    throw "Merge fallo y fue abortado."
  }
  & git -C $Repo push origin main
  if($LASTEXITCODE -ne 0){throw "push main fallo."}
  $published=$true
} finally {
  & git -C $Repo switch $Feature | Out-Null
}
if($published){
  $n=[DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  Write-Host "PUBLICADO FIX18." -ForegroundColor Green
  Start-Process "https://jairofrancog7-star.github.io/Liga_Futbol/?refresh=38-18&n=$n"
}
Read-Host "Enter"
