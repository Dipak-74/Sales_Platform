package com.example.Sales_Platform.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Sales_Platform.DTO.DepartmentRequestDTO;
import com.example.Sales_Platform.DTO.DepartmentResponseDTO;
import com.example.Sales_Platform.Intities.Department;
import com.example.Sales_Platform.Intities.DepartmentStatus;
import com.example.Sales_Platform.Repo.DepartmentRepo;

@Service
public class DepartmentServicesImpl implements DepartmentServices {

    @Autowired
    private DepartmentRepo departmentRepo;

    @Override
    public DepartmentResponseDTO createDepartment(
            DepartmentRequestDTO request) {

                validateName(request == null ? null : request.getName(), "Department");
                String name = request.getName().trim();
                if (departmentRepo.findByName(name).isPresent()) {
                        throw new RuntimeException("Department already exists");
                }

        Department department = new Department();

                department.setName(name);
        department.setDescription(request.getDescription());

        // Backend controlled
        department.setStatus(DepartmentStatus.ACTIVE);

        Department savedDepartment =
                departmentRepo.save(department);

        return mapToResponseDTO(savedDepartment);
    }

    @Override
    public List<DepartmentResponseDTO> getAllDepartments() {

        return departmentRepo.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public DepartmentResponseDTO getDepartmentById(Long id) {

        Department department = departmentRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));

        return mapToResponseDTO(department);
    }

    @Override
    public DepartmentResponseDTO updateDepartment(
            Long id,
            DepartmentRequestDTO request) {

        validateName(request == null ? null : request.getName(), "Department");

        Department department = departmentRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));

                String name = request.getName().trim();
                departmentRepo.findByName(name).ifPresent(existing -> {
                        if (!existing.getId().equals(id)) {
                                throw new RuntimeException("Department already exists");
                        }
                });
                department.setName(name);
        department.setDescription(request.getDescription());

        Department updatedDepartment =
                departmentRepo.save(department);

        return mapToResponseDTO(updatedDepartment);
    }

    @Override
    public DepartmentResponseDTO updateDepartmentStatus(
            Long id,
            DepartmentStatus status) {

        Department department = departmentRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));

        department.setStatus(status);

        Department updatedDepartment =
                departmentRepo.save(department);

        return mapToResponseDTO(updatedDepartment);
    }

    private DepartmentResponseDTO mapToResponseDTO(Department department) {

        return new DepartmentResponseDTO(
                department.getId(),
                department.getName(),
                department.getDescription(),
                department.getStatus()
        );
    }

        private void validateName(String name, String type) {
                if (name == null || name.isBlank()) {
                        throw new RuntimeException(type + " name is required");
                }
        }
}
