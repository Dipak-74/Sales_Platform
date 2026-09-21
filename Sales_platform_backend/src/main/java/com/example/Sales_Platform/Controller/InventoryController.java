package com.example.Sales_Platform.Controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Sales_Platform.DTO.InventoryResponseDTO;
import com.example.Sales_Platform.DTO.InventoryTransactionResponseDTO;
import com.example.Sales_Platform.DTO.StockRequestDTO;
import com.example.Sales_Platform.Intities.InventoryTransactionType;
import com.example.Sales_Platform.Services.InventoryServices;
import com.example.Sales_Platform.Services.InventoryTransactionServices;

@RestController
@RequestMapping("/api")
public class InventoryController {

    private final InventoryServices inventoryServices;
    private final InventoryTransactionServices inventoryTransactionServices;

    public InventoryController(
            InventoryServices inventoryServices,
            InventoryTransactionServices inventoryTransactionServices) {
        this.inventoryServices = inventoryServices;
        this.inventoryTransactionServices = inventoryTransactionServices;
    }

    @GetMapping("/inventory/product/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public InventoryResponseDTO getInventoryByProduct(
            @PathVariable Long productId) {
        return inventoryServices.getInventoryByProduct(productId);
    }

    @GetMapping("/inventory")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public List<InventoryResponseDTO> getAllInventory() {
        return inventoryServices.getAllInventory();
    }

    @PostMapping("/inventory/stock/add")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public InventoryResponseDTO addStock(
            @RequestBody StockRequestDTO request) {
        return inventoryServices.addStock(request);
    }

    @PostMapping("/inventory/stock/remove")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public InventoryResponseDTO removeStock(
            @RequestBody StockRequestDTO request) {
        return inventoryServices.removeStock(request);
    }

    @PostMapping("/inventory/stock/adjust")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public InventoryResponseDTO adjustStock(
            @RequestBody StockRequestDTO request) {
        return inventoryServices.adjustStock(request);
    }

    @GetMapping("/inventory/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public List<InventoryResponseDTO> getLowStockProducts() {
        return inventoryServices.getLowStockProducts();
    }

    @GetMapping("/inventory/transactions/product/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public List<InventoryTransactionResponseDTO> getTransactionsByProduct(
            @PathVariable Long productId) {
        return inventoryTransactionServices.getTransactionsByProduct(productId);
    }

    @GetMapping("/inventory/transactions/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public List<InventoryTransactionResponseDTO> getTransactionsByUser(
            @PathVariable Long userId) {
        return inventoryTransactionServices.getTransactionsByUser(userId);
    }

    @GetMapping("/inventory/transactions/type")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE')")
    public List<InventoryTransactionResponseDTO> getTransactionsByType(
            @RequestParam InventoryTransactionType transactionType) {
        return inventoryTransactionServices.getTransactionsByType(transactionType);
    }
}
