package com.example.Sales_Platform.Services;


import java.util.List;

import com.example.Sales_Platform.DTO.UserRequestDTO;
import com.example.Sales_Platform.DTO.UserResponseDTO;
import com.example.Sales_Platform.Intities.Role;
import com.example.Sales_Platform.Intities.UserStatus;

public interface UserServices {

    UserResponseDTO createUser(UserRequestDTO request);

    UserResponseDTO createEmployeeUser(UserRequestDTO request);

    UserResponseDTO getUserById(Long id);

    UserResponseDTO getUserByEmail(String email);

    UserResponseDTO getUserByGoogleId(String googleId);

    List<UserResponseDTO> getUsersByRole(Role role);

    List<UserResponseDTO> getUsersByStatus(UserStatus status);

    List<UserResponseDTO> getUsersCreatedBy(Long createdById);

    void updateUserStatus(Long id, UserStatus status);
}
