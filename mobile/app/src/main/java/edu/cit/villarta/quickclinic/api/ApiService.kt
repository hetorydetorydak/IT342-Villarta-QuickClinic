package edu.cit.villarta.quickclinic.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import edu.cit.villarta.quickclinic.model.RegisterRequest
import edu.cit.villarta.quickclinic.model.LoginRequest
import edu.cit.villarta.quickclinic.model.UserResponse
import edu.cit.villarta.quickclinic.model.AuthResponse

interface ApiService {

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<UserResponse>

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
}
