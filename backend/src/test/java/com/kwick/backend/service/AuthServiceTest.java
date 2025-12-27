package com.kwick.backend.service;

import com.kwick.backend.model.User;
import com.kwick.backend.repository.RefreshTokenRepository;
import com.kwick.backend.repository.UserRepository;
import com.kwick.backend.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthServiceTest {


    private UserRepository userRepository;
    private RefreshTokenRepository refreshTokenRepository;
    private JwtUtil jwtUtil;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        refreshTokenRepository = mock(RefreshTokenRepository.class);
        jwtUtil = mock(JwtUtil.class);
        authService = new AuthService(userRepository, jwtUtil, refreshTokenRepository);
    }

    @SuppressWarnings("null")
    @Test
    void signup_createsUserAndRefreshToken() {
        when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.empty());
        when(jwtUtil.generateToken(anyString())).thenReturn("access-token", "refresh-token");
        // Mock userRepository.save to assign an ID to the user
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        var res = authService.signup("a@b.com", "password123", "Name");

        assertNotNull(res.get("token"));
        assertNotNull(res.get("refreshToken"));
        verify(userRepository, times(1)).save(org.mockito.ArgumentMatchers.<com.kwick.backend.model.User>argThat(user -> user != null));
        verify(refreshTokenRepository, times(1)).save(org.mockito.ArgumentMatchers.<com.kwick.backend.model.RefreshToken>argThat(token -> token != null));
    }

    @Test
    void login_withInvalidPassword_throws() {
        User u = new User();
        u.setEmail("a@b.com");
        u.setPasswordHash("$2a$10$invalidhash");
        when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.of(u));

        assertThrows(IllegalArgumentException.class, () -> authService.login("a@b.com", "wrongpass"));
    }
}
