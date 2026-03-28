package com.example.quickclinic.fragment

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
import com.example.quickclinic.R
import com.example.quickclinic.api.ApiClient
import com.example.quickclinic.model.LoginRequest
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
