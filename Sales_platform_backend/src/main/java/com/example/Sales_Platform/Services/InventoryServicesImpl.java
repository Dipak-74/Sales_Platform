package com.example.Sales_Platform.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Sales_Platform.DTO.InventoryResponseDTO;
import com.example.Sales_Platform.DTO.StockRequestDTO;
import com.example.Sales_Platform.Intities.Inventory;
import com.example.Sales_Platform.Intities.InventoryTransaction;
import com.example.Sales_Platform.Intities.InventoryTransactionType;
import com.example.Sales_Platform.Intities.Product;
import com.example.Sales_Platform.Intities.User;
import com.example.Sales_Platform.Repo.InventoryRepo;
import com.example.Sales_Platform.Repo.InventoryTransactionRepo;
import com.example.Sales_Platform.Repo.ProductRepo;
import com.example.Sales_Platform.Repo.UserRepo;

@Service
public class InventoryServicesImpl implements InventoryServices {

    @Autowired
    InventoryRepo inventoryRepo;

    @Autowired
    InventoryTransactionRepo inventoryTransactionRepo;

    @Autowired
    ProductRepo productRepo;

    @Autowired
    UserRepo userRepo;


    // GET INVENTORY BY PRODUCT
    @Override
    public InventoryResponseDTO getInventoryByProduct(
            Long productId) {

        Inventory inventory = inventoryRepo
                .findByProduct_Id(productId)
                .orElseThrow(() ->
                        new RuntimeException("Inventory not found"));

        return mapToResponseDTO(inventory);
    }


    // GET ALL INVENTORY
    @Override
    public List<InventoryResponseDTO> getAllInventory() {

        return inventoryRepo.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // ADD STOCK
    @Override
        @Transactional
    public InventoryResponseDTO addStock(
                        StockRequestDTO request) {

                validateQuantity(request);

        Product product = productRepo.findById(
                request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        User user = getAuthenticatedUser();

        Inventory inventory = inventoryRepo
                .findByProduct_Id(request.getProductId())
                .orElseGet(() -> {

                    Inventory newInventory = new Inventory();

                    newInventory.setProduct(product);
                    newInventory.setQuantity(0);
                    newInventory.setMinimumStock(10);

                    return newInventory;
                });

        inventory.setQuantity(
                inventory.getQuantity()
                        + request.getQuantity());

        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory savedInventory =
                inventoryRepo.save(inventory);


        // Transaction history
        InventoryTransaction transaction =
                new InventoryTransaction();

        transaction.setProduct(product);
        transaction.setTransactionType(
                InventoryTransactionType.IN);
        transaction.setQuantity(
                request.getQuantity());
        transaction.setReferenceType(
                "MANUAL");
        transaction.setCreatedBy(user);

        inventoryTransactionRepo.save(transaction);

        return mapToResponseDTO(savedInventory);
    }


    // REMOVE STOCK
    @Override
        @Transactional
    public InventoryResponseDTO removeStock(
                        StockRequestDTO request) {

                validateQuantity(request);

        Product product = productRepo.findById(
                request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        User user = getAuthenticatedUser();

        Inventory inventory = inventoryRepo
                .findByProduct_Id(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Inventory not found"));


        // Stock कमी आहे का?
        if (inventory.getQuantity()
                < request.getQuantity()) {

            throw new RuntimeException(
                    "Insufficient stock");
        }


        inventory.setQuantity(
                inventory.getQuantity()
                        - request.getQuantity());

        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory savedInventory =
                inventoryRepo.save(inventory);


        // Transaction history
        InventoryTransaction transaction =
                new InventoryTransaction();

        transaction.setProduct(product);
        transaction.setTransactionType(
                InventoryTransactionType.OUT);
        transaction.setQuantity(
                request.getQuantity());
        transaction.setReferenceType(
                "MANUAL");
        transaction.setCreatedBy(user);

        inventoryTransactionRepo.save(transaction);

        return mapToResponseDTO(savedInventory);
    }


    // ADJUST STOCK
    @Override
        @Transactional
    public InventoryResponseDTO adjustStock(
                        StockRequestDTO request) {

                validateQuantity(request);

        Product product = productRepo.findById(
                request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        User user = getAuthenticatedUser();

        Inventory inventory = inventoryRepo
                .findByProduct_Id(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Inventory not found"));


        inventory.setQuantity(request.getQuantity());

        inventory.setUpdatedAt(LocalDateTime.now());

        Inventory savedInventory =
                inventoryRepo.save(inventory);


        InventoryTransaction transaction =
                new InventoryTransaction();

        transaction.setProduct(product);
        transaction.setTransactionType(
                InventoryTransactionType.ADJUSTMENT);
        transaction.setQuantity(
                request.getQuantity());
        transaction.setReferenceType(
                "MANUAL");
        transaction.setCreatedBy(user);

        inventoryTransactionRepo.save(transaction);

        return mapToResponseDTO(savedInventory);
    }


    // LOW STOCK
    @Override
    public List<InventoryResponseDTO> getLowStockProducts() {

        return inventoryRepo.findAll()
                .stream()
                .filter(i ->
                        i.getQuantity()
                        <= i.getMinimumStock())
                .map(this::mapToResponseDTO)
                .toList();
    }


    // ENTITY → DTO
    private InventoryResponseDTO mapToResponseDTO(
            Inventory inventory) {

        InventoryResponseDTO dto =
                new InventoryResponseDTO();

        dto.setInventoryId(inventory.getId());

        dto.setProductId(
                inventory.getProduct().getId());

        dto.setProductName(
                inventory.getProduct().getName());

        dto.setQuantity(
                inventory.getQuantity());

        dto.setMinimumStock(
                inventory.getMinimumStock());

        dto.setLowStock(
                inventory.getQuantity()
                <= inventory.getMinimumStock());

        dto.setUpdatedAt(
                inventory.getUpdatedAt());

        return dto;
    }

        private void validateQuantity(StockRequestDTO request) {
                if (request == null || request.getProductId() == null) {
                        throw new RuntimeException("Product is required");
                }
                if (request.getQuantity() == null || request.getQuantity() <= 0) {
                        throw new RuntimeException("Quantity must be greater than zero");
                }
        }

        private User getAuthenticatedUser() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || authentication.getName() == null) {
                        throw new RuntimeException("Authenticated user is required");
                }
                return userRepo.findByEmail(authentication.getName())
                                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        }
}