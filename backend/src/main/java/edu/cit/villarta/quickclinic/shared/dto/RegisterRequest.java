package edu.cit.villarta.quickclinic.shared.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String role;

}