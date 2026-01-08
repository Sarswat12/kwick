package com.kwick.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

import com.kwick.backend.ApiResponse;

@RestController
@RequestMapping("/admin")
public class AdminInfoController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> adminInfo() {
        Map<String, Object> payload = Map.of(
            "service", "Kwick Admin Panel",
            "version", "1.0.0",
            "status", "running",
            "endpoints", Map.of(
                "login", "POST /admin/login",
                "dashboard", "GET /admin/dashboard",
                "kyc_management", "/admin/kyc",
                "payment_management", "/admin/payments",
                "user_management", "/admin/users",
                "vehicle_management", "/admin/vehicles",
                "rental_management", "/admin/rentals"
            ),
            "note", "Admin endpoints require authentication. Please login first."
        );
        return ResponseEntity.ok(new ApiResponse<>(payload));
    }

    @GetMapping("/kyc")
    public ResponseEntity<ApiResponse<Map<String, Object>>> adminKycInfo() {
        Map<String, Object> payload = Map.of(
            "service", "Admin KYC Management",
            "status", "running",
            "version", "1.0.0",
            "note", "Use authenticated admin APIs under /api/admin/kyc/**",
            "endpoints", Map.of(
                "list_pending", "GET /api/admin/kyc?status=pending",
                "get_by_id", "GET /api/admin/kyc/{id}",
                "approve", "PUT /api/admin/kyc/{id}/approve",
                "reject", "PUT /api/admin/kyc/{id}/reject",
                "user_lookup", "GET /api/admin/kyc/user/{userId}"
            )
        );
        return ResponseEntity.ok(new ApiResponse<>(payload));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> adminUserInfo() {
        Map<String, Object> payload = Map.of(
            "service", "Admin User Management",
            "status", "running",
            "version", "1.0.0",
            "note", "Use authenticated admin APIs under /api/admin/user/**",
            "endpoints", Map.of(
                "list", "GET /api/admin/user", 
                "get_by_id", "GET /api/admin/user/{id}",
                "update_status", "PUT /api/admin/user/{id}/status",
                "search", "GET /api/admin/user/search?q=..."
            )
        );
        return ResponseEntity.ok(new ApiResponse<>(payload));
    }
}
