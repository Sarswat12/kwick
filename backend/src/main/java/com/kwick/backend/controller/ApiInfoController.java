package com.kwick.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiInfoController {

    @GetMapping
    public Map<String, Object> apiInfo() {
        return Map.of(
            "api", "Kwick Backend API",
            "version", "1.0.0",
            "status", "running",
            "endpoints", Map.of(
                "health", "/api/health",
                "kyc", "/api/kyc/**",
                "payment", "/api/payment/**",
                "rental", "/api/rental/**",
                "vehicle", "/api/vehicle/**",
                "user", "/api/user/**"
            )
        );
    }
}
