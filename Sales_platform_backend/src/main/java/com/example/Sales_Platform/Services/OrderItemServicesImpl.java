package com.example.Sales_Platform.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Sales_Platform.DTO.OrderItemResponseDTO;
import com.example.Sales_Platform.Intities.OrderItem;
import com.example.Sales_Platform.Repo.OrderItemRepo;

@Service
public class OrderItemServicesImpl
        implements OrderItemServices {

    @Autowired
    OrderItemRepo orderItemRepo;


    // GET ITEMS BY ORDER
    @Override
    public List<OrderItemResponseDTO>
    getItemsByOrder(Long orderId) {

        return orderItemRepo
                .findByOrderId(orderId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
     }


    // GET ITEMS BY PRODUCT
    @Override
    public List<OrderItemResponseDTO>
    getItemsByProduct(Long productId) {

        return orderItemRepo
                .findByProductId(productId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // ENTITY → DTO
    private OrderItemResponseDTO
    mapToResponseDTO(OrderItem item) {

        OrderItemResponseDTO dto =
                new OrderItemResponseDTO();

        dto.setOrderItemId(
                item.getId());

        dto.setProductId(
                item.getProduct().getId());

        dto.setProductName(
                item.getProduct().getName());

        dto.setQuantity(
                item.getQuantity());

        dto.setUnitPrice(
                item.getUnitPrice());

        dto.setDiscount(
                item.getDiscount());

        dto.setTotalPrice(
                item.getTotalPrice());

        return dto;
    }
}