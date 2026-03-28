package edu.cit.villarta.quickclinic.model

data class UserResponse(
    val id: Long,
    val firstname: String,
    val lastname: String,
    val email: String,
    val role: String,
    val createdAt: String
)
