package edu.cit.villarta.quickclinic.features.dashboard;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.villarta.quickclinic.features.appointment.AppointmentRepository;
import edu.cit.villarta.quickclinic.features.auth.User;
import edu.cit.villarta.quickclinic.features.auth.UserRepository;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Map<String, Object> getDashboardData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalAppointments = appointmentRepository.findByUser(user).size();
        long pendingAppointments = appointmentRepository.findByUser(user)
                .stream().filter(a -> "PENDING".equals(a.getStatus())).count();
        long approvedAppointments = appointmentRepository.findByUser(user)
                .stream().filter(a -> "APPROVED".equals(a.getStatus())).count();

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("user", Map.of(
            "id", user.getId(),
            "name", user.getFirstname() + " " + user.getLastname(),
            "email", user.getEmail(),
            "role", user.getRole()
        ));
        dashboard.put("stats", Map.of(
            "totalAppointments", totalAppointments,
            "pendingAppointments", pendingAppointments,
            "approvedAppointments", approvedAppointments
        ));

        return dashboard;
    }
}