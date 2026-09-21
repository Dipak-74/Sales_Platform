package com.example.Sales_Platform.Repo;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Sales_Platform.Intities.Employee;
import com.example.Sales_Platform.Intities.EmployeeStatus;

public interface EmployeeRepo extends JpaRepository<Employee, Long> {
	Optional<Employee>findByUserId(Long userId);
	Optional<Employee> findByEmployeeCode(String employeeCode);

    List<Employee> findByManagerId(Long managerId);

    List<Employee> findByDepartmentId(Long departmentId);
    
    List<Employee> findByStatus(EmployeeStatus status);
}
