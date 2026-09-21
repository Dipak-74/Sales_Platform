package com.example.Sales_Platform.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.Sales_Platform.Intities.PaymentMethod;
import com.example.Sales_Platform.Intities.PaymentStatus;

public class PaymentResponseDTO {

    private Long paymentId;

    private Long orderId;

    private String orderNumber;

    private BigDecimal amount;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private String transactionId;

	private String gatewayOrderId;

	private String paymentSessionId;

	private String gatewayPaymentId;

    private LocalDateTime paidAt;

	public Long getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(Long paymentId) {
		this.paymentId = paymentId;
	}

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public String getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
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

	public PaymentStatus getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(PaymentStatus paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public String getGatewayOrderId() {
		return gatewayOrderId;
	}

	public void setGatewayOrderId(String gatewayOrderId) {
		this.gatewayOrderId = gatewayOrderId;
	}

	public String getPaymentSessionId() {
		return paymentSessionId;
	}

	public void setPaymentSessionId(String paymentSessionId) {
		this.paymentSessionId = paymentSessionId;
	}

	public String getGatewayPaymentId() {
		return gatewayPaymentId;
	}

	public void setGatewayPaymentId(String gatewayPaymentId) {
		this.gatewayPaymentId = gatewayPaymentId;
	}

	public LocalDateTime getPaidAt() {
		return paidAt;
	}

	public void setPaidAt(LocalDateTime paidAt) {
		this.paidAt = paidAt;
	}
    
}