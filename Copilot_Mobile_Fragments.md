# QuickClinic – Mobile Development Copilot (Fragment Version)
**Phase 2: Mobile Application (Android)**
**Course:** IT342-G11 System Integration and Architecture
**Prepared by:** Villarta, John Hector P.
**SDD Version:** 0.2 | **Date:** 2/28/2026

---

## Overview

This is the **Fragment-based** implementation of Phase 2. Instead of one Activity per screen, a single `MainActivity` hosts all screens as Fragments. Navigation between screens uses the **Android Navigation Component** with a `NavHostFragment`.

**Architecture at a glance:**
```
MainActivity (host)
 └── NavHostFragment
      ├── LoginFragment
      ├── RegisterFragment
      └── HomeFragment
```

The backend integration (Retrofit, models, ApiClient) is identical to the Activity version.

---

## Project Structure

```
mobile/
  app/
    src/
      main/
        java/edu/cit/villarta/quickclinic/
          activity/
            MainActivity.kt
          fragment/
            LoginFragment.kt
            RegisterFragment.kt
            HomeFragment.kt
          api/
            ApiClient.kt
            ApiService.kt
          model/
            RegisterRequest.kt
            LoginRequest.kt
            AuthResponse.kt
            UserResponse.kt
        res/
          layout/
            activity_main.xml
            fragment_login.xml
            fragment_register.xml
            fragment_home.xml
          navigation/
            nav_graph.xml
```

---

## Backend Reference (Phase 1)

Same as the Activity version — no changes to the backend.

| Action | Method | Endpoint | Auth |
|---|---|---|---|
| Register | `POST` | `/auth/register` | None |
| Login | `POST` | `/auth/login` | None |

**Base URL (emulator):** `http://10.0.2.2:8080/`
**Base URL (deployed):** `https://<your-railway-backend-url>/`

---

## Step 1 — Gradle Dependencies

Add to `build.gradle` (app-level):

```gradle
dependencies {
    // Navigation Component
    implementation 'androidx.navigation:navigation-fragment-ktx:2.7.7'
    implementation 'androidx.navigation:navigation-ui-ktx:2.7.7'

    // Retrofit
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'

    // OkHttp logging
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'

    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'

    // ViewModel + LiveData
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
    implementation 'androidx.lifecycle:lifecycle-livedata-ktx:2.7.0'
    implementation 'androidx.fragment:fragment-ktx:1.6.2'
}
```

`AndroidManifest.xml` — add internet permission:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

---

## Step 2 — Data Models

Identical to the Activity version. Place these in `model/`.

### `RegisterRequest.kt`
```kotlin
data class RegisterRequest(
    val firstname: String,
    val lastname: String,
    val email: String,
    val password: String,
    val role: String = "STUDENT"
)
```

### `LoginRequest.kt`
```kotlin
data class LoginRequest(
    val email: String,
    val password: String
)
```

### `UserResponse.kt`
```kotlin
data class UserResponse(
    val id: Long,
    val firstname: String,
    val lastname: String,
    val email: String,
    val role: String,
    val createdAt: String
)
```

### `AuthResponse.kt`
```kotlin
data class AuthResponse(
    val user: UserResponse,
    val accessToken: String,
    val refreshToken: String?
)
```

---

## Step 3 — Retrofit API Setup

### `ApiService.kt`
```kotlin
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<UserResponse>

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
}
```

### `ApiClient.kt`
```kotlin
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {

    private const val BASE_URL = "https://<your-railway-backend-url>/"
    // For emulator local testing use: "http://10.0.2.2:8080/"

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val httpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .build()

    val apiService: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(httpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
```

---

## Step 4 — Navigation Graph

