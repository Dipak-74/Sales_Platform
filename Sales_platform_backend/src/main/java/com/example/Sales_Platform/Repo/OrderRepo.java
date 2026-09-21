package com.example.Sales_Platform.Repo;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.Order;
import com.example.Sales_Platform.Intities.OrderStatus;

public interface OrderRepo extends JpaRepository<Order, Long>{
	Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByCustomerId(Long customerId);

    List<Order> findByEmployeeId(Long employeeId);

    List<Order> findByStatus(OrderStatus status);
}
