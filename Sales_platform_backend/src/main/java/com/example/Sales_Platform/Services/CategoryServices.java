package com.example.Sales_Platform.Services;

import java.util.List;

import com.example.Sales_Platform.DTO.CategoryRequestDTO;
import com.example.Sales_Platform.DTO.CategoryResponseDTO;
import com.example.Sales_Platform.Intities.CategoryStatus;

public interface CategoryServices {

    CategoryResponseDTO createCategory(CategoryRequestDTO request);

    List<CategoryResponseDTO> getAllCategories();

    CategoryResponseDTO getCategoryById(Long id);

    CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO request);

    CategoryResponseDTO updateCategoryStatus(Long id, CategoryStatus status);
}