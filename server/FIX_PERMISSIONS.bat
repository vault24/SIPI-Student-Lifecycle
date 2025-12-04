@echo off
REM Fix PostgreSQL Permissions for SLMS
REM Run this to grant proper permissions to sipi_web user

echo.
echo ========================================
echo SLMS - Fix PostgreSQL Permissions
echo ========================================
echo.

echo Running permission fix script...
psql -U postgres -f fix_postgres_permissions.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Permissions fixed successfully!
    echo ========================================
    echo.
    echo You can now run:
    echo   python manage.py migrate
    echo.
) else (
    echo.
    echo ERROR: Failed to fix permissions
    echo.
    echo Make sure:
    echo 1. PostgreSQL is running
    echo 2. You have the postgres password
    echo.
)

pause
