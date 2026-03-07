package edu.cit.villarta.quickclinic.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {

    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String role;
    private LocalDateTime createdAt;

}