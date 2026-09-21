
package com.example.Sales_Platform.Controller;

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
}
