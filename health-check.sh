#!/bin/bash

# XamSaDine AI - Full System Health Check

echo "=========================================="
echo "  XamSaDine AI - Health Check"
echo "=========================================="
echo ""

# Check Node.js
echo "[1] Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js installed: $NODE_VERSION"
else
    echo "✗ Node.js not found"
    exit 1
fi

# Check npm
echo "[2] Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm installed: $NPM_VERSION"
else
    echo "✗ npm not found"
    exit 1
fi

# Check Python
echo "[3] Checking Python..."
if command -v python &> /dev/null || command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python --version 2>&1 || python3 --version)
    echo "✓ Python installed: $PYTHON_VERSION"
else
    echo "✗ Python not found"
    exit 1
fi

# Check dependencies
echo "[4] Checking Node.js dependencies..."
if [ -d "node_modules" ]; then
    echo "✓ node_modules directory exists"
    
    if [ -f "package.json" ]; then
        echo "✓ package.json found"
    else
        echo "✗ package.json not found"
        exit 1
    fi
else
    echo "✗ node_modules not found - run 'npm install'"
    exit 1
fi

# Check Python dependencies
echo "[5] Checking Python dependencies..."
if [ -f "backend/services/translation-service/requirements.txt" ]; then
    echo "✓ requirements.txt found"
    echo "  Install with: pip install -r backend/services/translation-service/requirements.txt"
else
    echo "✗ requirements.txt not found"
    exit 1
fi

# Check key files
echo "[6] Checking critical files..."
FILES=(
    "backend/services/api-gateway/src/server.ts"
    "backend/services/api-gateway/src/translation-service-manager.ts"
    "backend/services/translation-service/wolof_translator.py"
    "backend/services/translation-service/app.py"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file not found"
        exit 1
    fi
done

echo ""
echo "=========================================="
echo "  Setup Instructions"
echo "=========================================="
echo ""
echo "1. Install Python dependencies:"
echo "   cd backend/services/translation-service"
echo "   pip install -r requirements.txt"
echo "   cd ../../.."
echo ""
echo "2. Start the unified service:"
echo "   npm run dev"
echo ""
echo "=========================================="
echo "  All Checks Passed!"
echo "=========================================="
