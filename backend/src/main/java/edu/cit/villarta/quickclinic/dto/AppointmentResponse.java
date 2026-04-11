package edu.cit.villarta.quickclinic.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentResponse {
    private Long id;
    private String appointmentType;
    private String symptoms;
    private LocalDate preferredDate;
    private String timeSlot;
    private String attachment;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
