# Activate Virtual Environment and Install Dependencies
# Run this script from the server directory

Write-Host ""
Write-Host "========================================"
Write-Host "SLMS - Activate Virtual Environment"
Write-Host "========================================"
Write-Host ""

# Check if venv exists
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create virtual environment"
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "Virtual environment created successfully!"
} else {
    Write-Host "Virtual environment already exists."
}

Write-Host ""
Write-Host "Activating virtual environment..."

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to activate virtual environment"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Virtual environment activated!"
Write-Host ""
Write-Host "Installing dependencies..."

# Upgrade pip
python -m pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================"
Write-Host "Setup Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "Virtual environment is now active."
Write-Host "You can now run:"
Write-Host "  python manage.py migrate"
Write-Host "  python manage.py runserver"
Write-Host ""
Write-Host "To deactivate the virtual environment later, type:"
Write-Host "  deactivate"
Write-Host ""

Read-Host "Press Enter to continue"
