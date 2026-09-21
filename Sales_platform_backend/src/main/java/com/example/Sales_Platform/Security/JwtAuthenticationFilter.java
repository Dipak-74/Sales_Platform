package com.example.Sales_Platform.Security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Authorization header मधून token घेणे
        String authHeader = request.getHeader("Authorization");

        // 2. Bearer token आहे का check करणे
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. "Bearer " काढून actual JWT token घेणे
        String token = authHeader.substring(7);

        try {

            // 4. JWT मधून email घेणे
            String email = jwtService.extractEmail(token);

            // 5. User already authenticated नाही ना ते check
            if (email != null &&
                    SecurityContextHolder.getContext()
                            .getAuthentication() == null) {

                // 6. Database मधून user details घेणे
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                // 7. JWT valid आहे का check
                if (jwtService.isTokenValid(token)) {

                    // 8. Spring Security authentication object
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // 9. SecurityContext मध्ये authentication ठेवणे
                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (Exception e) {
            // Invalid/expired token असल्यास unauthenticated राहू द्या
            System.out.println("JWT Authentication failed: "
                    + e.getMessage());
        }

        // 10. Request पुढे पाठवणे
        filterChain.doFilter(request, response);
    }
}