package edu.cit.villarta.quickclinic.shared.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {

    private UserResponse user;
    private String accessToken;
    private String refreshToken;

}