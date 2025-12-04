@echo off
REM Script to run Django dev server with auto-restart on crash

REM Navigate to the directory where this script is located
cd /d "%~dp0"

REM Activate virtualenv
call venv\Scripts\activate.bat

echo Starting Django dev server with auto-restart...
echo Press Ctrl+C to stop.
echo.

REM Infinite loop: server will restart if it stops
:loop
python manage.py runserver 0.0.0.0:8000
echo Server stopped. Restarting in 3 seconds...
timeout /t 3 /nobreak
goto loop
