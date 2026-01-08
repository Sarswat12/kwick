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

    // Always return a primitive to avoid nullable warnings
    private long extractUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        return Long.parseLong(userId.toString());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(HttpServletRequest request) {
        long userId = extractUserId(request);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        if (user == null) {
            throw new UnauthorizedException("User not found");
        }
        // Use a HashMap to allow null values safely (Map.of does not allow nulls)
        java.util.Map<String, Object> profile = new java.util.HashMap<>();
        profile.put("userId", user.getId());
        profile.put("email", user.getEmail());
        profile.put("name", user.getName());
        profile.put("phone", user.getPhone());
        profile.put("address", user.getAddress());
        profile.put("kycStatus", user.getKycStatus());
        profile.put("role", user.getRole());
        return ResponseEntity.ok(new ApiResponse<>(profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            HttpServletRequest request,
            @RequestBody Map<String, String> body) {
        long userId = extractUserId(request);
        User user = userRepository.findById(userId)
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
        java.util.Map<String, Object> updated = new java.util.HashMap<>();
        updated.put("userId", user.getId());
        updated.put("email", user.getEmail());
        updated.put("name", user.getName());
        updated.put("phone", user.getPhone());
        updated.put("address", user.getAddress());
        updated.put("kycStatus", user.getKycStatus());
        updated.put("role", user.getRole());
        return ResponseEntity.ok(new ApiResponse<>(updated));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Object>> changePassword(
            HttpServletRequest request,
            @RequestBody Map<String, String> body) {
        long userId = extractUserId(request);
        User user = userRepository.findById(userId)
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
