# Vertical Slice Refactoring Guide — QuickClinic
### IT342 | Backend + Frontend (No Mobile)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Part 1 — Branch Setup](#part-1--branch-setup)
4. [Part 2 — Backend Refactoring](#part-2--backend-refactoring)
5. [Part 3 — Frontend Refactoring](#part-3--frontend-refactoring)
6. [Part 4 — Verification Checklist](#part-4--verification-checklist)
7. [Final Directory Structure](#final-directory-structure)

---

## Overview

**Vertical Slice Architecture** organizes code by **feature** rather than by **technical layer**.

| Before (Layer-based) | After (Vertical Slice) |
|---|---|
| `controller/`, `service/`, `repository/`, `model/` | `features/auth/`, `features/appointment/`, etc. |
| All pages flat in `pages/` | Each feature owns its page + API call |
| Shared and feature code mixed together | Explicit `shared/` for cross-cutting concerns |

**Features identified in QuickClinic:**
- `auth` — Login, Register
- `appointment` — Book, History
- `profile` — View/Edit Profile
- `dashboard` — Dashboard, Student Dashboard

---

## Prerequisites

Before starting:

- All pending features are merged into `main`
- `main` branch is stable and builds without errors
- You have Git installed and configured
- Backend runs via `./mvnw spring-boot:run`
- Frontend runs via `npm start`

---

## Part 1 — Branch Setup

Create a dedicated branch for this refactoring work.

```bash
# Make sure you're on main and it's up to date
git checkout main
git pull origin main

# Create and switch to the refactor branch
git checkout -b refactor/vertical-slice-architecture

# Verify you're on the new branch
git branch
```

> **Tip:** Commit frequently as you go. A clean commit history (one per feature slice) makes regression testing easier to trace.

---

## Part 2 — Backend Refactoring

### Step 1 — Create the new folder structure

Inside `backend/src/main/java/edu/cit/villarta/quickclinic/`, create the following folders:

```
features/
├── auth/
├── appointment/
├── profile/
└── dashboard/
shared/
└── config/
```

You can do this via your IDE or terminal:

```bash
cd backend/src/main/java/edu/cit/villarta/quickclinic

mkdir -p features/auth
mkdir -p features/appointment
mkdir -p features/profile
mkdir -p features/dashboard
mkdir -p shared/config
```

---

### Step 2 — Move files into feature slices

Move each existing class into its corresponding feature folder. The table below maps old locations to new ones:

#### Auth Feature

| Old Location | New Location | Notes |
|---|---|---|
| `controller/AuthController.java` | `features/auth/AuthController.java` | |
| `service/AuthService.java` | `features/auth/AuthService.java` | |
| `repository/UserRepository.java` | `features/auth/AuthRepository.java` | Rename if needed |
| `model/User.java` | `features/auth/User.java` | |

#### Appointment Feature

| Old Location | New Location | Notes |
|---|---|---|
| `controller/AppointmentController.java` | `features/appointment/AppointmentController.java` | |
| `service/AppointmentService.java` | `features/appointment/AppointmentService.java` | |
| `repository/AppointmentRepository.java` | `features/appointment/AppointmentRepository.java` | |
| `model/Appointment.java` | `features/appointment/Appointment.java` | |

#### Profile Feature

| Old Location | New Location | Notes |
|---|---|---|
| `controller/ProfileController.java` | `features/profile/ProfileController.java` | |
| `service/ProfileService.java` | `features/profile/ProfileService.java` | |
| `repository/ProfileRepository.java` | `features/profile/ProfileRepository.java` | |
| `model/Profile.java` | `features/profile/Profile.java` | |

#### Dashboard Feature

| Old Location | New Location | Notes |
|---|---|---|
| `controller/DashboardController.java` | `features/dashboard/DashboardController.java` | |
| `service/DashboardService.java` | `features/dashboard/DashboardService.java` | |

#### Shared Config

| Old Location | New Location |
|---|---|
| `config/SecurityConfig.java` | `shared/config/SecurityConfig.java` |
| `config/CorsConfig.java` | `shared/config/CorsConfig.java` |
| *(any other config files)* | `shared/config/` |

---

### Step 3 — Update package declarations

After moving files, **every Java file needs its package declaration updated** to match its new location.

**Pattern:**

```java
// OLD
package edu.cit.villarta.quickclinic.controller;

// NEW (example for auth)
package edu.cit.villarta.quickclinic.features.auth;
```

Apply this to **every moved file**. Examples per feature:

```java
// features/auth/AuthController.java
package edu.cit.villarta.quickclinic.features.auth;

// features/appointment/AppointmentController.java
package edu.cit.villarta.quickclinic.features.appointment;

// features/profile/ProfileController.java
package edu.cit.villarta.quickclinic.features.profile;

// features/dashboard/DashboardController.java
package edu.cit.villarta.quickclinic.features.dashboard;

// shared/config/SecurityConfig.java
package edu.cit.villarta.quickclinic.shared.config;
```

---

### Step 4 — Update import statements

Any file that references a class from another feature or from the old layer packages must update its imports.

**Example — AppointmentController importing User model:**

```java
// OLD
import edu.cit.villarta.quickclinic.model.User;
import edu.cit.villarta.quickclinic.service.AppointmentService;

// NEW
import edu.cit.villarta.quickclinic.features.auth.User;
import edu.cit.villarta.quickclinic.features.appointment.AppointmentService;
```

> **Tip:** Use your IDE's **Find & Replace** (Ctrl+Shift+R in IntelliJ) across the project to bulk-replace old package paths. Replace `edu.cit.villarta.quickclinic.controller` → `edu.cit.villarta.quickclinic.features` etc.

---

### Step 5 — Delete old empty folders

Once all files are moved and confirmed working, delete the now-empty layer folders:

```bash
cd backend/src/main/java/edu/cit/villarta/quickclinic

rm -r controller
rm -r service
rm -r repository
rm -r model
rm -r config
```

---

### Step 6 — Build and verify backend

```bash
cd backend
./mvnw clean install
```

Expected output: `BUILD SUCCESS`

If there are errors, they are almost always one of:
- Missing package declaration update
- Missed import statement
- A class referenced by a config file still pointing to the old path

Fix each error, then re-run until clean.

---

### Step 7 — Move backend tests into slices

Reorganize `src/test/` to mirror the feature structure:

```
test/java/edu/cit/villarta/quickclinic/
├── features/
│   ├── auth/
│   │   └── AuthControllerTest.java
│   ├── appointment/
│   │   └── AppointmentControllerTest.java
│   ├── profile/
│   │   └── ProfileControllerTest.java
│   └── dashboard/
│       └── DashboardControllerTest.java
└── QuickclinicApplicationTests.java
```

Update the package declarations in test files the same way as main files:

```java
// OLD
package edu.cit.villarta.quickclinic;

// NEW
package edu.cit.villarta.quickclinic.features.auth;
```

Run tests to confirm nothing is broken:

```bash
./mvnw test
```

---

### Step 8 — Commit backend changes

```bash
git add .
git commit -m "refactor(backend): apply vertical slice architecture by feature"
```

---

## Part 3 — Frontend Refactoring

### Step 1 — Create the new folder structure

Inside `frontend/src/`, create:

```
features/
├── auth/
├── appointment/
├── profile/
└── dashboard/
shared/
├── components/
├── styles/
└── utils/
```

```bash
cd frontend/src

mkdir -p features/auth
mkdir -p features/appointment
mkdir -p features/profile
mkdir -p features/dashboard
mkdir -p shared/components
mkdir -p shared/styles
mkdir -p shared/utils
```

---

### Step 2 — Move pages into feature slices

#### Auth Feature

| Old Location | New Location |
|---|---|
| `pages/Login.js` | `features/auth/Login.js` |
| `pages/Register.js` | `features/auth/Register.js` |

Also create a dedicated API file for auth inside its slice:

**`features/auth/authApi.js`** — extract auth-related API calls from `services/api.js`:

```javascript
// features/auth/authApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const login = (credentials) =>
  axios.post(`${BASE_URL}/api/auth/login`, credentials);

export const register = (userData) =>
  axios.post(`${BASE_URL}/api/auth/register`, userData);
```

---

#### Appointment Feature

| Old Location | New Location |
|---|---|
| `pages/BookAppointment.js` | `features/appointment/BookAppointment.js` |
| `pages/AppointmentHistory.js` | `features/appointment/AppointmentHistory.js` |

Create **`features/appointment/appointmentApi.js`**:

```javascript
// features/appointment/appointmentApi.js
import axios from 'axios';
import { getToken } from '../../shared/utils/token';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const bookAppointment = (data) =>
  axios.post(`${BASE_URL}/api/appointments`, data, { headers: authHeader() });

export const getAppointmentHistory = () =>
  axios.get(`${BASE_URL}/api/appointments`, { headers: authHeader() });
```

---

#### Profile Feature

| Old Location | New Location |
|---|---|
| `pages/Profile.js` | `features/profile/Profile.js` |

Create **`features/profile/profileApi.js`**:

```javascript
// features/profile/profileApi.js
import axios from 'axios';
import { getToken } from '../../shared/utils/token';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const getProfile = () =>
  axios.get(`${BASE_URL}/api/profile`, { headers: authHeader() });

export const updateProfile = (data) =>
  axios.put(`${BASE_URL}/api/profile`, data, { headers: authHeader() });
```

---

#### Dashboard Feature

| Old Location | New Location |
|---|---|
| `pages/Dashboard.js` | `features/dashboard/Dashboard.js` |
| `pages/StudentDashboard.js` | `features/dashboard/StudentDashboard.js` |

Create **`features/dashboard/dashboardApi.js`**:

```javascript
// features/dashboard/dashboardApi.js
import axios from 'axios';
import { getToken } from '../../shared/utils/token';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const getDashboardData = () =>
  axios.get(`${BASE_URL}/api/dashboard`, { headers: authHeader() });
```

---

### Step 3 — Move shared files

| Old Location | New Location |
|---|---|
| `components/Button.js` | `shared/components/Button.js` |
| `components/Input.js` | `shared/components/Input.js` |
| `components/Layout.js` | `shared/components/Layout.js` |
| `components/PrivateRoute.js` | `shared/components/PrivateRoute.js` |
| `styles/GlobalStyles.js` | `shared/styles/GlobalStyles.js` |
| `utils/token.js` | `shared/utils/token.js` |

---

### Step 4 — Update import paths in all files

Every file that previously imported from `../pages/`, `../components/`, `../services/api`, or `../utils/` needs its paths updated.

**In `App.js`**, update all page imports:

```javascript
// OLD
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import BookAppointment from './pages/BookAppointment';
import AppointmentHistory from './pages/AppointmentHistory';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

// NEW
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';
import StudentDashboard from './features/dashboard/StudentDashboard';
import BookAppointment from './features/appointment/BookAppointment';
import AppointmentHistory from './features/appointment/AppointmentHistory';
import Profile from './features/profile/Profile';
import PrivateRoute from './shared/components/PrivateRoute';
```

**In `index.js`**, update GlobalStyles import:

```javascript
// OLD
import GlobalStyles from './styles/GlobalStyles';

// NEW
import GlobalStyles from './shared/styles/GlobalStyles';
```

**Inside each feature page**, update their internal imports:

```javascript
// Example: features/auth/Login.js

// OLD
import Button from '../components/Button';
import Input from '../components/Input';
import { login } from '../services/api';
import { saveToken } from '../utils/token';

// NEW
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { login } from './authApi';
import { saveToken } from '../../shared/utils/token';
```

> **Rule of thumb for relative paths:**
> - From inside a feature (`features/auth/Login.js`) to shared → `../../shared/...`
> - From inside a feature to its own slice's API → `./authApi`

---

### Step 5 — Delete old empty folders

Once all files are confirmed moved and imports updated:

```bash
cd frontend/src
rm -r pages
rm -r components
rm -r services
rm -r styles
rm -r utils
```

---

### Step 6 — Run and verify frontend

```bash
cd frontend
npm start
```

Open `http://localhost:3000` and manually verify:
- Login page loads
- Register page loads
- Dashboard loads after login
- Book Appointment works
- Appointment History displays
- Profile page loads

Fix any broken import errors shown in the browser console before proceeding.

---

### Step 7 — Commit frontend changes

```bash
git add .
git commit -m "refactor(frontend): apply vertical slice architecture by feature"
```

---

## Part 4 — Verification Checklist

Run through this checklist before pushing your branch:

### Backend
- [ ] `./mvnw clean install` completes with `BUILD SUCCESS`
- [ ] `./mvnw test` — all tests pass
- [ ] All old layer folders (`controller/`, `service/`, `repository/`, `model/`, `config/`) are deleted
- [ ] Every Java file has an updated package declaration
- [ ] All cross-feature imports are resolved

### Frontend
- [ ] `npm start` — app runs without console errors
- [ ] All pages load and function correctly
- [ ] All old folders (`pages/`, `components/`, `services/`, `styles/`, `utils/`) are deleted
- [ ] No broken import paths remain

### Git
- [ ] All changes committed to `refactor/vertical-slice-architecture` branch
- [ ] Branch is pushed to GitHub: `git push origin refactor/vertical-slice-architecture`

---

## Final Directory Structure

```
IT342-Villarta-QuickClinic/
├── backend/
│   └── src/
│       ├── main/java/edu/cit/villarta/quickclinic/
│       │   ├── QuickclinicApplication.java
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── AuthService.java
│       │   │   │   ├── AuthRepository.java
│       │   │   │   └── User.java
│       │   │   ├── appointment/
│       │   │   │   ├── AppointmentController.java
│       │   │   │   ├── AppointmentService.java
│       │   │   │   ├── AppointmentRepository.java
│       │   │   │   └── Appointment.java
│       │   │   ├── profile/
│       │   │   │   ├── ProfileController.java
│       │   │   │   ├── ProfileService.java
│       │   │   │   ├── ProfileRepository.java
│       │   │   │   └── Profile.java
│       │   │   └── dashboard/
│       │   │       ├── DashboardController.java
│       │   │       └── DashboardService.java
│       │   └── shared/
│       │       └── config/
│       │           └── SecurityConfig.java
│       └── test/java/edu/cit/villarta/quickclinic/
│           ├── features/
│           │   ├── auth/AuthControllerTest.java
│           │   ├── appointment/AppointmentControllerTest.java
│           │   ├── profile/ProfileControllerTest.java
│           │   └── dashboard/DashboardControllerTest.java
│           └── QuickclinicApplicationTests.java
│
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

---

*QuickClinic — IT342 Vertical Slice Refactoring Guide*
