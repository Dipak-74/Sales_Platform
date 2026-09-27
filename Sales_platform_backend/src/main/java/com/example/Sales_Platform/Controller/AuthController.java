
package com.example.Sales_Platform.Controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Sales_Platform.DTO.GoogleLoginRequestDTO;
import com.example.Sales_Platform.DTO.LoginResponseDTO;
import com.example.Sales_Platform.Services.AuthServices;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthServices authServices;

    public AuthController(AuthServices authServices) {
        this.authServices = authServices;
    }

    // Health / Server Ping to wake Render instance up quickly
    @GetMapping("/ping")
    public Map<String, String> ping() {
        return Collections.singletonMap("status", "UP");
    }

    // Google Login
    @PostMapping("/google")
    public LoginResponseDTO googleLogin(
            @RequestBody GoogleLoginRequestDTO request) {

        return authServices.googleLogin(request);
    }

    // Google Register
    @PostMapping("/google/register")
    public LoginResponseDTO googleRegister(
            @RequestBody GoogleLoginRequestDTO request) {

        return authServices.googleRegister(request);
    }

    // Normal Email/Password Login
    @PostMapping("/login")
    public LoginResponseDTO login(
            @RequestBody com.example.Sales_Platform.DTO.LoginRequestDTO request) {
        return authServices.login(request);
    }

    // Normal Registration
    @PostMapping("/register")
    public LoginResponseDTO register(
            @RequestBody com.example.Sales_Platform.DTO.RegisterRequestDTO request) {
        return authServices.register(request);
    }
}
