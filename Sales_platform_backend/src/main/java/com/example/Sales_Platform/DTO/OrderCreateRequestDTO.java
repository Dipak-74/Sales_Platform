package com.example.Sales_Platform.DTO;

import java.math.BigDecimal;
import java.util.List;


public class OrderCreateRequestDTO {

    private Long customerId;

    private Long employeeId;

    private BigDecimal discount;

    private BigDecimal tax;

    private List<OrderItemRequestDTO> items;

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public Long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

	public BigDecimal getDiscount() {
		return discount;
	}

	public void setDiscount(BigDecimal discount) {
		this.discount = discount;
	}

	public BigDecimal getTax() {
		return tax;
	}

	public void setTax(BigDecimal tax) {
		this.tax = tax;
	}

	public List<OrderItemRequestDTO> getItems() {
		return items;
	}

	public void setItems(List<OrderItemRequestDTO> items) {
		this.items = items;
	}
    
}