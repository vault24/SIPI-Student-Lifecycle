@echo off
echo ========================================
echo   GitHub Deployment Helper
echo ========================================
echo.

echo Step 1: Create your repository on GitHub
echo Go to: https://github.com/new
echo.
echo Repository Settings:
echo - Name: slms-frontend
echo - Description: Student Learning Management System
echo - Visibility: Private
echo - DO NOT initialize with README
echo.

set /p repo_url="Step 2: Enter your repository URL (e.g., https://github.com/vault24/slms-frontend.git): "

echo.
echo Adding remote repository...
git remote add origin %repo_url%

echo.
echo Checking remote...
git remote -v

echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your code has been pushed to GitHub.
echo Visit your repository to verify.
echo.
pause
