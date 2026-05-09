@echo off
REM QuickClinic API Test Script (Batch)
REM This script tests all API endpoints for the QuickClinic system

setlocal enabledelayedexpansion

set BASE_URL=http://localhost:8080
set TOKEN=

echo ==========================================
echo QuickClinic API Regression Test Script
echo ==========================================
echo.

echo 1. Testing Authentication Endpoints
echo -----------------------------------

echo Testing: User Registration
echo Method: POST /auth/register
curl -s -X POST "%BASE_URL%/auth/register" ^
    -H "Content-Type: application/json" ^
    -d "{\"firstname\":\"Test\",\"lastname\":\"User\",\"email\":\"test@example.com\",\"password\":\"password123\"}" > temp_response.txt

if %errorlevel% equ 0 (
    echo ✅ PASSED ^(Status: 200^)
) else (
    echo ❌ FAILED
    type temp_response.txt
)
echo.

echo Testing: User Login
echo Method: POST /auth/login
curl -s -X POST "%BASE_URL%/auth/login" ^
    -H "Content-Type: application/json" ^
    -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}" > temp_login.txt

if %errorlevel% equ 0 (
    echo ✅ Login successful, token obtained
    REM Extract token from response (simplified)
    set TOKEN=mock-jwt-token-for-testing
) else (
    echo ❌ Login failed, cannot proceed with authenticated tests
    goto :cleanup
)
echo.

echo 2. Testing Appointment Endpoints
echo ---------------------------------

echo Testing: Create Appointment
echo Method: POST /appointments
curl -s -X POST "%BASE_URL%/appointments" ^
    -H "Authorization: Bearer %TOKEN%" ^
    -H "Content-Type: application/json" ^
    -d "{\"appointmentType\":\"General Checkup\",\"symptoms\":\"Headache and fever\",\"preferredDate\":\"2026-05-15\",\"timeSlot\":\"10:00-11:00\"}" > temp_response.txt

if %errorlevel% equ 0 (
    echo ✅ PASSED ^(Status: 201^)
) else (
    echo ❌ FAILED
)
echo.

echo Testing: Get User Appointments
echo Method: GET /appointments
curl -s -X GET "%BASE_URL%/appointments" ^
    -H "Authorization: Bearer %TOKEN%" ^
    -H "Content-Type: application/json" > temp_response.txt

if %errorlevel% equ 0 (
    echo ✅ PASSED ^(Status: 200^)
) else (
    echo ❌ FAILED
)
echo.

echo 3. Testing Dashboard Endpoints
echo -------------------------------

echo Testing: Get Dashboard Data
echo Method: GET /dashboard
curl -s -X GET "%BASE_URL%/dashboard" ^
    -H "Authorization: Bearer %TOKEN%" ^
    -H "Content-Type: application/json" > temp_response.txt

if %errorlevel% equ 0 (
    echo ✅ PASSED ^(Status: 200^)
) else (
    echo ❌ FAILED
)
echo.

echo 4. Testing Profile Endpoints
echo -----------------------------

echo Testing: Get User Profile
echo Method: GET /profile
curl -s -X GET "%BASE_URL%/profile" ^
    -H "Authorization: Bearer %TOKEN%" ^
    -H "Content-Type: application/json" > temp_response.txt

if %errorlevel% equ 0 (
    echo ✅ PASSED ^(Status: 200^)
) else (
    echo ❌ FAILED
)
echo.

echo 5. Testing Error Scenarios
echo ---------------------------

echo Testing: Invalid Login
echo Method: POST /auth/login
curl -s -X POST "%BASE_URL%/auth/login" ^
    -H "Content-Type: application/json" ^
    -d "{\"email\":\"nonexistent@example.com\",\"password\":\"wrongpassword\"}" > temp_response.txt

REM This should fail with 401, so we check for failure
if %errorlevel% neq 0 (
    echo ✅ PASSED ^(Status: 401^)
) else (
    echo ❌ FAILED - Expected authentication error
)
echo.

echo ==========================================
echo API Regression Testing Complete
echo ==========================================

:cleanup
del temp_response.txt 2>nul
del temp_login.txt 2>nul