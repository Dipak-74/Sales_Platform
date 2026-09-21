package com.example.Sales_Platform.Repo;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.EmployeeInvitation;

public interface EmployeeInvitationRepo extends JpaRepository<EmployeeInvitation, Long> {
	List<EmployeeInvitation> findByManagerId(Long managerId);
	
	List<EmployeeInvitation> findByDepartment_Id(Long departmentId);
	
    Optional<EmployeeInvitation> findByEmail(String email);

    List<EmployeeInvitation> findByStatus(String status);
}
