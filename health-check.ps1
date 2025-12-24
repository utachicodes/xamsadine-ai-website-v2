# XamSaDine AI - Full System Health Check (PowerShell)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  XamSaDine AI - Health Check" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$checks_passed = 0
$checks_failed = 0

# Check Node.js
Write-Host "[1] Checking Node.js..." -ForegroundColor Yellow
try {
    $node_version = node --version 2>$null
    Write-Host "✓ Node.js installed: $node_version" -ForegroundColor Green
    $checks_passed++
} catch {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
    $checks_failed++
}

# Check npm
Write-Host "[2] Checking npm..." -ForegroundColor Yellow
try {
    $npm_version = npm --version 2>$null
    Write-Host "✓ npm installed: $npm_version" -ForegroundColor Green
    $checks_passed++
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    $checks_failed++
}

# Check Python
Write-Host "[3] Checking Python..." -ForegroundColor Yellow
try {
    $python_version = python --version 2>$null
    if (-not $python_version) {
        $python_version = python3 --version 2>$null
    }
    Write-Host "✓ Python installed: $python_version" -ForegroundColor Green
    $checks_passed++
} catch {
    Write-Host "✗ Python not found" -ForegroundColor Red
    $checks_failed++
}

# Check dependencies
Write-Host "[4] Checking Node.js dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ node_modules directory exists" -ForegroundColor Green
    
    if (Test-Path "package.json") {
        Write-Host "✓ package.json found" -ForegroundColor Green
        $checks_passed++
    } else {
        Write-Host "✗ package.json not found" -ForegroundColor Red
        $checks_failed++
    }
} else {
    Write-Host "✗ node_modules not found - run 'npm install'" -ForegroundColor Red
    $checks_failed++
}

# Check Python requirements
Write-Host "[5] Checking Python dependencies..." -ForegroundColor Yellow
if (Test-Path "backend/services/translation-service/requirements.txt") {
    Write-Host "✓ requirements.txt found" -ForegroundColor Green
    Write-Host "  Install with: pip install -r backend/services/translation-service/requirements.txt" -ForegroundColor Gray
    $checks_passed++
} else {
    Write-Host "✗ requirements.txt not found" -ForegroundColor Red
    $checks_failed++
}

# Check key files
Write-Host "[6] Checking critical files..." -ForegroundColor Yellow
$files = @(
    "backend/services/api-gateway/src/server.ts",
    "backend/services/api-gateway/src/translation-service-manager.ts",
    "backend/services/translation-service/wolof_translator.py",
    "backend/services/translation-service/app.py"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
        $checks_passed++
    } else {
        Write-Host "✗ $file not found" -ForegroundColor Red
        $checks_failed++
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Setup Instructions" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Install Python dependencies:" -ForegroundColor Yellow
Write-Host "   cd backend/services/translation-service" -ForegroundColor Gray
Write-Host "   pip install -r requirements.txt" -ForegroundColor Gray
Write-Host "   cd ../../.." -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the unified service:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""

if ($checks_failed -eq 0) {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  All Checks Passed! ✓" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Cyan
} else {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  Some checks failed!" -ForegroundColor Red
    Write-Host "  Passed: $checks_passed | Failed: $checks_failed" -ForegroundColor Red
    Write-Host "==========================================" -ForegroundColor Cyan
}