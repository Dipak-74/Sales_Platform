package com.example.Sales_Platform.Services;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.Sales_Platform.DTO.CustomerRequestDTO;
import com.example.Sales_Platform.DTO.GoogleLoginRequestDTO;
import com.example.Sales_Platform.DTO.LoginResponseDTO;
import com.example.Sales_Platform.Intities.Role;
import com.example.Sales_Platform.Intities.User;
import com.example.Sales_Platform.Intities.UserStatus;
import com.example.Sales_Platform.Repo.CustomerRepo;
import com.example.Sales_Platform.Repo.UserRepo;
import com.example.Sales_Platform.Security.GoogleIdEncryptor;
import com.example.Sales_Platform.Security.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class AuthServicesImpl implements AuthServices {

    @Autowired
    private UserRepo userRepo;

        @Autowired
        private CustomerRepo customerRepo;

        @Autowired
        private CustomerServices customerServices;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private GoogleIdEncryptor googleIdEncryptor;

    @Value("${google.client-id}")
    private String googleClientId;


    // =========================
    // GOOGLE LOGIN
    // =========================

    @Override
    public LoginResponseDTO googleLogin(
            GoogleLoginRequestDTO request) {

        try {

            GoogleIdTokenVerifier verifier =
                    new GoogleIdTokenVerifier.Builder(
                            new NetHttpTransport(),
                            GsonFactory.getDefaultInstance()
                    )
                    .setAudience(
                            Collections.singletonList(googleClientId)
                    )
                    .build();


            GoogleIdToken googleToken =
                    verifier.verify(request.getIdToken());


            if (googleToken == null) {

                throw new RuntimeException(
                        "Invalid Google Token"
                );
            }


            GoogleIdToken.Payload payload =
                    googleToken.getPayload();


            String googleId = payload.getSubject();

            String email = payload.getEmail();

            String name = (String) payload.get("name");


            User user = userRepo.findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User is not registered"
                            )
                    );


            String storedEncryptedGoogleId =
                    user.getGoogleId();

            String storedGoogleId =
                    storedEncryptedGoogleId == null
                            ? null
                            : googleIdEncryptor.decrypt(
                                    storedEncryptedGoogleId
                            );


            if (storedGoogleId == null ||
                    !storedGoogleId.equals(googleId)) {

                throw new RuntimeException(
                        "Google account does not match"
                );
            }


            if (user.getStatus() != UserStatus.ACTIVE) {

                throw new RuntimeException(
                        "Account is not active"
                );
            }

                        ensureCustomerProfile(user);


            String token =
                    jwtService.generateToken(
                            user.getEmail(),
                            user.getRole().name()
                    );


            LoginResponseDTO response =
                    new LoginResponseDTO();

            response.setToken(token);
            response.setUserId(user.getId());
            response.setName(user.getName());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole().name());


            return response;


        } catch (Exception e) {

            throw new RuntimeException(
                    "Google Login Failed: "
                            + e.getMessage()
            );
        }
    }


    // =========================
    // GOOGLE REGISTER
    // =========================

   
@Override
public LoginResponseDTO googleRegister(
        GoogleLoginRequestDTO request) {

    try {
        // 1. Google Token Verifier
        GoogleIdTokenVerifier verifier =
                new GoogleIdTokenVerifier.Builder(
                        new NetHttpTransport(),
                        GsonFactory.getDefaultInstance()
                )
                .setAudience(
                        Collections.singletonList(googleClientId)
                )
                .build();


        // 2. Verify Google ID Token
        GoogleIdToken googleToken =
                verifier.verify(request.getIdToken());


        if (googleToken == null) {

            throw new RuntimeException(
                    "Invalid Google Token"
            );
        }


        // 3. Get Google Payload
        GoogleIdToken.Payload payload =
                googleToken.getPayload();


        String googleId = payload.getSubject();

        String email = payload.getEmail();

        String name = (String) payload.get("name");


        // 4. Check user by email
        User user = userRepo.findByEmail(email)
                .orElse(null);


        // =================================================
        // CASE 1: USER ALREADY EXISTS
        // =================================================

        if (user != null) {

            String storedEncryptedGoogleId =
                    user.getGoogleId();


            // ---------------------------------------------
            // Existing user + Google ID already exists
            // ---------------------------------------------

            if (storedEncryptedGoogleId != null) {

                throw new RuntimeException(
                        "User already registered. Please Login"
                );
            }


            // ---------------------------------------------
            // Existing user + Google ID is NULL
            // First-time Google Registration
            // ---------------------------------------------

            String encryptedGoogleId =
                    googleIdEncryptor.encrypt(googleId);

            user.setGoogleId(encryptedGoogleId);

            user.setStatus(UserStatus.ACTIVE);

            User savedUser =
                    userRepo.save(user);

            ensureCustomerProfile(savedUser);


            // Generate JWT
            String token =
                    jwtService.generateToken(
                            savedUser.getEmail(),
                            savedUser.getRole().name()
                    );


            // Response
            LoginResponseDTO response =
                    new LoginResponseDTO();

            response.setToken(token);

            response.setUserId(savedUser.getId());

            response.setName(savedUser.getName());

            response.setEmail(savedUser.getEmail());

            response.setRole(
                    savedUser.getRole().name()
            );


            return response;
        }


        // =================================================
        // CASE 2: NEW USER
        // =================================================

        User newUser = new User();

        newUser.setName(name);

        newUser.setEmail(email);


        // Encrypt Google ID
        String encryptedGoogleId =
                googleIdEncryptor.encrypt(googleId);

        newUser.setGoogleId(encryptedGoogleId);


        // Public registration = CUSTOMER
        newUser.setRole(Role.CUSTOMER);

        newUser.setStatus(UserStatus.ACTIVE);


        // Save
        User savedUser =
                userRepo.save(newUser);

        ensureCustomerProfile(savedUser);


        // Generate JWT
        String token =
                jwtService.generateToken(
                        savedUser.getEmail(),
                        savedUser.getRole().name()
                );


        // Response
        LoginResponseDTO response =
                new LoginResponseDTO();

        response.setToken(token);

        response.setUserId(savedUser.getId());

        response.setName(savedUser.getName());

        response.setEmail(savedUser.getEmail());

        response.setRole(
                savedUser.getRole().name()
        );


        return response;


        } catch (Exception e) {

        throw new RuntimeException(
                "Google Registration Failed: "
                        + e.getMessage()
        );
    }
}

private void ensureCustomerProfile(User user) {
        if (user.getRole() == Role.CUSTOMER &&
                        customerRepo.findByUser_Id(user.getId()).isEmpty()) {
                CustomerRequestDTO request = new CustomerRequestDTO();
                request.setUserId(user.getId());
                customerServices.createCustomer(request);
        }
}


}

