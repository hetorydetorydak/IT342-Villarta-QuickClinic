package edu.cit.villarta.quickclinic.features.appointment;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.villarta.quickclinic.shared.dto.AppointmentRequest;
import edu.cit.villarta.quickclinic.shared.dto.AppointmentResponse;
import edu.cit.villarta.quickclinic.features.auth.User;
import edu.cit.villarta.quickclinic.features.auth.UserRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    public AppointmentResponse createAppointment(AppointmentRequest request, Long userId) {
        System.out.println("Creating appointment for user ID: " + userId);
        System.out.println("Appointment request: " + request.getAppointmentType() + ", " + request.getSymptoms());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setAppointmentType(request.getAppointmentType());
        appointment.setSymptoms(request.getSymptoms());
        appointment.setPreferredDate(request.getPreferredDate());
        appointment.setTimeSlot(request.getTimeSlot());
        appointment.setAttachment(request.getAttachment());
        appointment.setStatus("PENDING");

        System.out.println("Saving appointment...");
        Appointment saved = appointmentRepository.save(appointment);
        System.out.println("Appointment saved with ID: " + saved.getId());
        return convertToResponse(saved);
    }

    public List<AppointmentResponse> getUserAppointments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return appointmentRepository.findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return convertToResponse(appointment);
    }

    public AppointmentResponse updateAppointment(Long id, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setAppointmentType(request.getAppointmentType());
        appointment.setSymptoms(request.getSymptoms());
        appointment.setPreferredDate(request.getPreferredDate());
        appointment.setTimeSlot(request.getTimeSlot());
        appointment.setAttachment(request.getAttachment());

        Appointment updated = appointmentRepository.save(appointment);
        return convertToResponse(updated);
    }

    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointmentRepository.delete(appointment);
    }

    public AppointmentResponse approveAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus("APPROVED");
        Appointment updated = appointmentRepository.save(appointment);
        return convertToResponse(updated);
    }

    public AppointmentResponse rejectAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus("REJECTED");
        Appointment updated = appointmentRepository.save(appointment);
        return convertToResponse(updated);
    }

    private AppointmentResponse convertToResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setAppointmentType(appointment.getAppointmentType());
        response.setSymptoms(appointment.getSymptoms());
        response.setPreferredDate(appointment.getPreferredDate());
        response.setTimeSlot(appointment.getTimeSlot());
        response.setAttachment(appointment.getAttachment());
        response.setStatus(appointment.getStatus());
        response.setCreatedAt(appointment.getCreatedAt());
        response.setUpdatedAt(appointment.getUpdatedAt());
        return response;
    }
}