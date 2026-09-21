package com.example.Sales_Platform.Intities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private String transactionId;

    private String gatewayOrderId;

    private String gatewayPaymentId;

    private String gatewaySignature;

    private LocalDateTime paidAt;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

	public Payment() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Payment(Long id, Order order, BigDecimal amount, PaymentMethod paymentMethod, PaymentStatus paymentStatus,
			String transactionId, String gatewayOrderId, String gatewayPaymentId, String gatewaySignature,
			LocalDateTime paidAt, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.order = order;
		this.amount = amount;
		this.paymentMethod = paymentMethod;
		this.paymentStatus = paymentStatus;
		this.transactionId = transactionId;
		this.gatewayOrderId = gatewayOrderId;
		this.gatewayPaymentId = gatewayPaymentId;
		this.gatewaySignature = gatewaySignature;
		this.paidAt = paidAt;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
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

	public String getGatewayPaymentId() {
		return gatewayPaymentId;
	}

	public void setGatewayPaymentId(String gatewayPaymentId) {
		this.gatewayPaymentId = gatewayPaymentId;
	}

	public String getGatewaySignature() {
		return gatewaySignature;
	}

	public void setGatewaySignature(String gatewaySignature) {
		this.gatewaySignature = gatewaySignature;
	}

	public LocalDateTime getPaidAt() {
		return paidAt;
	}

	public void setPaidAt(LocalDateTime paidAt) {
		this.paidAt = paidAt;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
}