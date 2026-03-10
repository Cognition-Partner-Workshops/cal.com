#!/bin/bash
# ==============================================================================
# Cal.com Selenium Test Runner
# ==============================================================================
# Usage:
#   ./run_tests.sh              # Run all tests
#   ./run_tests.sh test_login   # Run specific test file
#   ./run_tests.sh -k "login"   # Run tests matching keyword
#
# Prerequisites:
#   1. Install dependencies: pip install -r requirements.txt
#   2. Start the Cal.com dev server: yarn dev (from project root)
#   3. Ensure Chrome/Chromium is installed
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

BASE_URL="${BASE_URL:-http://localhost:3000}"
echo "=============================================="
echo " Cal.com Selenium Automated Tests"
echo "=============================================="
echo " Target: $BASE_URL"
echo " Date:   $(date)"
echo "=============================================="

# Check if the app is running
if ! curl -s --max-time 5 "$BASE_URL" > /dev/null 2>&1; then
    echo ""
    echo "WARNING: Cal.com app does not appear to be running at $BASE_URL"
    echo "Please start the dev server with 'yarn dev' before running tests."
    echo ""
    exit 1
fi

echo ""
echo "Running tests..."
echo ""

if [ $# -eq 0 ]; then
    python -m pytest -v --tb=short --html=report.html --self-contained-html 2>&1
else
    python -m pytest -v --tb=short --html=report.html --self-contained-html "$@" 2>&1
fi

EXIT_CODE=$?

echo ""
echo "=============================================="
if [ $EXIT_CODE -eq 0 ]; then
    echo " All tests PASSED"
else
    echo " Some tests FAILED (exit code: $EXIT_CODE)"
fi
echo " HTML Report: $SCRIPT_DIR/report.html"
echo "=============================================="

exit $EXIT_CODE
