package com.kwick.backend.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    private final Algorithm algorithm;
    private final JWTVerifier verifier;
    private final long expirationMillis = 1000L * 60 * 60; // 1 hour

    public JwtUtil(@Value("${jwt.secret:}") String secret) {
        if (secret == null || secret.isBlank()) {
            // fallback to a random secret for dev if none provided
            secret = UUID.randomUUID().toString();
        }
        this.algorithm = Algorithm.HMAC256(secret);
        this.verifier = JWT.require(algorithm).build();
    }

    public String generateToken(String subject) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMillis);
        return JWT.create()
                .withSubject(subject)
                .withIssuedAt(now)
                .withExpiresAt(exp)
                .sign(algorithm);
    }

    public DecodedJWT parseClaims(String token) {
        return verifier.verify(token);
    }
}
