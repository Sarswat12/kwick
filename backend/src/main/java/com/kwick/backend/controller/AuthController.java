package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.dto.LoginRequest;
import com.kwick.backend.dto.RefreshRequest;
import com.kwick.backend.dto.SignupRequest;
import com.kwick.backend.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signup(@Valid @RequestBody SignupRequest req) {
        var result = authService.signup(req.getEmail(), req.getPassword(), req.getName());
        return ResponseEntity.ok(new ApiResponse<>(result));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequest req) {
        var result = authService.login(req.getEmail(), req.getPassword());
        return ResponseEntity.ok(new ApiResponse<>(result));
    }

    // Fallback for clients sending form-encoded bodies instead of JSON
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<ApiResponse<Map<String, Object>>> loginForm(
        @RequestParam("email") String email,
        @RequestParam("password") String password
    ) {
        var result = authService.login(email, password);
        return ResponseEntity.ok(new ApiResponse<>(result));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, Object>>> refresh(@Valid @RequestBody RefreshRequest req) {
        var result = authService.refresh(req.getRefreshToken());
        return ResponseEntity.ok(new ApiResponse<>(result));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Object>> logout(@Valid @RequestBody RefreshRequest req) {
        authService.logout(req.getRefreshToken());
        return ResponseEntity.ok(new ApiResponse<>(Map.of("ok", true)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAuthStatus() {
        return ResponseEntity.ok(new ApiResponse<>(Map.of(
            "status", "active",
            "message", "Auth API is operational",
            "endpoints", Map.of(
                "signup", "POST /api/auth/signup",
                "login", "POST /api/auth/login",
                "refresh", "POST /api/auth/refresh",
                "logout", "POST /api/auth/logout"
            )
        )));
    }

}