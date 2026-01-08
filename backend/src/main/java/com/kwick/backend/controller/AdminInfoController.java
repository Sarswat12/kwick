package com.kwick.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminInfoController {

    @GetMapping
    public Map<String, Object> adminInfo() {
        return Map.of(
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
    }
}
