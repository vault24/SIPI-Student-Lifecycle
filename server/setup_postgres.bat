@echo off
REM PostgreSQL Setup Script for SLMS (Windows)
REM This script sets up PostgreSQL database for SLMS

echo.
echo ========================================
echo SLMS PostgreSQL Setup Script
echo ========================================
echo.

REM Check if psql is available
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL is not installed or psql is not in PATH
    echo Please install PostgreSQL from https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo PostgreSQL found. Proceeding with setup...
echo.

REM Run the SQL setup script
echo Running SQL setup script...
psql -U postgres -f setup_postgres.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Setup completed successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Navigate to the server directory: cd server
    echo 2. Install Python dependencies: pip install -r requirements.txt
    echo 3. Run migrations: python manage.py migrate
    echo 4. Start the server: python manage.py runserver
    echo.
) else (
    echo.
    echo ERROR: Setup failed. Please check the error messages above.
    echo.
)

pause
