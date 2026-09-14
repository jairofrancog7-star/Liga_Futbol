param(
 [string]$Repo="C:\Users\Owner\Desktop\LIGA_V38\Liga_Futbol_V38_FIX28",
 [switch]$Fast
)
$ErrorActionPreference='Stop'
$SeedUrl='https://d2ol7oe51mr4n9.cloudfront.net/user_3JFWXON60GMBOz1CiR5CypSau9I/c54f4144-58b5-496a-bc0c-1fe66de711aa.json'
function Say([string]$m,[string]$c='Gray'){Write-Host $m -ForegroundColor $c}
function GetPy(){ $p=Get-Command py -ErrorAction SilentlyContinue;if($p){return @($p.Source,'-3')};$p=Get-Command python -ErrorAction SilentlyContinue;if($p){return @($p.Source)};return $null }
function Valid([string]$Path){
 try{
  $d=Get-Content -Raw -LiteralPath $Path|ConvertFrom-Json
  if(-not $d.categories.'3'){return $false}
  $p=$d.categories.'3'
  $decl=if($p.counts){[int]$p.counts.Jugadores}else{[int]$p.dashboard.counts.Jugadores}
  $scr=if($null -ne $p.public_player_count_scraped){[int]$p.public_player_count_scraped}elseif($null -ne $p.public_names_reconstructed){[int]$p.public_names_reconstructed}else{0}
  if($decl -lt 1){return $false}
  if($d.mode -eq 'fast'){return $true}
  # Primera sí puede reconstruirse completa desde las 20 cédulas públicas actuales.
  if($decl -ne $scr){return $false}
  return $true
 }catch{return $false}
}
if(-not(Test-Path $Repo)){Say "No existe $Repo" Red;exit 2}
$target=Join-Path $Repo 'data\official-live.json';$backup=$null
if(Test-Path $target){$backup=Join-Path $env:TEMP ('LigaJR_official_'+(Get-Date -Format 'yyyyMMdd-HHmmss')+'.json');Copy-Item $target $backup -Force}
$py=GetPy;$ok=$false
if($py){$exe=$py[0];$prefix=@();if($py.Count -gt 1){$prefix=$py[1..($py.Count-1)]}
 & $exe @prefix -c 'import bs4' 2>$null
 if($LASTEXITCODE -ne 0){Say 'Instalando beautifulsoup4...' Yellow;& $exe @prefix -m pip install --quiet beautifulsoup4}
 if($LASTEXITCODE -eq 0){
   $args=@((Join-Path $Repo 'scripts\sync_adminfut_public.py'),'--root',$Repo);if($Fast){$args+='--fast'}
   Say 'Consultando juventinorosasliga.com...' Cyan
   $old=$ErrorActionPreference;$ErrorActionPreference='Continue';try{& $exe @prefix @args;$rc=$LASTEXITCODE}finally{$ErrorActionPreference=$old}
   if($rc -eq 0 -and (Test-Path $target) -and (Valid $target)){$ok=$true;Say 'Datos oficiales actualizados y validados.' Green}
 }}
if(-not $ok){
 Say 'La consulta pública falló o quedó incompleta. No se borrarán datos buenos.' Yellow
 if($backup -and (Test-Path $backup)){Copy-Item $backup $target -Force;Say 'Se restauró el snapshot anterior.' Green;$ok=$true}
 elseif((Test-Path $target) -and (Valid $target)){Say 'Se conserva el snapshot existente.' Green;$ok=$true}
 else{
   try{New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target)|Out-Null;Invoke-WebRequest -UseBasicParsing -Uri $SeedUrl -OutFile $target -TimeoutSec 45;if(Valid $target){Say 'Se instaló snapshot público de respaldo (Primera 291 al 2026-09-14).' Green;$ok=$true}else{Remove-Item $target -ErrorAction SilentlyContinue}}catch{Say 'Tampoco se pudo bajar el snapshot de respaldo.' Yellow}
 }
}
if($backup){Remove-Item $backup -ErrorAction SilentlyContinue}
if($ok){exit 0}else{Say 'Sin snapshot nuevo. El resto del sitio puede seguir funcionando con datos anteriores.' Yellow;exit 0}
