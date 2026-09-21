package com.example.Sales_Platform.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.Category;
import com.example.Sales_Platform.Intities.CategoryStatus;

public interface CategoryRepo extends JpaRepository<Category, Long> {
	 Optional<Category> findByName(String name);

	    List<Category> findByStatus(CategoryStatus status);
}
