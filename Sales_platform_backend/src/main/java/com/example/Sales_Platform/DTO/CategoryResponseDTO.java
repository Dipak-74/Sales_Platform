package com.example.Sales_Platform.DTO;

import com.example.Sales_Platform.Intities.CategoryStatus;


public class CategoryResponseDTO {

    private Long categoryId;

    private String name;

    private String description;

    private CategoryStatus status;

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public CategoryStatus getStatus() {
		return status;
	}

	public void setStatus(CategoryStatus status) {
		this.status = status;
	}
    
}