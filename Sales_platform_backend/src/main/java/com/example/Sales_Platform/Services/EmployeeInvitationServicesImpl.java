package com.example.Sales_Platform.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Sales_Platform.DTO.EmployeeInvitationRequestDTO;
import com.example.Sales_Platform.DTO.EmployeeInvitationResponseDTO;
import com.example.Sales_Platform.Intities.Department;
import com.example.Sales_Platform.Intities.EmployeeInvitation;
import com.example.Sales_Platform.Intities.InvitationStatus;
import com.example.Sales_Platform.Intities.User;
import com.example.Sales_Platform.Repo.DepartmentRepo;
import com.example.Sales_Platform.Repo.EmployeeInvitationRepo;
import com.example.Sales_Platform.Repo.UserRepo;

@Service
public class EmployeeInvitationServicesImpl
        implements EmployeeInvitationServices {

    @Autowired
    EmployeeInvitationRepo employeeInvitationRepo;

    @Autowired
    UserRepo userRepo;

    @Autowired
    DepartmentRepo departmentRepo;


    // CREATE INVITATION
    @Override
    public EmployeeInvitationResponseDTO createInvitation(
            EmployeeInvitationRequestDTO request) {

        // 1. Manager find
        User manager = userRepo.findById(request.getManagerId())
                .orElseThrow(() ->
                        new RuntimeException("Manager not found"));


        // 2. Department find
        Department department = departmentRepo
                .findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));


        // 3. New invitation object
        EmployeeInvitation invitation =
                new EmployeeInvitation();


        // 4. Request DTO → Entity
        invitation.setName(request.getName());
        invitation.setEmail(request.getEmail());
        invitation.setManager(manager);
        invitation.setDepartment(department);
        invitation.setDesignation(request.getDesignation());


        // Status backend स्वतः set करेल
        invitation.setStatus(InvitationStatus.PENDING);


        // 5. Save in database
        EmployeeInvitation saved =
                employeeInvitationRepo.save(invitation);


        // 6. Entity → Response DTO
        return mapToResponseDTO(saved);
    }


    // GET INVITATION BY ID
    @Override
    public EmployeeInvitationResponseDTO getInvitationById(
            Long id) {

        EmployeeInvitation invitation =
                employeeInvitationRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invitation not found"));

        return mapToResponseDTO(invitation);
    }


    // GET INVITATIONS BY MANAGER
    @Override
    public List<EmployeeInvitationResponseDTO>
    getInvitationsByManager(Long managerId) {

        return employeeInvitationRepo
                .findByManagerId(managerId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // UPDATE INVITATION STATUS
    @Override
    public EmployeeInvitationResponseDTO
    updateInvitationStatus(
            Long id,
            InvitationStatus status) {

        EmployeeInvitation invitation =
                employeeInvitationRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invitation not found"));


        invitation.setStatus(status);


        EmployeeInvitation updated =
                employeeInvitationRepo.save(invitation);


        return mapToResponseDTO(updated);
    }


    // ENTITY → DTO
    private EmployeeInvitationResponseDTO
    mapToResponseDTO(EmployeeInvitation invitation) {

        EmployeeInvitationResponseDTO dto =
                new EmployeeInvitationResponseDTO();


        dto.setInvitationId(invitation.getId());

        dto.setName(invitation.getName());

        dto.setEmail(invitation.getEmail());

        dto.setManagerId(
                invitation.getManager().getId()
        );

        dto.setDepartmentId(
                invitation.getDepartment().getId()
        );

        dto.setDesignation(
                invitation.getDesignation()
        );

        dto.setStatus(
                invitation.getStatus()
        );


        return dto;
    }
}