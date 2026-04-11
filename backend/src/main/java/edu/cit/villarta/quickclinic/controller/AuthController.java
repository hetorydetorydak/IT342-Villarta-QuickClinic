package edu.cit.villarta.quickclinic.controller;

import edu.cit.villarta.quickclinic.dto.AuthResponse;
import edu.cit.villarta.quickclinic.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import edu.cit.villarta.quickclinic.dto.RegisterRequest;
import edu.cit.villarta.quickclinic.model.User;
import edu.cit.villarta.quickclinic.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request){
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request){
        return authService.login(request);
    }
}