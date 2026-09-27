
package com.example.Sales_Platform.Controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Sales_Platform.DTO.DepartmentRequestDTO;
import com.example.Sales_Platform.DTO.DepartmentResponseDTO;
import com.example.Sales_Platform.DTO.UserRequestDTO;
import com.example.Sales_Platform.DTO.UserResponseDTO;
import com.example.Sales_Platform.Intities.DepartmentStatus;
import com.example.Sales_Platform.Intities.Role;
import com.example.Sales_Platform.Intities.UserStatus;
import com.example.Sales_Platform.Services.DepartmentServices;
import com.example.Sales_Platform.Services.UserServices;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserServices userServices;
    private final DepartmentServices departmentServices;

    public AdminController(
            UserServices userServices,
            DepartmentServices departmentServices) {
        this.userServices = userServices;
        this.departmentServices = departmentServices;
    }

    @PostMapping("/users")
    public UserResponseDTO createUser(
            @RequestBody UserRequestDTO request) {
        return userServices.createUser(request);
    }

    @GetMapping("/users/{id}")
    public UserResponseDTO getUserById(
            @PathVariable Long id) {
        return userServices.getUserById(id);
    }

    @GetMapping("/users/email")
    public UserResponseDTO getUserByEmail(
            @RequestParam String email) {
        return userServices.getUserByEmail(email);
    }

    @GetMapping("/users/google-id")
    public UserResponseDTO getUserByGoogleId(
            @RequestParam String googleId) {
        return userServices.getUserByGoogleId(googleId);
    }

    @GetMapping("/users/role/{role}")
    public List<UserResponseDTO> getUsersByRole(
            @PathVariable Role role) {
        return userServices.getUsersByRole(role);
    }

    @GetMapping("/users/status")
    public List<UserResponseDTO> getUsersByStatus(
            @RequestParam UserStatus status) {
        return userServices.getUsersByStatus(status);
    }

    @GetMapping("/users/created-by/{adminId}")
    public List<UserResponseDTO> getUsersCreatedBy(
            @PathVariable Long adminId) {
        return userServices.getUsersCreatedBy(adminId);
    }

    @PutMapping("/users/{id}/status")
    public void updateUserStatus(
            @PathVariable Long id,
            @RequestParam UserStatus status) {
        userServices.updateUserStatus(id, status);
    }

    @PostMapping("/departments")
    public DepartmentResponseDTO createDepartment(
            @RequestBody DepartmentRequestDTO request) {
        return departmentServices.createDepartment(request);
    }

    @GetMapping("/departments")
    public List<DepartmentResponseDTO> getAllDepartments() {
        return departmentServices.getAllDepartments();
    }

    @GetMapping("/departments/{id}")
    public DepartmentResponseDTO getDepartmentById(
            @PathVariable Long id) {
        return departmentServices.getDepartmentById(id);
    }

    @PutMapping("/departments/{id}")
    public DepartmentResponseDTO updateDepartment(
            @PathVariable Long id,
            @RequestBody DepartmentRequestDTO request) {
        return departmentServices.updateDepartment(id, request);
    }

    @PutMapping("/departments/{id}/status")
    public DepartmentResponseDTO updateDepartmentStatus(
            @PathVariable Long id,
            @RequestParam DepartmentStatus status) {
        return departmentServices.updateDepartmentStatus(id, status);
    }
}

