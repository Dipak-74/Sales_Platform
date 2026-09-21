package com.example.Sales_Platform.Services;

import java.util.List;

import com.example.Sales_Platform.DTO.EmployeeRequestDTO;
import com.example.Sales_Platform.DTO.EmployeeResponseDTO;
import com.example.Sales_Platform.Intities.EmployeeStatus;

public interface EmployeeServices {
	EmployeeResponseDTO createEmployee(
            EmployeeRequestDTO request);

    EmployeeResponseDTO getEmployeeById(
            Long id);

    EmployeeResponseDTO getEmployeeByUserId(
            Long userId);

    List<EmployeeResponseDTO> getEmployeesByManager(
            Long managerId);

    List<EmployeeResponseDTO> getEmployeesByDepartment(
            Long departmentId);

    EmployeeResponseDTO updateEmployee(
            Long id,
            EmployeeRequestDTO request);

    EmployeeResponseDTO updateEmployeeStatus(
            Long id,
            EmployeeStatus status);
}

