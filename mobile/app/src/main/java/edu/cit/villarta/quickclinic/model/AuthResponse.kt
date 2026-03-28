package edu.cit.villarta.quickclinic.model

data class AuthResponse(
    val user: UserResponse,
    val accessToken: String,
    val refreshToken: String?
)
