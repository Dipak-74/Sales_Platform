package com.example.Sales_Platform.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.Department;
import com.example.Sales_Platform.Intities.DepartmentStatus;

public interface DepartmentRepo extends JpaRepository<Department, Long> {
	 Optional<Department> findByName(String name);
	 List<Department> findByStatus(DepartmentStatus status);
}
