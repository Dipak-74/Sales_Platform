package com.example.Sales_Platform.DTO;

import java.time.LocalDateTime;

import com.example.Sales_Platform.Intities.InventoryTransactionType;


public class InventoryTransactionResponseDTO {

    private Long transactionId;

    private Long productId;

    private String productName;

    private InventoryTransactionType transactionType;

    private Integer quantity;

    private String referenceType;

    private Long referenceId;

    private Long createdBy;

    private LocalDateTime createdAt;

	public Long getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(Long transactionId) {
		this.transactionId = transactionId;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public InventoryTransactionType getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(InventoryTransactionType transactionType) {
		this.transactionType = transactionType;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public String getReferenceType() {
		return referenceType;
	}

	public void setReferenceType(String referenceType) {
		this.referenceType = referenceType;
	}

	public Long getReferenceId() {
		return referenceId;
	}

	public void setReferenceId(Long referenceId) {
		this.referenceId = referenceId;
	}

	public Long getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Long createdBy) {
		this.createdBy = createdBy;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
    
}