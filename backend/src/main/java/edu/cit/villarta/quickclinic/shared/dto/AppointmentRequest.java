package edu.cit.villarta.quickclinic.shared.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentRequest {
    private String appointmentType;
    private String symptoms;
    private LocalDate preferredDate;
    private String timeSlot;
    private String attachment;
}