#!/bin/bash
# setup.sh - Automated setup script for XamSaDine AI v2.0

set -e

echo "🚀 XamSaDine AI v2.0 - LLM Council Platform Setup"
echo "=================================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Installing..."
    curl -fsSL https://bun.sh/install | bash
    export PATH=$PATH:$HOME/.bun/bin
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Get OpenRouter API Key
echo "🔑 OpenRouter API Configuration"
echo "==============================="

if [ -f ".env.local" ]; then
    echo "ℹ️  .env.local already exists"
    read -p "Do you want to update the OpenRouter API key? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your OpenRouter API key (get it from https://openrouter.ai): " API_KEY
        if [ -n "$API_KEY" ]; then
            sed -i '' "s/OPENROUTER_API_KEY=.*/OPENROUTER_API_KEY=$API_KEY/" .env.local
            echo "✅ API key updated"
        fi
    fi
else
    echo "Creating .env.local file..."
    read -p "Enter your OpenRouter API key (get it from https://openrouter.ai): " API_KEY
    
    if [ -z "$API_KEY" ]; then
        echo "❌ API key is required"
        exit 1
    fi
    
    cat > .env.local << EOF
OPENROUTER_API_KEY=$API_KEY
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
EOF
    
    echo "✅ .env.local created"
fi

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
bun install

echo "✅ Dependencies installed"
echo ""

# Create data directories
echo "📁 Setting up data directories..."
mkdir -p backend/data
echo "✅ Data directories created"
echo ""

# Display next steps
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1️⃣  Start the backend server (in terminal 1):"
echo "   cd backend/services/api-gateway"
echo "   bun src/server.ts"
echo ""
echo "2️⃣  Start the frontend (in terminal 2):"
echo "   bun dev"
echo ""
echo "3️⃣  Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: QUICK_START.md"
echo "   - Full Guide: LLM_COUNCIL_GUIDE.md"
echo "   - Deployment: DEPLOYMENT.md"
echo ""
echo "🧪 Test the system:"
echo "   curl http://localhost:4000/api/council/health"
echo ""
echo "Happy querying! 🚀"
