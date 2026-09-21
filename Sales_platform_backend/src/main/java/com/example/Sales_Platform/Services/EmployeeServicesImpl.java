package com.example.Sales_Platform.Services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.Sales_Platform.DTO.EmployeeRequestDTO;
import com.example.Sales_Platform.DTO.EmployeeResponseDTO;
import com.example.Sales_Platform.Intities.Department;
import com.example.Sales_Platform.Intities.Employee;
import com.example.Sales_Platform.Intities.EmployeeStatus;
import com.example.Sales_Platform.Intities.Role;
import com.example.Sales_Platform.Intities.User;
import com.example.Sales_Platform.Repo.DepartmentRepo;
import com.example.Sales_Platform.Repo.EmployeeRepo;
import com.example.Sales_Platform.Repo.UserRepo;

@Service
public class EmployeeServicesImpl implements EmployeeServices {

    @Autowired
    EmployeeRepo employeeRepo;

    @Autowired
    UserRepo userRepo;

    @Autowired
    DepartmentRepo departmentRepo;


    // CREATE EMPLOYEE
    @Override
    public EmployeeResponseDTO createEmployee(
            EmployeeRequestDTO request) {

        if (request == null) {
            throw new RuntimeException("Employee request is required");
        }

        if (request.getUserId() == null) {
            throw new RuntimeException("User ID is required. Create the employee user first.");
        }

        if (request.getDepartmentId() == null) {
            throw new RuntimeException("Department ID is required");
        }

        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        if (user.getRole() != Role.EMPLOYEE) {
            throw new RuntimeException("Only EMPLOYEE users can be linked to an employee record");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("Authenticated manager is required");
        }

        User manager = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (manager.getRole() != Role.MANAGER) {
            throw new RuntimeException("Only MANAGER can create employees");
        }

        if (request.getManagerId() != null && !request.getManagerId().equals(manager.getId())) {
            throw new RuntimeException("Manager ownership mismatch");
        }

        Department department = departmentRepo.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Employee employee = new Employee();
        employee.setUser(user);
        employee.setManager(manager);
        employee.setDepartment(department);
        employee.setDesignation(request.getDesignation() != null ? request.getDesignation() : "General Staff");
        employee.setJoiningDate(request.getJoiningDate() != null ? request.getJoiningDate() : LocalDate.now());
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setEmployeeCode("EMP" + System.currentTimeMillis());

        Employee savedEmployee = employeeRepo.save(employee);
        return mapToResponseDTO(savedEmployee);
    }


    // GET EMPLOYEE BY ID
    @Override
    public EmployeeResponseDTO getEmployeeById(Long id) {

        Employee employee =
                employeeRepo.findByUserId(id).orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found"));

        return mapToResponseDTO(employee);
    }


    // GET EMPLOYEE BY USER ID
    @Override
    public EmployeeResponseDTO getEmployeeByUserId(Long userId) {

        Employee employee =
                employeeRepo.findByUserId(userId).orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found"));

        return mapToResponseDTO(employee);
    }


    // GET EMPLOYEES BY MANAGER
    @Override
    public List<EmployeeResponseDTO>
    getEmployeesByManager(Long managerId) {

        return employeeRepo
                .findByManagerId(managerId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // GET EMPLOYEES BY DEPARTMENT
    @Override
    public List<EmployeeResponseDTO>
    getEmployeesByDepartment(Long departmentId) {

        return employeeRepo
                .findByDepartmentId(departmentId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // UPDATE EMPLOYEE
    @Override
    public EmployeeResponseDTO updateEmployee(
            Long id,
            EmployeeRequestDTO request) {

        Employee employee =
                employeeRepo.findByUserId(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found"));


        // Find Manager
        User manager = userRepo.findById(
                request.getManagerId()
        ).orElseThrow(() ->
                new RuntimeException("Manager not found"));


        // Find Department
        Department department =
                departmentRepo.findById(
                        request.getDepartmentId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Department not found"));


        employee.setManager(manager);
        employee.setDepartment(department);
        employee.setDesignation(
                request.getDesignation()
        );
        employee.setJoiningDate(
                request.getJoiningDate()
        );


        Employee updatedEmployee =
                employeeRepo.save(employee);


        return mapToResponseDTO(updatedEmployee);
    }


    // UPDATE STATUS
    @Override
    public EmployeeResponseDTO updateEmployeeStatus(
            Long id,
            EmployeeStatus status) {

        Employee employee =
                employeeRepo.findByUserId(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found"));


        employee.setStatus(status);


        Employee updatedEmployee =
                employeeRepo.save(employee);


        return mapToResponseDTO(updatedEmployee);
    }


    // ENTITY → DTO
    private EmployeeResponseDTO mapToResponseDTO(
            Employee employee) {

        EmployeeResponseDTO dto =
                new EmployeeResponseDTO();


        dto.setEmployeeId(employee.getId());

        dto.setEmployeeCode(
                employee.getEmployeeCode()
        );

        dto.setUserId(
                employee.getUser().getId()
        );

        dto.setName(
                employee.getUser().getName()
        );

        dto.setEmail(
                employee.getUser().getEmail()
        );

        dto.setManagerId(
                employee.getManager().getId()
        );

        dto.setDepartmentId(
                employee.getDepartment().getId()
        );

        dto.setDesignation(
                employee.getDesignation()
        );

        dto.setJoiningDate(
                employee.getJoiningDate()
        );

        dto.setStatus(
                employee.getStatus()
        );


        return dto;
    }
}