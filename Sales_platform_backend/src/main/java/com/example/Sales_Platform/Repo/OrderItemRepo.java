package com.example.Sales_Platform.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.OrderItem;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long>{
	List<OrderItem> findByOrderId(Long orderId);

    List<OrderItem> findByProductId(Long productId);
}
