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

        // Skip filtering for explicitly public endpoints only
        if (path.equals("/") || path.equals("/api") || path.startsWith("/api/auth/") || path.startsWith("/api/health") || path.startsWith("/api/kyc/debug") || path.startsWith("/error")) {
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
                        String role = u.getRole() == null ? "user" : u.getRole().toLowerCase();
                        request.setAttribute("userRole", role);
                        var auth = new UsernamePasswordAuthenticationToken(
                                u.getId().toString(),
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        logger.info("Authenticated user {} with role: {} (authority: ROLE_{})", uid, role, role.toUpperCase());
                    } else {
                        logger.warn("User ID {} from token not found in database", uid);
                    }
                } catch (NumberFormatException nfe) {
                    logger.warn("Invalid user ID format in token: {}", userId);
                } catch (Exception e) {
                    logger.error("Error setting authentication for user {}: {}", userId, e.getMessage(), e);
                }
            } catch (Exception ex) {
                logger.warn("Invalid token in request: {}", ex.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
