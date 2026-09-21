package com.example.Sales_Platform.Repo;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.Inventory;

public interface InventoryRepo extends JpaRepository<Inventory, Long>{
	Optional<Inventory> findByProduct_Id(Long productId);

   
    List<Inventory> findByQuantityLessThanEqual(Integer quantity);
}
