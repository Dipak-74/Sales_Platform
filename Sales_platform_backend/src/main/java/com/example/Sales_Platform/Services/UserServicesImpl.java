
package com.example.Sales_Platform.Services;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.Sales_Platform.DTO.UserRequestDTO;
import com.example.Sales_Platform.DTO.UserResponseDTO;
import com.example.Sales_Platform.Intities.Role;
import com.example.Sales_Platform.Intities.User;
import com.example.Sales_Platform.Intities.UserStatus;
import com.example.Sales_Platform.Repo.UserRepo;
import com.example.Sales_Platform.Security.GoogleIdEncryptor;

@Service
public class UserServicesImpl implements UserServices {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private GoogleIdEncryptor googleIdEncryptor;


    // =====================================================
    // CREATE USER
    // =====================================================

    @Override
    public UserResponseDTO createUser(UserRequestDTO request) {

        if (request == null || request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("User name is required");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("User email is required");
        }

        User existingUser = userRepo.findByEmail(request.getEmail().trim())
                .orElse(null);

        if (existingUser != null) {
            throw new RuntimeException("User already exists with this email");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim());

        Role requestedRole = request.getRole() != null ? request.getRole() : Role.MANAGER;
        if (requestedRole != Role.MANAGER) {
            throw new RuntimeException("Only MANAGER creation is allowed through this admin API");
        }
        user.setRole(Role.MANAGER);

        user.setStatus(request.getStatus() != null ? request.getStatus() : UserStatus.ACTIVE);

        // Google ID only when provided
        if (request.getGoogleId() != null && !request.getGoogleId().isBlank()) {
            user.setGoogleId(googleIdEncryptor.encrypt(request.getGoogleId()));
        }

        // Find currently logged-in user from JWT
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Authenticated admin is required");
        }

        User creator = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Creator user not found"));

        if (creator.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only ADMIN can create managers");
        }

        user.setCreatedBy(creator);

        User savedUser = userRepo.save(user);

        return mapToResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO createEmployeeUser(UserRequestDTO request) {

        if (request == null || request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Employee name is required");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Employee email is required");
        }

        User existingUser = userRepo.findByEmail(request.getEmail().trim()).orElse(null);
        if (existingUser != null) {
            throw new RuntimeException("User already exists with this email");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Authenticated manager is required");
        }

        User manager = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (manager.getRole() != Role.MANAGER) {
            throw new RuntimeException("Only MANAGER can create employee users");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim());
        user.setRole(Role.EMPLOYEE);
        user.setStatus(UserStatus.ACTIVE);
        user.setCreatedBy(manager);

        User savedUser = userRepo.save(user);

        return mapToResponseDTO(savedUser);
    }


    // =====================================================
    // GET USER BY ID
    // =====================================================

    @Override
    public UserResponseDTO getUserById(Long id) {

        User user = userRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id
                        )
                );

        return mapToResponseDTO(user);
    }


    // =====================================================
    // GET USER BY EMAIL
    // =====================================================

    @Override
    public UserResponseDTO getUserByEmail(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );

        return mapToResponseDTO(user);
    }


    // =====================================================
    // GET USER BY GOOGLE ID
    // =====================================================

    @Override
    public UserResponseDTO getUserByGoogleId(String googleId) {

        String encryptedGoogleId = googleIdEncryptor.encrypt(googleId);

        User user = userRepo.findByGoogleId(encryptedGoogleId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with Google ID"
                        )
                );

        return mapToResponseDTO(user);
    }


    // =====================================================
    // GET USERS BY ROLE
    // =====================================================

    @Override
    public List<UserResponseDTO> getUsersByRole(Role role) {

        return userRepo.findByRole(role)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // =====================================================
    // GET USERS BY STATUS
    // =====================================================

    @Override
    public List<UserResponseDTO> getUsersByStatus(
            UserStatus status) {

        return userRepo.findByStatus(status)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // =====================================================
    // GET USERS CREATED BY
    // =====================================================

    @Override
    public List<UserResponseDTO> getUsersCreatedBy(
            Long createdById) {

        return userRepo.findByCreatedBy_Id(createdById)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // =====================================================
    // UPDATE USER STATUS
    // =====================================================

    @Override
    public void updateUserStatus(
            Long id,
            UserStatus status) {

        User user = userRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id
                        )
                );

        user.setStatus(status);

        userRepo.save(user);
    }


    // =====================================================
    // ENTITY → RESPONSE DTO
    // =====================================================

    private UserResponseDTO mapToResponseDTO(User user) {

        UserResponseDTO dto = new UserResponseDTO();

        dto.setUserId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());

        return dto;
    }
}
