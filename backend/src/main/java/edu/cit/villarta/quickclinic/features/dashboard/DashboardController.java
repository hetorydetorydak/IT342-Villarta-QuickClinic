package edu.cit.villarta.quickclinic.features.dashboard;

import java.util.HashMap;
import java.util.Map;

import edu.cit.villarta.quickclinic.shared.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.villarta.quickclinic.features.appointment.AppointmentRepository;
import edu.cit.villarta.quickclinic.features.auth.User;
import edu.cit.villarta.quickclinic.features.auth.UserRepository;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard(HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
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

        return ResponseEntity.ok(dashboard);
    }

    private Long getUserIdFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            return jwtProvider.getUserIdFromToken(token);
        }
        throw new RuntimeException("Invalid token");
    }
}