package com.kwick.backend.service;

import com.kwick.backend.model.RefreshToken;
import com.kwick.backend.model.User;
import com.kwick.backend.repository.RefreshTokenRepository;
import com.kwick.backend.repository.UserRepository;
import com.kwick.backend.security.JwtUtil;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // refresh tokens valid for 7 days
    private final long refreshExpirationSeconds = 60L * 60 * 24 * 7;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public Map<String, Object> signup(String email, String password, String name) {
        String cleanEmail = email == null ? null : email.trim().toLowerCase();
        if (userRepository.findByEmail(cleanEmail).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        User u = new User();
        u.setEmail(cleanEmail);
        u.setPasswordHash(passwordEncoder.encode(password));
        u.setName(name);
        userRepository.save(u);

        String token = jwtUtil.generateToken(u.getId().toString());
        String refreshToken = jwtUtil.generateToken("refresh:" + u.getId());

        RefreshToken rt = new RefreshToken();
        rt.setToken(refreshToken);
        rt.setUser(u);
        rt.setCreatedAt(Instant.now());
        rt.setExpiresAt(Instant.now().plus(refreshExpirationSeconds, ChronoUnit.SECONDS));
        refreshTokenRepository.save(rt);

        return Map.of(
            "user", Map.of(
                "userId", u.getId(),
                "email", u.getEmail(),
                "name", u.getName(),
                "role", u.getRole(),
                "kycStatus", u.getKycStatus()
            ),
            "token", token,
            "refreshToken", refreshToken);
    }

    public Map<String, Object> login(String email, String password) {
        String cleanEmail = email == null ? null : email.trim().toLowerCase();
        System.out.println("[DEBUG] Login attempt for email: '" + cleanEmail + "'");
        User u = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        boolean passwordMatch = passwordEncoder.matches(password, u.getPasswordHash());
        System.out.println("[DEBUG] Password match: " + passwordMatch);
        if (!passwordMatch) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(u.getId().toString());
        String refreshToken = jwtUtil.generateToken("refresh:" + u.getId());

        RefreshToken rt = new RefreshToken();
        rt.setToken(refreshToken);
        rt.setUser(u);
        rt.setCreatedAt(Instant.now());
        rt.setExpiresAt(Instant.now().plus(refreshExpirationSeconds, ChronoUnit.SECONDS));
        refreshTokenRepository.save(rt);

        return Map.of(
            "user",
            Map.of(
                "userId", u.getId(),
                "email", u.getEmail(),
                "name", u.getName(),
                "role", u.getRole(),
                "kycStatus", u.getKycStatus()
            ),
            "token", token,
            "refreshToken", refreshToken);
    }

    public Map<String, Object> refresh(String refreshToken) {
        // parse refresh token, ensure saved and not revoked
        DecodedJWT claims = jwtUtil.parseClaims(refreshToken);
        String sub = claims.getSubject();
        if (sub == null || !sub.startsWith("refresh:"))
            throw new IllegalArgumentException("Invalid refresh token");
        String id = sub.substring("refresh:".length());

        var found = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));
        if (found.isRevoked() || found.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Refresh token revoked or expired");
        }

        // revoke old and issue new
        found.setRevoked(true);
        refreshTokenRepository.save(found);

        String token = jwtUtil.generateToken(id);
        String newRefresh = jwtUtil.generateToken("refresh:" + id);

        RefreshToken rt = new RefreshToken();
        rt.setToken(newRefresh);
        rt.setUser(found.getUser());
        rt.setCreatedAt(Instant.now());
        rt.setExpiresAt(Instant.now().plus(refreshExpirationSeconds, ChronoUnit.SECONDS));
        refreshTokenRepository.save(rt);

        return Map.of("token", token, "refreshToken", newRefresh);
    }

    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

}