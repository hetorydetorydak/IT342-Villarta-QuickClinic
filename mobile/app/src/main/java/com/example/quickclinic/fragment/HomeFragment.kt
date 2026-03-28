package com.example.quickclinic.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.example.quickclinic.R

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
