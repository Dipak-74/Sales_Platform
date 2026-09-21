package com.example.Sales_Platform.Services;

import com.example.Sales_Platform.DTO.*;
import com.example.Sales_Platform.Intities.*;
import java.util.*;
public interface DepartmentServices {
	 DepartmentResponseDTO createDepartment(DepartmentRequestDTO request);

	    List<DepartmentResponseDTO> getAllDepartments();

	    DepartmentResponseDTO getDepartmentById(Long id);

	    DepartmentResponseDTO updateDepartment(
	            Long id,
	            DepartmentRequestDTO request
	    );

	    DepartmentResponseDTO updateDepartmentStatus(
	            Long id,
	            DepartmentStatus status
	    );
}
