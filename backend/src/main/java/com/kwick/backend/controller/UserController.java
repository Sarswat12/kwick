package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.exception.UnauthorizedException;
import com.kwick.backend.model.User;
import com.kwick.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private Long extractUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        return Long.parseLong(userId.toString());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(HttpServletRequest request) {
        Long userId = extractUserId(request);
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        if (user == null) {
            throw new UnauthorizedException("User not found");
        }
        return ResponseEntity.ok(new ApiResponse<>(Map.of(
            "userId", user.getId(),
            "email", user.getEmail(),
            "name", user.getName(),
            "phone", user.getPhone(),
            "address", user.getAddress(),
            "kycStatus", user.getKycStatus(),
            "role", user.getRole())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            HttpServletRequest request,
            @RequestBody Map<String, String> body) {
        Long userId = extractUserId(request);
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        if (user == null) {
            throw new UnauthorizedException("User not found");
        }
        if (body.containsKey("name") && body.get("name") != null) {
            user.setName(body.get("name"));
        }
        if (body.containsKey("phone") && body.get("phone") != null) {
            user.setPhone(body.get("phone"));
        }
        if (body.containsKey("address") && body.get("address") != null) {
            user.setAddress(body.get("address"));
        }
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse<>(Map.of(
                "userId", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "phone", user.getPhone(),
                "address", user.getAddress())));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Object>> changePassword(
            HttpServletRequest request,
            @RequestBody Map<String, String> body) {
        Long userId = extractUserId(request);
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        if (user == null) {
            throw new UnauthorizedException("User not found");
        }
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse<>(Map.of("message", "Password changed successfully")));
    }
}