Create `res/navigation/nav_graph.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/nav_graph"
    app:startDestination="@id/loginFragment">

    <!-- Login Screen -->
    <fragment
        android:id="@+id/loginFragment"
        android:name="edu.cit.villarta.quickclinic.fragment.LoginFragment"
        android:label="Login">

        <action
            android:id="@+id/action_login_to_register"
            app:destination="@id/registerFragment"
            app:popUpTo="@id/loginFragment"
            app:popUpToInclusive="false" />

        <action
            android:id="@+id/action_login_to_home"
            app:destination="@id/homeFragment"
            app:popUpTo="@id/loginFragment"
            app:popUpToInclusive="true" />
    </fragment>

    <!-- Register Screen -->
    <fragment
        android:id="@+id/registerFragment"
        android:name="edu.cit.villarta.quickclinic.fragment.RegisterFragment"
        android:label="Register">

        <action
            android:id="@+id/action_register_to_login"
            app:destination="@id/loginFragment"
            app:popUpTo="@id/loginFragment"
            app:popUpToInclusive="true" />
    </fragment>

    <!-- Home Screen -->
    <fragment
        android:id="@+id/homeFragment"
        android:name="edu.cit.villarta.quickclinic.fragment.HomeFragment"
        android:label="Home">

        <!-- Arguments passed from LoginFragment -->
        <argument
            android:name="firstname"
            app:argType="string"
            android:defaultValue="" />
        <argument
            android:name="role"
            app:argType="string"
            android:defaultValue="" />
    </fragment>

</navigation>
```

**Navigation flow:**
```
LoginFragment ──────────────────────────► HomeFragment
     │                                   (popUpTo login, inclusive)
     └──► RegisterFragment
               │
               └──► LoginFragment (back, popUpTo login)
```

---

## Step 5 — XML Layouts

### `activity_main.xml`

The single host layout — contains only the `NavHostFragment`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.fragment.app.FragmentContainerView
        android:id="@+id/nav_host_fragment"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:defaultNavHost="true"
        app:navGraph="@navigation/nav_graph" />

</FrameLayout>
```

### `fragment_register.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="24dp"
    android:background="#FFFFFF">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:gravity="center">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="QuickClinic"
            android:textSize="28sp"
            android:textStyle="bold"
            android:textColor="#1565C0"
            android:layout_marginBottom="4dp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Create your account"
            android:textSize="14sp"
            android:textColor="#757575"
            android:layout_marginBottom="32dp" />

        <EditText
            android:id="@+id/etFirstname"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="First Name"
            android:inputType="textPersonName"
            android:layout_marginBottom="12dp" />

        <EditText
            android:id="@+id/etLastname"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Last Name"
            android:inputType="textPersonName"
            android:layout_marginBottom="12dp" />

        <EditText
            android:id="@+id/etEmail"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Email"
            android:inputType="textEmailAddress"
            android:layout_marginBottom="12dp" />

        <EditText
            android:id="@+id/etPassword"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Password"
            android:inputType="textPassword"
            android:layout_marginBottom="24dp" />

        <TextView
            android:id="@+id/tvError"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:textColor="#D32F2F"
            android:textSize="13sp"
            android:visibility="gone"
            android:layout_marginBottom="8dp" />

        <Button
            android:id="@+id/btnRegister"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Register"
            android:backgroundTint="#1565C0"
            android:layout_marginBottom="12dp" />

        <TextView
            android:id="@+id/tvGoToLogin"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Already have an account? Login"
            android:textColor="#1565C0"
            android:padding="8dp" />

    </LinearLayout>
</ScrollView>
```

### `fragment_login.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:padding="24dp"
    android:background="#FFFFFF">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="QuickClinic"
        android:textSize="28sp"
        android:textStyle="bold"
        android:textColor="#1565C0"
        android:layout_marginBottom="4dp" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome Back"
        android:textSize="14sp"
        android:textColor="#757575"
        android:layout_marginBottom="32dp" />

    <EditText
        android:id="@+id/etEmail"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Email"
        android:inputType="textEmailAddress"
        android:layout_marginBottom="12dp" />

    <EditText
        android:id="@+id/etPassword"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Password"
        android:inputType="textPassword"
        android:layout_marginBottom="24dp" />

    <TextView
        android:id="@+id/tvError"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textColor="#D32F2F"
        android:textSize="13sp"
        android:visibility="gone"
        android:layout_marginBottom="8dp" />

    <Button
        android:id="@+id/btnLogin"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Sign In"
        android:backgroundTint="#1565C0"
        android:layout_marginBottom="12dp" />

    <TextView
        android:id="@+id/tvGoToRegister"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Don't have an account? Register"
        android:textColor="#1565C0"
        android:padding="8dp" />

