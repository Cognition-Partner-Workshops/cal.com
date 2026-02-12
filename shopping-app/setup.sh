#!/bin/bash
set -e

echo "========================================="
echo "  ShopHub Shopping App - Setup Script"
echo "========================================="
echo ""

check_command() {
  if ! command -v "$1" &> /dev/null; then
    echo "ERROR: $1 is not installed. Please install it first."
    exit 1
  fi
}

echo "Checking prerequisites..."
check_command node
check_command npm

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "ERROR: Node.js 18+ is required. Current version: $(node -v)"
  exit 1
fi
echo "  Node.js $(node -v) - OK"
echo "  npm $(npm -v) - OK"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env.local ]; then
  echo "Creating .env.local from template..."
  cp .env.example .env.local
  echo "  .env.local created. Edit it to customize settings."
else
  echo "  .env.local already exists."
fi
echo ""

echo "Installing dependencies..."
npm install
echo ""

echo "Setting up database..."
mkdir -p data
npx tsx src/lib/seed.ts
echo ""

echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "To start the app:"
echo "  npm run dev"
echo ""
echo "The app will be available at:"
echo "  http://localhost:3099"
echo ""
echo "Demo credentials:"
echo "  Email: demo@shop.com"
echo "  Password: password123"
echo ""
echo "To run tests:"
echo "  npm test            # Unit & API tests"
echo "  npm run test:e2e    # E2E tests (requires app running)"
echo ""
