package edu.cit.villarta.quickclinic.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private Object error;
    private LocalDateTime timestamp;

}