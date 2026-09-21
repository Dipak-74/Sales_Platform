package com.example.Sales_Platform.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Sales_Platform.DTO.DepartmentResponseDTO;
import com.example.Sales_Platform.Services.DepartmentServices;

@RestController
@RequestMapping("/api/departments" )
public class DepartmentController {

    @Autowired
    private DepartmentServices departmentServices;

    @GetMapping
    public List<DepartmentResponseDTO> getAllDepartments() {
        return departmentServices.getAllDepartments();
    }
}