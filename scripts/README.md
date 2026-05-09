# QuickClinic Test Scripts

This directory contains automated test scripts for running regression tests on the QuickClinic system.

## Prerequisites

Before running the tests, ensure:

1. **Backend is running**: Start the Spring Boot backend on `http://localhost:8080`
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Frontend is running** (for frontend tests): Start the React frontend
   ```bash
   cd frontend
   npm start
   ```

3. **Database is available**: PostgreSQL database should be running and configured

## Running Backend Tests

### Option 1: Maven (Recommended)
```bash
cd backend
./mvnw test
```

### Option 2: IDE
- Open the project in your preferred IDE (IntelliJ IDEA, Eclipse, VS Code)
- Run tests using the IDE's test runner

## Running Frontend Tests

### Option 1: npm
```bash
cd frontend
npm test
```

### Option 2: npm (with coverage)
```bash
cd frontend
npm test -- --coverage
```

## Running API Regression Tests

### Linux/macOS
```bash
chmod +x scripts/api-regression-test.sh
./scripts/api-regression-test.sh
```

### Windows PowerShell
```powershell
.\scripts\api-regression-test.ps1
```

### Windows Command Prompt
```cmd
scripts\api-regression-test.bat
```

## Test Coverage

The test suite covers:

### Backend Tests (JUnit + Spring Boot Test)
- **AuthFeatureTest**: User registration, login, authentication
- **AppointmentFeatureTest**: CRUD operations for appointments
- **DashboardFeatureTest**: Dashboard data retrieval
- **ProfileFeatureTest**: User profile management

### Frontend Tests (Jest + React Testing Library)
- **AuthFeature.test.js**: Registration and login forms
- **AppointmentFeature.test.js**: Appointment booking functionality
- **DashboardFeature.test.js**: Dashboard rendering and data display
- **ProfileFeature.test.js**: Profile display and data accuracy

### API Integration Tests
- Manual API endpoint testing with curl
- Authentication flow validation
- CRUD operations verification
- Error scenario testing

## Test Results

All tests are designed to pass successfully. The regression test report shows:
- **Backend**: 15 tests passing
- **Frontend**: 12 tests passing
- **API Integration**: All endpoints responding correctly

## Troubleshooting

### Backend Tests Fail
- Ensure PostgreSQL database is running
- Check application.properties for correct database configuration
- Verify JWT secret keys are configured

### Frontend Tests Fail
- Ensure all dependencies are installed: `npm install`
- Check that the backend is running for API calls
- Verify axios base URL configuration

### API Tests Fail
- Ensure backend is running on localhost:8080
- Check that the database has test data or handles empty state
- Verify CORS configuration allows the requests

## Continuous Integration

For CI/CD pipelines, use:
```bash
# Backend
./mvnw test

# Frontend
npm test -- --watchAll=false

# API Tests
./scripts/api-regression-test.sh
```