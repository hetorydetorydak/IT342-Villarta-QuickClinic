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
