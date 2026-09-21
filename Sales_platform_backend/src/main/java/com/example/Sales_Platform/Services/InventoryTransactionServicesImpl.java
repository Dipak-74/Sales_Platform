package com.example.Sales_Platform.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Sales_Platform.DTO.InventoryTransactionResponseDTO;
import com.example.Sales_Platform.Intities.InventoryTransaction;
import com.example.Sales_Platform.Intities.InventoryTransactionType;
import com.example.Sales_Platform.Repo.InventoryTransactionRepo;

@Service
public class InventoryTransactionServicesImpl
        implements InventoryTransactionServices {

    @Autowired
    InventoryTransactionRepo inventoryTransactionRepo;


    // PRODUCT WISE HISTORY
    @Override
    public List<InventoryTransactionResponseDTO>
    getTransactionsByProduct(Long productId) {

        return inventoryTransactionRepo
                .findByProduct_Id(productId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // USER WISE HISTORY
    @Override
    public List<InventoryTransactionResponseDTO>
    getTransactionsByUser(Long userId) {

        return inventoryTransactionRepo
                .findByCreatedBy_Id(userId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // TYPE WISE HISTORY
    @Override
    public List<InventoryTransactionResponseDTO>
    getTransactionsByType(
            InventoryTransactionType transactionType) {

        return inventoryTransactionRepo
                .findByTransactionType(transactionType)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // ENTITY → DTO
    private InventoryTransactionResponseDTO
    mapToResponseDTO(InventoryTransaction transaction) {

        InventoryTransactionResponseDTO dto =
                new InventoryTransactionResponseDTO();

        dto.setTransactionId(transaction.getId());

        dto.setProductId(
                transaction.getProduct().getId());

        dto.setProductName(
                transaction.getProduct().getName());

        dto.setTransactionType(
                transaction.getTransactionType());

        dto.setQuantity(
                transaction.getQuantity());

        dto.setReferenceType(
                transaction.getReferenceType());

        dto.setReferenceId(
                transaction.getReferenceId());

        dto.setCreatedBy(
                transaction.getCreatedBy().getId());

        dto.setCreatedAt(
                transaction.getCreatedAt());

        return dto;
    }
}