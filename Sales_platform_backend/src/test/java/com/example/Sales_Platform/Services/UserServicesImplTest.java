package com.example.Sales_Platform.Services;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.Sales_Platform.DTO.UserRequestDTO;
import com.example.Sales_Platform.Intities.Role;
import com.example.Sales_Platform.Intities.User;
import com.example.Sales_Platform.Intities.UserStatus;
import com.example.Sales_Platform.Repo.UserRepo;
import com.example.Sales_Platform.Security.GoogleIdEncryptor;

@ExtendWith(MockitoExtension.class)
class UserServicesImplTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private GoogleIdEncryptor googleIdEncryptor;

    @InjectMocks
    private UserServicesImpl userServices;

    @BeforeEach
    void setupSecurityContext() {
        SecurityContextHolder.clearContext();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "admin@gmail.com",
                        "password",
                        List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                )
        );
    }

    @Test
    void createUser_shouldRejectEmployeeRoleForAdminRequest() {
        UserRequestDTO request = new UserRequestDTO();
        request.setName("Rahul");
        request.setEmail("rahul@gmail.com");
        request.setRole(Role.EMPLOYEE);
        request.setStatus(UserStatus.ACTIVE);

        User admin = new User();
        admin.setId(2L);
        admin.setEmail("admin@gmail.com");
        admin.setRole(Role.ADMIN);
        admin.setStatus(UserStatus.ACTIVE);

        when(userRepo.findByEmail("admin@gmail.com")).thenReturn(Optional.of(admin));

        assertThrows(RuntimeException.class, () -> userServices.createUser(request));
    }
}
