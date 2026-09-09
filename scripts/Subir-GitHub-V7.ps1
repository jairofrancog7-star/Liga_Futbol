param()

$ErrorActionPreference = "Stop"
$PayloadRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

$Owner = "jairofrancog7-star"
$DefaultRepo = "liga-juventino-rosas"
$PayloadVersion = "7.0-fix-doc-examples"

function Write-Step($text) {
    Write-Host ""
    Write-Host "==> $text" -ForegroundColor Cyan
}

function Refresh-Path {
    $machine = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $user = [Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = "$machine;$user"
}

function Ensure-Command($cmd, $wingetId, $label) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) { return }

    Write-Step "$label no esta instalado. Intentando instalarlo con winget..."
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        throw "No se encontro winget. Instala $label manualmente y vuelve a ejecutar este archivo."
    }

    & winget install --id $wingetId -e --source winget --accept-package-agreements --accept-source-agreements
    Refresh-Path

    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        throw "$label se instalo, pero Windows aun no lo detecta. Cierra esta ventana y vuelve a ejecutar SUBIR_LIGA_A_GITHUB.cmd."
    }
}

function Add-GitIgnoreRules([string]$ProjectPath) {
    $gitignorePath = Join-Path $ProjectPath ".gitignore"
    $required = @(
        ".env",
        ".env.*",
        "!.env.example",
        "node_modules/",
        ".next/",
        "dist/",
        "build/",
        "coverage/",
        "*.log",
        "*.pem",
        "*.key",
        "*.p12",
        "*.pfx",
        "backups/",
        "exports/",
        "private/",
        "tmp/"
    )

    $existingLines = @()
    if (Test-Path $gitignorePath) {
        $existingLines = @(Get-Content $gitignorePath -ErrorAction SilentlyContinue)
    }

    $toAdd = @()
    foreach ($rule in $required) {
        # PowerShell/.NET regex no soporta \Q...\E como Perl.
        # Usamos comparacion literal de lineas para evitar errores de escape.
        if (-not ($existingLines -contains $rule)) {
            $toAdd += $rule
        }
    }

    if ($toAdd.Count -gt 0) {
        Add-Content -Path $gitignorePath -Value "`r`n# Seguridad JR / GitHub`r`n$($toAdd -join "`r`n")`r`n"
    }
}

function Copy-Documentation([string]$ProjectPath) {
    $dest = Join-Path $ProjectPath "docs\jr-auditoria"
    New-Item -ItemType Directory -Force -Path $dest | Out-Null

    $docSource = Join-Path $PayloadRoot "documentacion"
    if (Test-Path $docSource) {
        Get-ChildItem $docSource -File | ForEach-Object {
            Copy-Item $_.FullName -Destination (Join-Path $dest $_.Name) -Force
        }
    }

    $envExample = Join-Path $ProjectPath ".env.example"
    if (-not (Test-Path $envExample)) {
        $payloadEnv = Join-Path $PayloadRoot ".env.example"
        if (Test-Path $payloadEnv) {
            Copy-Item $payloadEnv $envExample
        }
    }

    $readme = Join-Path $ProjectPath "README.md"
    if (-not (Test-Path $readme)) {
        $payloadReadme = Join-Path $PayloadRoot "README.md"
        if (Test-Path $payloadReadme) {
            Copy-Item $payloadReadme $readme
        }
    }
}

