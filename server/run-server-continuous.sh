#!/bin/bash
# Script to run Django dev server with auto-restart on crash

# Navigate to the directory where this script is located
cd "$(dirname "$0")"

# Activate virtualenv (adjust venv folder name if different)
source venv/bin/activate

echo "Starting Django dev server with auto-restart..."
echo "Press Ctrl+C to stop."
echo ""

# Infinite loop: server will restart if it stops
while true
do
  python manage.py runserver 0.0.0.0:8000
  echo "Server stopped (exit code: $?). Restarting in 3 seconds..."
  sleep 3
done
