package com.example.Sales_Platform.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.InventoryTransaction;
import com.example.Sales_Platform.Intities.InventoryTransactionType;

public interface InventoryTransactionRepo extends JpaRepository<InventoryTransaction, Long> {
	// Product ची stock history
    List<InventoryTransaction> findByProduct_Id(Long productId);

    // कोणत्या user ने transaction केली
    List<InventoryTransaction> findByCreatedBy_Id(Long userId);

    // IN / OUT / ADJUSTMENT
    List<InventoryTransaction> findByTransactionType(
            InventoryTransactionType transactionType);

    boolean existsByReferenceTypeAndReferenceId(String referenceType, Long referenceId);
}
