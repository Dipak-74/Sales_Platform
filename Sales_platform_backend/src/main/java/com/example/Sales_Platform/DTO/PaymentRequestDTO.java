package com.example.Sales_Platform.DTO;

import java.math.BigDecimal;

import com.example.Sales_Platform.Intities.PaymentMethod;


public class PaymentRequestDTO {

    private Long orderId;

    private BigDecimal amount;

    private PaymentMethod paymentMethod;

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public PaymentMethod getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(PaymentMethod paymentMethod) {
		this.paymentMethod = paymentMethod;
	}
    
}