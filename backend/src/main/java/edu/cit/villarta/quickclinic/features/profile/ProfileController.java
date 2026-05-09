package edu.cit.villarta.quickclinic.features.profile;

import edu.cit.villarta.quickclinic.shared.dto.UserResponse;
import edu.cit.villarta.quickclinic.shared.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.villarta.quickclinic.features.auth.User;
import edu.cit.villarta.quickclinic.features.auth.UserRepository;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstname(user.getFirstname());
        response.setLastname(user.getLastname());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());

        return ResponseEntity.ok(response);
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