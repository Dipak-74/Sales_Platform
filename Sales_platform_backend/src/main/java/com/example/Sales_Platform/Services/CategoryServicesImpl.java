package com.example.Sales_Platform.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Sales_Platform.DTO.CategoryRequestDTO;
import com.example.Sales_Platform.DTO.CategoryResponseDTO;
import com.example.Sales_Platform.Intities.Category;
import com.example.Sales_Platform.Intities.CategoryStatus;
import com.example.Sales_Platform.Repo.CategoryRepo;

@Service
public class CategoryServicesImpl implements CategoryServices {

    @Autowired
    CategoryRepo categoryRepo;

    @Override
    public CategoryResponseDTO createCategory(CategoryRequestDTO request) {

        validateName(request == null ? null : request.getName());
        String name = request.getName().trim();
        if (categoryRepo.findByName(name).isPresent()) {
            throw new RuntimeException("Category already exists");
        }

        Category category = new Category();

        category.setName(name);
        category.setDescription(request.getDescription());
        category.setStatus(CategoryStatus.ACTIVE);

        Category savedCategory = categoryRepo.save(category);

        return mapToResponseDTO(savedCategory);
    }

    @Override
    public List<CategoryResponseDTO> getAllCategories() {

        return categoryRepo.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public CategoryResponseDTO getCategoryById(Long id) {

        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return mapToResponseDTO(category);
    }

    @Override
    public CategoryResponseDTO updateCategory(
            Long id,
            CategoryRequestDTO request) {

        validateName(request == null ? null : request.getName());

        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        String name = request.getName().trim();
        categoryRepo.findByName(name).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new RuntimeException("Category already exists");
            }
        });
        category.setName(name);
        category.setDescription(request.getDescription());

        Category updatedCategory = categoryRepo.save(category);

        return mapToResponseDTO(updatedCategory);
    }

    @Override
    public CategoryResponseDTO updateCategoryStatus(
            Long id,
            CategoryStatus status) {

        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setStatus(status);

        Category updatedCategory = categoryRepo.save(category);

        return mapToResponseDTO(updatedCategory);
    }

    private CategoryResponseDTO mapToResponseDTO(Category category) {

        CategoryResponseDTO dto = new CategoryResponseDTO();

        dto.setCategoryId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setStatus(category.getStatus());

        return dto;
    }

    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new RuntimeException("Category name is required");
        }
    }
}