function Check-StagedSecrets {
    $staged = & git diff --cached --name-only
    $badNames = $staged | Where-Object {
        $_ -match '(^|/)\.env($|\.)' -and $_ -notmatch '\.env\.example$' -or
        $_ -match '\.(pem|key|p12|pfx)$' -or
        $_ -match '(^|/)(backups?|exports?|private)/'
    }

    if ($badNames) {
        Write-Host ""
        Write-Host "Se detectaron archivos sensibles preparados para subir:" -ForegroundColor Red
        $badNames | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        throw "Carga cancelada. Revisa .gitignore y elimina esos archivos del staging."
    }

    # Buscar VALORES reales, no solamente nombres de variables.
    # V5 marcaba por error .env.example porque contenia:
    # SUPABASE_SECRET_KEY=
    # aunque estuviera vacio. V6 exige que haya un valor no vacio.
    $patterns = @(
        'SUPABASE_(SERVICE_ROLE|SECRET_KEY)[[:space:]]*=[[:space:]]*[^[:space:]#]+',
        'BEGIN [A-Z ]*PRIVATE KEY',
        'github_pat_[A-Za-z0-9_]+',
        'ghp_[A-Za-z0-9]+',
        'sb_secret_[A-Za-z0-9_-]+'
    )

    # Archivos generados por este payload que contienen EJEMPLOS de secretos
    # para explicar lo que NO se debe subir. No deben disparar falsos positivos.
    $ignoreSecretScanPatterns = @(
        '^LEER_ANTES_V[0-9]+\.txt$',
        '^LEEME_PRIMERO\.txt$',
        '^CORRECCION_V[0-9]+\.txt$',
        '^README\.md$',
        '^documentacion/',
        '^docs/jr-auditoria/',
        '^scripts/Subir-GitHub-V[0-9]+\.ps1$',
        '^SUBIR_GITHUB_V[0-9]+.*\.cmd$',
        '^CREAR_RAR_EN_WINDOWS\.cmd$',
        '^\.env\.example$'
    )

    $stagedFilesForScan = @(& git diff --cached --name-only)
    $filesToScan = @()

    foreach ($file in $stagedFilesForScan) {
        $ignore = $false
        foreach ($ignorePattern in $ignoreSecretScanPatterns) {
            if ($file -match $ignorePattern) {
                $ignore = $true
                break
            }
        }
        if (-not $ignore) {
            $filesToScan += $file
        }
    }

    $secretMatches = @()
    if ($filesToScan.Count -gt 0) {
        foreach ($pattern in $patterns) {
            foreach ($file in $filesToScan) {
                $result = & git grep --cached -I -n -E $pattern -- $file 2>$null
                if ($LASTEXITCODE -eq 0 -and $result) {
                    $secretMatches += $result
                }
            }
        }
    }

    if ($secretMatches.Count -gt 0) {
        Write-Host ""
        Write-Host "Posibles secretos REALES detectados dentro de archivos del proyecto:" -ForegroundColor Red
        $secretMatches | Select-Object -Unique | Select-Object -First 20 | ForEach-Object {
            Write-Host $_ -ForegroundColor Red
        }
        throw "Carga cancelada para evitar exponer credenciales."
    } else {
        Write-Host "Revision de secretos: OK." -ForegroundColor Green
        Write-Host "Los archivos de instrucciones con ejemplos fueron excluidos del escaneo." -ForegroundColor DarkGray
    }
}

Write-Host "Payload version: $PayloadVersion" -ForegroundColor DarkGray
Write-Step "Comprobando herramientas"
Ensure-Command "git" "Git.Git" "Git"
Ensure-Command "gh" "GitHub.cli" "GitHub CLI"

Write-Step "Selecciona la carpeta REAL de tu proyecto"
Write-Host "Si el codigo de Liga Juventino Rosas esta en tu PC, pega aqui la ruta."
Write-Host "Ejemplo: C:\Users\Jairo\Documents\liga-juventino-rosas"
Write-Host ""
$inputPath = Read-Host "Ruta del proyecto (ENTER = subir solo este paquete inicial)"
if ([string]::IsNullOrWhiteSpace($inputPath)) {
    $ProjectPath = $PayloadRoot
} else {
    $ProjectPath = $inputPath.Trim('"')
}

if (-not (Test-Path $ProjectPath -PathType Container)) {
    throw "La carpeta no existe: $ProjectPath"
}
$ProjectPath = (Resolve-Path $ProjectPath).Path
Set-Location $ProjectPath

Write-Step "Protegiendo secretos y agregando documentacion"
Add-GitIgnoreRules $ProjectPath
if ($ProjectPath -ne $PayloadRoot) {
    Copy-Documentation $ProjectPath
}

Write-Step "Comprobando inicio de sesion de GitHub"
& gh auth status -h github.com *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Se abrira el navegador para iniciar sesion en GitHub."
    & gh auth login -h github.com -p https -w
}

$login = (& gh api user --jq ".login").Trim()
if ($login -ne $Owner) {
    throw "GitHub CLI esta conectado como '$login', pero este payload esta preparado para '$Owner'. Cambia de cuenta con: gh auth logout"
}
Write-Host "Cuenta verificada: $login" -ForegroundColor Green

$repoInput = Read-Host "Nombre del repositorio (ENTER = $DefaultRepo)"
if ([string]::IsNullOrWhiteSpace($repoInput)) {
    $RepoName = $DefaultRepo
} else {
    $RepoName = $repoInput.Trim()
}
$FullRepo = "$Owner/$RepoName"
$RemoteUrl = "https://github.com/$FullRepo.git"

