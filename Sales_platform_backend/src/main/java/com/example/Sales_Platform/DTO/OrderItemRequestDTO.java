package com.example.Sales_Platform.DTO;

import java.math.BigDecimal;

public class OrderItemRequestDTO {

    private Long productId;

    private Integer quantity;

    private BigDecimal discount;

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public BigDecimal getDiscount() {
		return discount;
	}

	public void setDiscount(BigDecimal discount) {
		this.discount = discount;
	}
    
    
}