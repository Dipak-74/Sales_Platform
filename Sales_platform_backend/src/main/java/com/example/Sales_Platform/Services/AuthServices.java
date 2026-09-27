
package com.example.Sales_Platform.Services;

import com.example.Sales_Platform.DTO.GoogleLoginRequestDTO;
import com.example.Sales_Platform.DTO.LoginResponseDTO;

public interface AuthServices {

    // Google Login
    LoginResponseDTO googleLogin(
            GoogleLoginRequestDTO request
    );

    // Google Register
    LoginResponseDTO googleRegister(
            GoogleLoginRequestDTO request
    );

    // Normal Email/Password Login
    LoginResponseDTO login(
            com.example.Sales_Platform.DTO.LoginRequestDTO request
    );

    // Normal Registration
    LoginResponseDTO register(
            com.example.Sales_Platform.DTO.RegisterRequestDTO request
    );
}