Write-Step "Preparando repositorio local"
if (-not (Test-Path (Join-Path $ProjectPath ".git"))) {
    & git init
    if ($LASTEXITCODE -ne 0) { throw "No se pudo iniciar Git." }
}
& git branch -M main

# Local git identity only if missing
$name = (& git config user.name 2>$null)
$email = (& git config user.email 2>$null)
if ([string]::IsNullOrWhiteSpace($name)) {
    & git config user.name $Owner
}
if ([string]::IsNullOrWhiteSpace($email)) {
    & git config user.email "$Owner@users.noreply.github.com"
}

Write-Step "Creando repositorio privado en GitHub si no existe"

# IMPORTANTE:
# gh escribe un error en STDERR cuando el repo no existe. Con
# $ErrorActionPreference="Stop", PowerShell puede tratar ese mensaje
# esperado como una excepcion. Por eso comprobamos la existencia
# dentro de try/catch y no dejamos que detenga el script.
$RepoExists = $false
try {
    $previousEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $null = & gh api "repos/$FullRepo" 2>$null
    if ($LASTEXITCODE -eq 0) {
        $RepoExists = $true
    }
} catch {
    $RepoExists = $false
} finally {
    $ErrorActionPreference = $previousEap
}

if (-not $RepoExists) {
    Write-Host "El repositorio no existe todavia. Creandolo ahora..." -ForegroundColor Cyan
    & gh repo create $FullRepo --private --description "Liga Juventino Rosas - plataforma de futbol municipal"
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo crear el repositorio en GitHub."
    }
    Write-Host "Repositorio creado: $FullRepo" -ForegroundColor Green
} else {
    Write-Host "El repositorio ya existe: $FullRepo" -ForegroundColor Yellow
}

Write-Step "Configurando remote origin"

# Evitamos ejecutar "git remote get-url origin" cuando origin no existe,
# porque Windows PowerShell puede convertir ese STDERR esperado en error fatal.
$remoteNames = @(& git remote)
$currentOrigin = $null

if ($remoteNames -contains "origin") {
    $currentOrigin = (& git remote get-url origin)
}

if (-not [string]::IsNullOrWhiteSpace($currentOrigin)) {
    if ($currentOrigin.Trim() -ne $RemoteUrl) {
        Write-Host "Origin actual: $currentOrigin" -ForegroundColor Yellow
        Write-Host "Nuevo origin:  $RemoteUrl" -ForegroundColor Yellow
        $answer = Read-Host "Cambiar origin al repositorio de Liga Juventino Rosas? (S/N)"
        if ($answer -notmatch '^[sS]') {
            throw "Proceso cancelado para no modificar un remote existente."
        }
        & git remote set-url origin $RemoteUrl
        if ($LASTEXITCODE -ne 0) { throw "No se pudo actualizar origin." }
    } else {
        Write-Host "Origin ya esta configurado correctamente." -ForegroundColor Green
    }
} else {
    & git remote add origin $RemoteUrl
    if ($LASTEXITCODE -ne 0) { throw "No se pudo agregar origin." }
    Write-Host "Origin agregado: $RemoteUrl" -ForegroundColor Green
}

Write-Step "Preparando archivos"
& git add .
if ($LASTEXITCODE -ne 0) { throw "git add fallo." }

Check-StagedSecrets

$status = & git diff --cached --name-only
if (-not $status) {
    Write-Host "No hay archivos nuevos para commit." -ForegroundColor Yellow
} else {
    Write-Host "Archivos preparados: $($status.Count)" -ForegroundColor Green
    & git commit -m "Initial import - Liga Juventino Rosas"
    if ($LASTEXITCODE -ne 0) { throw "No se pudo crear el commit." }
}

Write-Step "Subiendo a GitHub"
& git push -u origin main
if ($LASTEXITCODE -ne 0) { throw "El push a GitHub fallo." }

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " LISTO: PROYECTO SUBIDO A GITHUB" -ForegroundColor Green
Write-Host " https://github.com/$FullRepo" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "El repositorio es PRIVADO. GitLab ya puede importarlo desde GitHub."
Write-Host "Nunca subas .env, claves service_role, respaldos ni documentos personales."

$open = Read-Host "Abrir el repositorio en el navegador? (S/N)"
if ($open -match '^[sS]') {
    Start-Process "https://github.com/$FullRepo"
}

exit 0
