package edu.cit.villarta.quickclinic.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private Object error;
    private LocalDateTime timestamp;

    public ApiResponse(String message) {
        this.success = true;
        this.data = (T) message;
        this.timestamp = LocalDateTime.now();
    }

    public ApiResponse(T data) {
        this.success = true;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    public ApiResponse(boolean success, T data) {
        this.success = success;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

}