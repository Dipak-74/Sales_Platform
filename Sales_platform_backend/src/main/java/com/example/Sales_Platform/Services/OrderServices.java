package com.example.Sales_Platform.Services;

import java.util.List;

import com.example.Sales_Platform.DTO.OrderCreateRequestDTO;
import com.example.Sales_Platform.DTO.OrderResponseDTO;
import com.example.Sales_Platform.Intities.OrderStatus;

public interface OrderServices {

    // Create order
    OrderResponseDTO createOrder(
            OrderCreateRequestDTO request);

    // Get all orders
    List<OrderResponseDTO> getAllOrders();

    // Get order by ID
    OrderResponseDTO getOrderById(Long id);

    // Get order by order number
    OrderResponseDTO getOrderByNumber(
            String orderNumber);

    // Customer orders
    List<OrderResponseDTO> getCustomerOrders(
            Long customerId);

    // Employee orders
    List<OrderResponseDTO> getEmployeeOrders(
            Long employeeId);

    // Filter by status
    List<OrderResponseDTO> getOrdersByStatus(
            OrderStatus status);

    // Update status
    OrderResponseDTO updateOrderStatus(
            Long id,
            OrderStatus status);

    // Cancel order
    OrderResponseDTO cancelOrder(Long id);
}