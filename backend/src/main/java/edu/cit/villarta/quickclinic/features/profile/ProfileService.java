package edu.cit.villarta.quickclinic.features.profile;

import edu.cit.villarta.quickclinic.shared.dto.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.villarta.quickclinic.features.auth.User;
import edu.cit.villarta.quickclinic.features.auth.UserRepository;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    public UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstname(user.getFirstname());
        response.setLastname(user.getLastname());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }
}