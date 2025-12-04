#!/bin/bash

# PostgreSQL Setup Script for SLMS (Linux/macOS)
# This script sets up PostgreSQL database for SLMS

echo ""
echo "========================================"
echo "SLMS PostgreSQL Setup Script"
echo "========================================"
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "ERROR: PostgreSQL is not installed or psql is not in PATH"
    echo "Please install PostgreSQL:"
    echo "  macOS: brew install postgresql@15"
    echo "  Linux: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

echo "PostgreSQL found. Proceeding with setup..."
echo ""

# Check if PostgreSQL service is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "WARNING: PostgreSQL service is not running"
    echo "Starting PostgreSQL service..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew services start postgresql@15
    else
        # Linux
        sudo systemctl start postgresql
    fi
    
    sleep 2
fi

# Run the SQL setup script
echo "Running SQL setup script..."
psql -U postgres -f setup_postgres.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Setup completed successfully!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Navigate to the server directory: cd server"
    echo "2. Install Python dependencies: pip install -r requirements.txt"
    echo "3. Run migrations: python manage.py migrate"
    echo "4. Start the server: python manage.py runserver"
    echo ""
else
    echo ""
    echo "ERROR: Setup failed. Please check the error messages above."
    echo ""
    exit 1
fi
