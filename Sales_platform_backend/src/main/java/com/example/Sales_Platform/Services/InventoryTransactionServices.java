package com.example.Sales_Platform.Services;

import java.util.List;

import com.example.Sales_Platform.DTO.InventoryTransactionResponseDTO;
import com.example.Sales_Platform.Intities.InventoryTransactionType;

public interface InventoryTransactionServices {

    List<InventoryTransactionResponseDTO>
    getTransactionsByProduct(Long productId);

    List<InventoryTransactionResponseDTO>
    getTransactionsByUser(Long userId);

    List<InventoryTransactionResponseDTO>
    getTransactionsByType(
            InventoryTransactionType transactionType);
}