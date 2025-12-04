@echo off
REM Activate Virtual Environment and Install Dependencies
REM Run this script from the server directory

echo.
echo ========================================
echo SLMS - Activate Virtual Environment
echo ========================================
echo.

REM Check if venv exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
) else (
    echo Virtual environment already exists.
)

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

echo Virtual environment activated!
echo.
echo Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Virtual environment is now active.
echo You can now run:
echo   python manage.py migrate
echo   python manage.py runserver
echo.
echo To deactivate the virtual environment later, type:
echo   deactivate
echo.

pause
