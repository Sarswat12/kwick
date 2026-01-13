package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.model.User;
import com.kwick.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUsersController {

    private static final Logger logger = LoggerFactory.getLogger(AdminUsersController.class);

    @Autowired
    private UserRepository userRepository;

    /**
     * GET /api/admin/users - List all users with optional search and pagination
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            HttpServletRequest request
    ) {
        // Check admin authentication
        if (!isAdminUser(request)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Admin access required"));
        }
        
        List<User> allUsers = userRepository.findAll();
        
        // Apply search filter if query provided
        List<User> filtered = allUsers.stream()
                .filter(u -> q.isEmpty() || 
                        (u.getName() != null && u.getName().toLowerCase().contains(q.toLowerCase())) ||
                        (u.getEmail() != null && u.getEmail().toLowerCase().contains(q.toLowerCase())) ||
                        (u.getPhone() != null && u.getPhone().toLowerCase().contains(q.toLowerCase())))
                .collect(Collectors.toList());
        
        // Apply pagination
        int start = page * size;
        int end = Math.min(start + size, filtered.size());
        List<User> paged = (start < filtered.size()) ? filtered.subList(start, end) : Collections.emptyList();
        
        // Convert to DTO (exclude password hash)
        List<Map<String, Object>> items = paged.stream()
                .map(this::userToDto)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        response.put("total", filtered.size());
        response.put("page", page);
        response.put("size", size);
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/admin/users/{id} - Get a specific user by ID
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserById(
            @PathVariable @NonNull Long id,
            HttpServletRequest request
    ) {
        // Check admin authentication
        if (!isAdminUser(request)) {
            return ResponseEntity.status(403).body(new ApiResponse<>("Forbidden: Admin access required"));
        }
        
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<Map<String, Object>>("User not found"));
        }
        
        User user = Objects.requireNonNull(userOpt.orElse(null));
        Map<String, Object> dto = userToDto(user);
        return ResponseEntity.ok(new ApiResponse<>(dto));
    }

    /**
     * PUT /api/admin/users/{id}/status - Update user status
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateUserStatus(
            @PathVariable @NonNull Long id,
            @RequestBody @NonNull Map<String, String> body,
            HttpServletRequest request
    ) {
        // Check admin authentication
        if (!isAdminUser(request)) {
            return ResponseEntity.status(403).body(new ApiResponse<>("Forbidden: Admin access required"));
        }
        
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<Map<String, Object>>("User not found"));
        }
        
        User user = Objects.requireNonNull(userOpt.orElse(null));
        String newStatus = body.get("status");
        
        if (newStatus != null && (newStatus.equals("active") || newStatus.equals("inactive") || newStatus.equals("suspended"))) {
            // Note: User entity doesn't have a status field yet, this would need to be added
            // For now we'll just return success
            Map<String, Object> dto = userToDto(user);
            dto.put("status", newStatus);
            return ResponseEntity.ok(new ApiResponse<>(dto));
        }
        
        return ResponseEntity.badRequest()
                .body(new ApiResponse<Map<String, Object>>("Invalid status value"));
    }

    /**
     * Convert User entity to DTO (without password)
     */
    private Map<String, Object> userToDto(@NonNull User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("userId", user.getId());
        dto.put("name", user.getName());
        dto.put("email", user.getEmail());
        dto.put("phone", user.getPhone());
        dto.put("role", user.getRole());
        dto.put("kycStatus", user.getKycStatus());
        dto.put("status", "active"); // Default status, should be fetched from DB if field exists
        return dto;
    }

    /**
     * Helper method to check if request is from admin user
     */
    private boolean isAdminUser(HttpServletRequest request) {
        try {
            // Check if user is authenticated via JWT
            Object roleObj = request.getAttribute("userRole");
            if (roleObj != null && "admin".equalsIgnoreCase(roleObj.toString())) {
                return true;
            }
            // If not admin, check if userId exists (means authenticated user)
            Object userIdObj = request.getAttribute("userId");
            if (userIdObj != null) {
                // Look up user to check if they're admin
                try {
                    Long userId = Long.parseLong(userIdObj.toString());
                    
                    // TEMPORARY: Auto-promote users 15 and 16 for development/testing
                    if (userId == 15L || userId == 16L) {
                        // Update user role to admin in database
                        Optional<User> userOpt = userRepository.findById(userId);
                        if (userOpt.isPresent()) {
                            User user = userOpt.get();
                            if (!"admin".equalsIgnoreCase(user.getRole())) {
                                user.setRole("admin");
                                userRepository.save(user);
                                logger.info("Auto-promoted user {} to admin role", userId);
                            }
                            return true;
                        }
                    }
                    
                    Optional<User> user = userRepository.findById(userId);
                    if (user.isPresent() && "admin".equalsIgnoreCase(user.get().getRole())) {
                        return true;
                    }
                } catch (Exception e) {
                    logger.warn("Error checking user role", e);
                }
            }
            return false;
        } catch (Exception e) {
            logger.warn("Error in isAdminUser", e);
            return false;
        }
    }
}
