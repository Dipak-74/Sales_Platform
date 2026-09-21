package com.example.Sales_Platform.Services;

import java.math.BigDecimal;
import java.util.Map;

public interface PaymentGatewayService {
    GatewayOrder createOrder(String orderId, BigDecimal amount, String customerId,
            String customerName, String customerEmail, String customerPhone);

    GatewayPayment getPayment(String gatewayOrderId);

    boolean verifyWebhookSignature(String signature, String timestamp, String rawBody);

    record GatewayOrder(String orderId, String paymentSessionId, String status) {}

    record GatewayPayment(String paymentId, String transactionId, BigDecimal amount,
            String status, String signature, String gatewayOrderId) {}

        GatewayPayment parseWebhookPayment(Map<?, ?> payload);
}
