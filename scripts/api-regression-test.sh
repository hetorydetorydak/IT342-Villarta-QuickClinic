#!/bin/bash

# QuickClinic API Test Script
# This script tests all API endpoints for the QuickClinic system

BASE_URL="http://localhost:8080"
TOKEN=""

echo "=========================================="
echo "QuickClinic API Regression Test Script"
echo "=========================================="
echo ""

# Function to make API calls and check response
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local expected_status=$4
    local description=$5

    echo "Testing: $description"
    echo "Method: $method $url"

    if [ "$method" = "GET" ]; then
        if [ -n "$TOKEN" ]; then
            response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X GET "$BASE_URL$url" \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json")
        else
            response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X GET "$BASE_URL$url" \
                -H "Content-Type: application/json")
        fi
    elif [ "$method" = "POST" ]; then
        if [ -n "$TOKEN" ]; then
            response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X POST "$BASE_URL$url" \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                -d "$data")
        else
            response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X POST "$BASE_URL$url" \
                -H "Content-Type: application/json" \
                -d "$data")
        fi
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X PUT "$BASE_URL$url" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X DELETE "$BASE_URL$url" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json")
    fi

    # Extract HTTP status code
    http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    response_body=$(echo "$response" | sed -e 's/HTTPSTATUS.*//g')

    if [ "$http_code" = "$expected_status" ]; then
        echo "✅ PASSED (Status: $http_code)"
    else
        echo "❌ FAILED (Expected: $expected_status, Got: $http_code)"
        echo "Response: $response_body"
    fi
    echo ""
}

echo "1. Testing Authentication Endpoints"
echo "-----------------------------------"

# Test user registration
test_endpoint "POST" "/auth/register" '{
    "firstname": "Test",
    "lastname": "User",
    "email": "test@example.com",
    "password": "password123"
}' "200" "User Registration"

# Test user login
login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test@example.com",
        "password": "password123"
    }')

# Extract token from login response
TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✅ Login successful, token obtained"
else
    echo "❌ Login failed, cannot proceed with authenticated tests"
    exit 1
fi

echo ""
echo "2. Testing Appointment Endpoints"
echo "---------------------------------"

# Test create appointment
test_endpoint "POST" "/appointments" '{
    "appointmentType": "General Checkup",
    "symptoms": "Headache and fever",
    "preferredDate": "2026-05-15",
    "timeSlot": "10:00-11:00"
}' "201" "Create Appointment"

# Test get user appointments
test_endpoint "GET" "/appointments" "" "200" "Get User Appointments"

# Test get appointment by ID (assuming ID 1)
test_endpoint "GET" "/appointments/1" "" "200" "Get Appointment by ID"

# Test update appointment
test_endpoint "PUT" "/appointments/1" '{
    "appointmentType": "Specialist Consultation",
    "symptoms": "Persistent headache",
    "preferredDate": "2026-05-16",
    "timeSlot": "14:00-15:00"
}' "200" "Update Appointment"

echo ""
echo "3. Testing Dashboard Endpoints"
echo "-------------------------------"

# Test get dashboard
test_endpoint "GET" "/dashboard" "" "200" "Get Dashboard Data"

echo ""
echo "4. Testing Profile Endpoints"
echo "-----------------------------"

# Test get profile
test_endpoint "GET" "/profile" "" "200" "Get User Profile"

echo ""
echo "5. Testing Error Scenarios"
echo "---------------------------"

# Test invalid login
test_endpoint "POST" "/auth/login" '{
    "email": "nonexistent@example.com",
    "password": "wrongpassword"
}' "401" "Invalid Login"

# Test unauthorized access (without token)
TOKEN_BACKUP=$TOKEN
TOKEN=""
test_endpoint "GET" "/appointments" "" "401" "Unauthorized Access to Appointments"
TOKEN=$TOKEN_BACKUP

echo "=========================================="
echo "API Regression Testing Complete"
echo "=========================================="