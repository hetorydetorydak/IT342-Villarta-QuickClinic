package edu.cit.villarta.quickclinic.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.villarta.quickclinic.dto.ApiResponse;
import edu.cit.villarta.quickclinic.dto.AppointmentRequest;
import edu.cit.villarta.quickclinic.dto.AppointmentResponse;
import edu.cit.villarta.quickclinic.security.JwtProvider;
import edu.cit.villarta.quickclinic.service.AppointmentService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private JwtProvider jwtProvider;

    // Extract user ID from JWT token
    private Long getUserIdFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            return jwtProvider.getUserIdFromToken(token);
        }
        throw new RuntimeException("Invalid token");
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(
            @RequestBody AppointmentRequest request,
            HttpServletRequest httpRequest) {
        try {
            // Validate request
            if (request.getAppointmentType() == null || request.getAppointmentType().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse("Appointment type is required"));
            }
            if (request.getSymptoms() == null || request.getSymptoms().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse("Symptoms are required"));
            }
            if (request.getPreferredDate() == null) {
                return ResponseEntity.badRequest().body(new ApiResponse("Preferred date is required"));
            }
            if (request.getTimeSlot() == null || request.getTimeSlot().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse("Time slot is required"));
            }

            Long userId = getUserIdFromToken(httpRequest);
            AppointmentResponse response = appointmentService.createAppointment(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAppointments(HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            List<AppointmentResponse> appointments = appointmentService.getUserAppointments(userId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable Long id) {
        AppointmentResponse appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentResponse> updateAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentRequest request) {
        AppointmentResponse response = appointmentService.updateAppointment(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteAppointment(@PathVariable Long id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok(new ApiResponse("Appointment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<AppointmentResponse> approveAppointment(@PathVariable Long id) {
        AppointmentResponse response = appointmentService.approveAppointment(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<AppointmentResponse> rejectAppointment(@PathVariable Long id) {
        AppointmentResponse response = appointmentService.rejectAppointment(id);
        return ResponseEntity.ok(response);
    }
}