</LinearLayout>
```

### `fragment_home.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:padding="24dp"
    android:background="#FFFFFF">

    <TextView
        android:id="@+id/tvWelcome"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome!"
        android:textSize="24sp"
        android:textStyle="bold"
        android:textColor="#1565C0"
        android:layout_marginBottom="8dp" />

    <TextView
        android:id="@+id/tvRole"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="14sp"
        android:textColor="#757575" />

</LinearLayout>
```

---

## Step 6 — MainActivity

The host Activity. It does nothing except hold the `NavHostFragment`:

```kotlin
package edu.cit.villarta.quickclinic.activity

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import edu.cit.villarta.quickclinic.R

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        // NavHostFragment handles all navigation from here
    }
}
```

---

## Step 7 — Fragments

### `RegisterFragment.kt`
```kotlin
package edu.cit.villarta.quickclinic.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import edu.cit.villarta.quickclinic.R
import edu.cit.villarta.quickclinic.api.ApiClient
import edu.cit.villarta.quickclinic.model.RegisterRequest
import kotlinx.coroutines.launch

class RegisterFragment : Fragment() {

    private lateinit var etFirstname: EditText
    private lateinit var etLastname: EditText
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnRegister: Button
    private lateinit var tvError: TextView
    private lateinit var tvGoToLogin: TextView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.fragment_register, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        etFirstname = view.findViewById(R.id.etFirstname)
        etLastname  = view.findViewById(R.id.etLastname)
        etEmail     = view.findViewById(R.id.etEmail)
        etPassword  = view.findViewById(R.id.etPassword)
        btnRegister = view.findViewById(R.id.btnRegister)
        tvError     = view.findViewById(R.id.tvError)
        tvGoToLogin = view.findViewById(R.id.tvGoToLogin)

        btnRegister.setOnClickListener { attemptRegister() }

        // Navigate back to Login
        tvGoToLogin.setOnClickListener {
            findNavController().navigate(R.id.action_register_to_login)
        }
    }

    private fun attemptRegister() {
        val firstname = etFirstname.text.toString().trim()
        val lastname  = etLastname.text.toString().trim()
        val email     = etEmail.text.toString().trim()
        val password  = etPassword.text.toString().trim()

        if (firstname.isEmpty() || lastname.isEmpty() || email.isEmpty() || password.isEmpty()) {
            showError("All fields are required.")
            return
        }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            showError("Please enter a valid email address.")
            return
        }
        if (password.length < 8) {
            showError("Password must be at least 8 characters.")
            return
        }

        hideError()
        btnRegister.isEnabled = false

        val request = RegisterRequest(
            firstname = firstname,
            lastname  = lastname,
            email     = email,
            password  = password,
            role      = "STUDENT"
        )

        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val response = ApiClient.apiService.register(request)
                if (response.isSuccessful) {
                    Toast.makeText(
                        requireContext(),
                        "Registration successful! Please log in.",
                        Toast.LENGTH_LONG
                    ).show()
                    // Navigate back to Login and clear Register from back stack
                    findNavController().navigate(R.id.action_register_to_login)
                } else {
                    val errorBody = response.errorBody()?.string()
                    showError(parseError(errorBody) ?: "Registration failed. Try again.")
                }
            } catch (e: Exception) {
                showError("Network error: ${e.localizedMessage}")
            } finally {
                btnRegister.isEnabled = true
            }
        }
    }

    private fun showError(message: String) {
        tvError.text = message
        tvError.visibility = View.VISIBLE
    }

    private fun hideError() {
        tvError.visibility = View.GONE
    }

    private fun parseError(body: String?): String? {
        if (body == null) return null
        return try {
            val json = org.json.JSONObject(body)
            json.optString("message").ifEmpty { null }
        } catch (e: Exception) {
            null
        }
    }
}
```

### `LoginFragment.kt`
```kotlin
package edu.cit.villarta.quickclinic.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import edu.cit.villarta.quickclinic.R
import edu.cit.villarta.quickclinic.api.ApiClient
import edu.cit.villarta.quickclinic.model.LoginRequest
import kotlinx.coroutines.launch

