package com.example.Sales_Platform.Services;

import java.util.List;

import com.example.Sales_Platform.DTO.OrderItemResponseDTO;

public interface OrderItemServices {

    List<OrderItemResponseDTO> getItemsByOrder(
            Long orderId);

    List<OrderItemResponseDTO> getItemsByProduct(
            Long productId);
}