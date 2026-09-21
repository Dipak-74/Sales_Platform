package com.example.Sales_Platform.Repo;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.Product;
import com.example.Sales_Platform.Intities.ProductStatus;

public interface ProductRepo extends JpaRepository<Product, Long>{
	Optional<Product> findBySku(String sku);

    List<Product> findByCategory_Id(Long categoryId);

  
    List<Product> findByStatus(ProductStatus status);

   
    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByCategory_IdAndStatus(
            Long categoryId,
            ProductStatus status);
}