class LoginFragment : Fragment() {

    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnLogin: Button
    private lateinit var tvError: TextView
    private lateinit var tvGoToRegister: TextView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.fragment_login, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        etEmail        = view.findViewById(R.id.etEmail)
        etPassword     = view.findViewById(R.id.etPassword)
        btnLogin       = view.findViewById(R.id.btnLogin)
        tvError        = view.findViewById(R.id.tvError)
        tvGoToRegister = view.findViewById(R.id.tvGoToRegister)

        btnLogin.setOnClickListener { attemptLogin() }

        tvGoToRegister.setOnClickListener {
            findNavController().navigate(R.id.action_login_to_register)
        }
    }

    private fun attemptLogin() {
        val email    = etEmail.text.toString().trim()
        val password = etPassword.text.toString().trim()

        if (email.isEmpty() || password.isEmpty()) {
            showError("Email and password are required.")
            return
        }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            showError("Please enter a valid email address.")
            return
        }

        hideError()
        btnLogin.isEnabled = false

        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val response = ApiClient.apiService.login(LoginRequest(email, password))
                if (response.isSuccessful) {
                    val auth = response.body()!!

                    // Persist token in SharedPreferences
                    requireActivity()
                        .getSharedPreferences("quickclinic_prefs", android.content.Context.MODE_PRIVATE)
                        .edit()
                        .putString("access_token", auth.accessToken)
                        .putString("user_firstname", auth.user.firstname)
                        .putString("user_role", auth.user.role)
                        .apply()

                    // Pass data to HomeFragment via Safe Args bundle
                    val bundle = bundleOf(
                        "firstname" to auth.user.firstname,
                        "role"      to auth.user.role
                    )
                    findNavController().navigate(R.id.action_login_to_home, bundle)
                } else {
                    showError("Invalid email or password. Please try again.")
                }
            } catch (e: Exception) {
                showError("Network error: ${e.localizedMessage}")
            } finally {
                btnLogin.isEnabled = true
            }
        }
    }

    private fun showError(message: String) {
        tvError.text = message
        tvError.visibility = View.VISIBLE
    }

    private fun hideError() {
        tvError.visibility = View.GONE
    }
}
```

### `HomeFragment.kt`
```kotlin
package edu.cit.villarta.quickclinic.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import edu.cit.villarta.quickclinic.R

class HomeFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.fragment_home, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Read arguments passed from LoginFragment via NavController
        val firstname = arguments?.getString("firstname") ?: "User"
        val role      = arguments?.getString("role") ?: ""

        view.findViewById<TextView>(R.id.tvWelcome).text = "Welcome Back, $firstname!"
        view.findViewById<TextView>(R.id.tvRole).text = "Logged in as: $role"
    }
}
```

---

## Step 8 — AndroidManifest.xml

Only `MainActivity` needs to be declared — it hosts everything:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="edu.cit.villarta.quickclinic">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:label="QuickClinic"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">

        <activity
            android:name=".activity.MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>
</manifest>
```

---

## Key Differences vs. Activity Version

