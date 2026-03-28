package com.example.quickclinic.model

data class AuthResponse(
    val user: UserResponse,
    val accessToken: String,
    val refreshToken: String?
)
