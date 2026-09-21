
package com.example.Sales_Platform.Security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // application.properties मधून value घेईल
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;


    // Secret Key तयार करणे
    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }


    // JWT Generate
    public String generateToken(String email, String role) {

        return Jwts.builder()

                // User email
                .subject(email)

                // User role
                .claim("role", role)

                // Token created time
                .issuedAt(new Date())

                // Token expiry
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expirationTime
                        )
                )

                // Sign JWT
                .signWith(getSigningKey())

                // Final JWT String
                .compact();
    }


    // JWT मधून email काढणे
    public String extractEmail(String token) {

        return getClaims(token).getSubject();
    }


    // JWT मधून role काढणे
    public String extractRole(String token) {

        return getClaims(token)
                .get("role", String.class);
    }


    // JWT valid आहे का?
    public boolean isTokenValid(String token) {

        try {

            getClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }


    // JWT Claims मिळवणे
    private Claims getClaims(String token) {

        return Jwts.parser()

                .verifyWith(getSigningKey())

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }
}