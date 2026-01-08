package com.kwick.backend.security;

import com.kwick.backend.model.User;
import com.kwick.backend.repository.UserRepository;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        
        // Skip filtering completely for public endpoints
        if (path.equals("/") || path.equals("/api") || path.equals("/admin") || path.startsWith("/admin/") || path.startsWith("/api/auth/") || path.equals("/api/kyc") || path.startsWith("/api/health") || path.startsWith("/api/kyc/debug") || path.startsWith("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                DecodedJWT decoded = jwtUtil.parseClaims(token);
                String userId = decoded.getSubject();
                request.setAttribute("userId", userId);

                try {
                    Long uid = Long.parseLong(userId);
                    Optional<User> ou = userRepository.findById(uid);
                    if (ou.isPresent()) {
                        User u = ou.get();
                        String role = u.getRole() == null ? "user" : u.getRole();
                        request.setAttribute("userRole", role);
                        var auth = new UsernamePasswordAuthenticationToken(
                                u.getId().toString(),
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                } catch (NumberFormatException nfe) {
                    // ignore
                }
            } catch (Exception ex) {
                logger.warn("Invalid token in request: {}", ex.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
