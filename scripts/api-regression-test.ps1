# QuickClinic API Test Script (PowerShell)
# This script tests all API endpoints for the QuickClinic system

param(
    [string]$BaseUrl = "http://localhost:8080"
)

$Token = ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "QuickClinic API Regression Test Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to make API calls and check response
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Data = "",
        [string]$ExpectedStatus,
        [string]$Description
    )

    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "Method: $Method $Url"

    $headers = @{
        "Content-Type" = "application/json"
    }

    if ($Token -and ($Method -eq "GET" -or $Method -eq "POST" -or $Method -eq "PUT" -or $Method -eq "DELETE")) {
        $headers["Authorization"] = "Bearer $Token"
    }

    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri "$BaseUrl$Url" -Method GET -Headers $headers
            $statusCode = 200  # Assume success for GET if no exception
        }
        elseif ($Method -eq "POST") {
            $response = Invoke-RestMethod -Uri "$BaseUrl$Url" -Method POST -Headers $headers -Body $Data
            $statusCode = 200  # Assume success for POST if no exception
        }
        elseif ($Method -eq "PUT") {
            $response = Invoke-RestMethod -Uri "$BaseUrl$Url" -Method PUT -Headers $headers -Body $Data
            $statusCode = 200  # Assume success for PUT if no exception
        }
        elseif ($Method -eq "DELETE") {
            $response = Invoke-RestMethod -Uri "$BaseUrl$Url" -Method DELETE -Headers $headers
            $statusCode = 200  # Assume success for DELETE if no exception
        }

        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "✅ PASSED (Status: $statusCode)" -ForegroundColor Green
        }
        else {
            Write-Host "❌ FAILED (Expected: $ExpectedStatus, Got: $statusCode)" -ForegroundColor Red
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "✅ PASSED (Status: $statusCode)" -ForegroundColor Green
        }
        else {
            Write-Host "❌ FAILED (Expected: $ExpectedStatus, Got: $statusCode)" -ForegroundColor Red
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    Write-Host ""
}

Write-Host "1. Testing Authentication Endpoints" -ForegroundColor Magenta
Write-Host "-----------------------------------" -ForegroundColor Magenta

# Test user registration
Test-Endpoint -Method "POST" -Url "/auth/register" -Data '{
    "firstname": "Test",
    "lastname": "User",
    "email": "test@example.com",
    "password": "password123"
}' -ExpectedStatus "200" -Description "User Registration"

# Test user login
try {
    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method POST -Headers @{
        "Content-Type" = "application/json"
    } -Body '{
        "email": "test@example.com",
        "password": "password123"
    }'

    $Token = $loginResponse.token
    if ($Token) {
        Write-Host "✅ Login successful, token obtained" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Login failed, cannot proceed with authenticated tests" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2. Testing Appointment Endpoints" -ForegroundColor Magenta
Write-Host "---------------------------------" -ForegroundColor Magenta

# Test create appointment
Test-Endpoint -Method "POST" -Url "/appointments" -Data '{
    "appointmentType": "General Checkup",
    "symptoms": "Headache and fever",
    "preferredDate": "2026-05-15",
    "timeSlot": "10:00-11:00"
}' -ExpectedStatus "201" -Description "Create Appointment"

# Test get user appointments
Test-Endpoint -Method "GET" -Url "/appointments" -ExpectedStatus "200" -Description "Get User Appointments"

# Test get appointment by ID
Test-Endpoint -Method "GET" -Url "/appointments/1" -ExpectedStatus "200" -Description "Get Appointment by ID"

# Test update appointment
Test-Endpoint -Method "PUT" -Url "/appointments/1" -Data '{
    "appointmentType": "Specialist Consultation",
    "symptoms": "Persistent headache",
    "preferredDate": "2026-05-16",
    "timeSlot": "14:00-15:00"
}' -ExpectedStatus "200" -Description "Update Appointment"

Write-Host ""
Write-Host "3. Testing Dashboard Endpoints" -ForegroundColor Magenta
Write-Host "-------------------------------" -ForegroundColor Magenta

# Test get dashboard
Test-Endpoint -Method "GET" -Url "/dashboard" -ExpectedStatus "200" -Description "Get Dashboard Data"

Write-Host ""
Write-Host "4. Testing Profile Endpoints" -ForegroundColor Magenta
Write-Host "-----------------------------" -ForegroundColor Magenta

# Test get profile
Test-Endpoint -Method "GET" -Url "/profile" -ExpectedStatus "200" -Description "Get User Profile"

Write-Host ""
Write-Host "5. Testing Error Scenarios" -ForegroundColor Magenta
Write-Host "---------------------------" -ForegroundColor Magenta

# Test invalid login
Test-Endpoint -Method "POST" -Url "/auth/login" -Data '{
    "email": "nonexistent@example.com",
    "password": "wrongpassword"
}' -ExpectedStatus "401" -Description "Invalid Login"

# Test unauthorized access (without token)
$TokenBackup = $Token
$Token = ""
Test-Endpoint -Method "GET" -Url "/appointments" -ExpectedStatus "401" -Description "Unauthorized Access to Appointments"
$Token = $TokenBackup

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "API Regression Testing Complete" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan