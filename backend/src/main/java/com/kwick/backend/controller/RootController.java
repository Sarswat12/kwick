package com.kwick.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, Object> root() {
        return Map.of(
            "service", "Kwick Backend API",
            "status", "running",
            "version", "1.0.0",
            "endpoints", Map.of(
                "health", "/api/health",
                "documentation", "Contact admin for API documentation"
            )
        );
    }
}
