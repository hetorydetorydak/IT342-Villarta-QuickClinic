package com.example.quickclinic.model

data class RegisterRequest(
    val firstname: String,
    val lastname: String,
    val email: String,
    val password: String,
    val role: String = "STUDENT"
)
