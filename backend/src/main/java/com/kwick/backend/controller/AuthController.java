package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.dto.LoginRequest;
import com.kwick.backend.dto.RefreshRequest;
import com.kwick.backend.dto.SignupRequest;
import com.kwick.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}