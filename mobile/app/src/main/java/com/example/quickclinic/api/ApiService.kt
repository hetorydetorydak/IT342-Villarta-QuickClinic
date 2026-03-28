package com.example.quickclinic.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import com.example.quickclinic.model.RegisterRequest
import com.example.quickclinic.model.LoginRequest
import com.example.quickclinic.model.UserResponse
import com.example.quickclinic.model.AuthResponse

interface ApiService {

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<UserResponse>

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
}