| Concern | Activity Version | Fragment Version |
|---|---|---|
| Screen unit | `Activity` per screen | `Fragment` per screen |
| Host | Each Activity is its own host | Single `MainActivity` hosts all |
| Navigation | `Intent` + `startActivity()` | `NavController` + `findNavController().navigate()` |
| Back stack | Android Activity back stack | Navigation Component back stack |
| Data passing | `Intent.putExtra()` | `bundleOf()` / NavArgs |
| `lifecycleScope` | `lifecycleScope` on Activity | `viewLifecycleOwner.lifecycleScope` on Fragment |
| View binding | `findViewById` in `onCreate` | `findViewById` in `onViewCreated` |
| Manifest entries | One entry per Activity | Only `MainActivity` declared |

> **Why use Fragments?** Fragments allow you to build future screens (Dashboard, Appointments, Booking) as modular, reusable components inside a single Activity. The Navigation Component also makes adding transitions and a bottom navigation bar (as per your SDD §7.2 wireframes) much easier in Phase 3+.

---

## Important Fragment-Specific Rules

**Always use `viewLifecycleOwner.lifecycleScope`** (not `lifecycleScope`) inside Fragments for coroutines. This ensures coroutines are cancelled when the Fragment's view is destroyed, preventing memory leaks.

```kotlin
// ✅ Correct — tied to view lifecycle
viewLifecycleOwner.lifecycleScope.launch { ... }

// ❌ Wrong inside a Fragment — tied to fragment lifecycle, not view
lifecycleScope.launch { ... }
```

**Never access views before `onViewCreated`** and never store view references as Fragment-level properties without nulling them in `onDestroyView`. For this phase, the pattern shown is safe since no background operations survive beyond the coroutine scope.

---

## Token Storage & Future Authenticated Requests

Same pattern as the Activity version — token is saved in `SharedPreferences` after login and reused for future API calls:

```kotlin
// Reading the token in any future Fragment (e.g., AppointmentsFragment)
val prefs = requireActivity()
    .getSharedPreferences("quickclinic_prefs", Context.MODE_PRIVATE)
val token = prefs.getString("access_token", null)

// Attach to authenticated Retrofit call
apiService.getAppointments("Bearer $token")
```

---

## Validation Reference

| Field | Rule | Error Message |
|---|---|---|
| First Name | Not empty | "All fields are required." |
| Last Name | Not empty | "All fields are required." |
| Email | Valid email format | "Please enter a valid email address." |
| Password (register) | Minimum 8 characters | "Password must be at least 8 characters." |
| Email (login) | Not empty + valid format | "Email and password are required." |

---

## Commit Guidelines

```
feat: add MainActivity as NavHost container
feat: add LoginFragment with input validation
feat: add RegisterFragment connected to /auth/register
feat: add HomeFragment with welcome message
feat: set up Navigation Component and nav_graph
feat: connect fragments to Phase 1 backend via Retrofit
fix: use viewLifecycleOwner.lifecycleScope in fragments
```

---

## SDD Alignment

| SDD Section | This Implementation |
|---|---|
| §1.3 Scope – Native Android | Kotlin + XML Layouts, `/mobile/` directory |
| §2.2 Journey 1 – Student Books | Begins at `HomeFragment` after successful login |
| §2.4 – User Authentication | `LoginFragment` + `RegisterFragment` |
| §2.5 AC-1 – Registration | Calls `POST /auth/register`, navigates to Login on success |
| §2.5 AC-3 – Role Restriction | JWT stored; future fragments attach Bearer token |
| §3.2 Security – JWT, BCrypt | Backend BCrypt; mobile stores and forwards JWT |
| §4.1 Component Diagram | Mobile → Spring Boot REST API Controller Layer |
| §5.2 Auth Endpoints | `/auth/register` and `/auth/login` via Retrofit |
| §7.2 Mobile Wireframes | Single-activity fragment navigation matches SDD bottom nav pattern |

---

*End of Copilot_Mobile_Fragments.md — QuickClinic Phase 2 (Fragment Version)*
