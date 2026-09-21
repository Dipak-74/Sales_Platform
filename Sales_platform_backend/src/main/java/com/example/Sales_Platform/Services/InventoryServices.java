package com.example.Sales_Platform.Services;

import java.util.List;

import com.example.Sales_Platform.DTO.InventoryResponseDTO;
import com.example.Sales_Platform.DTO.StockRequestDTO;

public interface InventoryServices {

    // Current stock
    InventoryResponseDTO getInventoryByProduct(Long productId);

    // All inventory
    List<InventoryResponseDTO> getAllInventory();

    // Add stock
    InventoryResponseDTO addStock(
            StockRequestDTO request);

    // Remove stock
    InventoryResponseDTO removeStock(
            StockRequestDTO request);

    // Manual adjustment
    InventoryResponseDTO adjustStock(
            StockRequestDTO request);

    // Low stock products
    List<InventoryResponseDTO> getLowStockProducts();
}