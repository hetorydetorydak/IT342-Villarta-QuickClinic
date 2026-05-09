# IT342 QuickClinic - Directory Structure (Vertical Slice Architecture)

```
IT342-Villarta-QuickClinic/
├── Copilot_Mobile_Fragments.md
├── DirectoryStructure.md
├── README.md
├── backend/
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── src/
│   │   ├── main/java/edu/cit/villarta/quickclinic/
│   │   │   ├── QuickclinicApplication.java
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   └── User.java
│   │   │   │   ├── appointment/
│   │   │   │   │   ├── AppointmentController.java
│   │   │   │   │   ├── AppointmentService.java
│   │   │   │   │   ├── AppointmentRepository.java
│   │   │   │   │   └── Appointment.java
│   │   │   │   ├── profile/
│   │   │   │   │   ├── ProfileController.java
│   │   │   │   │   ├── ProfileService.java
│   │   │   │   │   └── Profile.java (placeholder)
│   │   │   │   └── dashboard/
│   │   │   │       ├── DashboardController.java
│   │   │   │       ├── DashboardService.java
│   │   │   │       └── Dashboard.java (placeholder)
│   │   │   └── shared/
│   │   │       ├── config/
│   │   │       │   └── SecurityConfig.java
│   │   │       ├── dto/
│   │   │       │   ├── ApiResponse.java
│   │   │       │   ├── AppointmentRequest.java
│   │   │       │   ├── AppointmentResponse.java
│   │   │       │   ├── AuthResponse.java
│   │   │       │   ├── LoginRequest.java
│   │   │       │   ├── RegisterRequest.java
│   │   │       │   └── UserResponse.java
│   │   │       └── security/
│   │   │           ├── JwtAuthenticationFilter.java
│   │   │           └── JwtProvider.java
│   │   └── test/java/edu/cit/villarta/quickclinic/
│   │       ├── features/
│   │       │   ├── auth/
│   │       │   ├── appointment/
│   │       │   ├── profile/
│   │       │   └── dashboard/
│   │       └── QuickclinicApplicationTests.java
│   └── target/
│       └── ... (build artifacts)
└── frontend/
    └── src/
        ├── App.js
        ├── index.js
        ├── features/
        │   ├── auth/
        │   │   ├── Login.js
        │   │   ├── Register.js
        │   │   └── authApi.js
        │   ├── appointment/
        │   │   ├── BookAppointment.js
        │   │   ├── AppointmentHistory.js
        │   │   └── appointmentApi.js
        │   ├── profile/
        │   │   ├── Profile.js
        │   │   └── profileApi.js
        │   └── dashboard/
        │       ├── Dashboard.js
        │       ├── StudentDashboard.js
        │       └── dashboardApi.js
        └── shared/
            ├── components/
            │   ├── Button.js
            │   ├── Input.js
            │   ├── Layout.js
            │   └── PrivateRoute.js
            ├── styles/
            │   └── GlobalStyles.js
            └── utils/
                └── token.js
```

## Project Overview

This project is divided into three main sections:

### **Backend** (Java Spring Boot) - Vertical Slice Architecture
- **Features-based organization** instead of layer-based
- Each feature (`auth`, `appointment`, `profile`, `dashboard`) owns its complete implementation
- **Shared components** (`config`, `dto`, `security`) for cross-cutting concerns
- REST API built with Spring Boot
- Maven project structure
- Database integration and services

### **Frontend** (React.js) - Vertical Slice Architecture
- **Features-based organization** with each feature containing its pages and API calls
- **Shared components** (`components`, `styles`, `utils`) for reusable UI elements
- React-based web application
- Components for UI (Button, Input, Layout)
- Pages organized by feature (Login/Register in `auth`, BookAppointment/AppointmentHistory in `appointment`, etc.)
- API integration through feature-specific API files

### **Mobile** (Android)
- Android native application
- Gradle-based build system
- Located in `/mobile`

## Architecture Benefits

### Vertical Slice Architecture
- **Feature cohesion**: Related code is grouped together
- **Easier maintenance**: Changes to a feature are localized
- **Better scalability**: New features can be added without affecting existing ones
- **Clearer dependencies**: Each feature's dependencies are explicit
- **Improved testability**: Features can be tested in isolation

### Before vs After

| Aspect | Before (Layer-based) | After (Vertical Slice) |
|---|---|---|
| **Organization** | `controller/`, `service/`, `repository/`, `model/` | `features/auth/`, `features/appointment/`, etc. |
| **Page location** | All pages flat in `pages/` | Each feature owns its page + API call |
| **Shared code** | Mixed with feature code | Explicit `shared/` for cross-cutting concerns |
| **API calls** | Centralized in `services/api.js` | Distributed in feature-specific API files |
| **Maintenance** | Cross-cutting changes affect multiple layers | Feature changes are contained within the slice |