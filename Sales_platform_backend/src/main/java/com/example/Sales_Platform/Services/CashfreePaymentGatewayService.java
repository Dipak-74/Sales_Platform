package com.example.Sales_Platform.Services;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.GeneralSecurityException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class CashfreePaymentGatewayService implements PaymentGatewayService {
    private final RestClient restClient;
    private final String clientId;
    private final String clientSecret;
    private final String apiVersion;
    private final String returnUrl;
    private final String notifyUrl;

    public CashfreePaymentGatewayService(
            @Value("${payment.gateway.base-url:https://sandbox.cashfree.com/pg}") String baseUrl,
            @Value("${payment.gateway.client-id:}") String clientId,
            @Value("${payment.gateway.client-secret:}") String clientSecret,
            @Value("${payment.gateway.api-version:2023-08-01}") String apiVersion,
            @Value("${payment.gateway.return-url:http://localhost:5173/customer/payment}") String returnUrl,
            @Value("${payment.gateway.notify-url:}") String notifyUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.apiVersion = apiVersion;
        this.returnUrl = returnUrl;
        this.notifyUrl = notifyUrl;
    }

    @Override
    public GatewayOrder createOrder(String orderId, BigDecimal amount, String customerId,
            String customerName, String customerEmail, String customerPhone) {
        requireCredentials();
        Map<String, Object> customer = new HashMap<>();
        customer.put("customer_id", customerId);
        customer.put("customer_name", customerName);
        customer.put("customer_email", customerEmail);
        customer.put("customer_phone", customerPhone == null || customerPhone.isBlank() ? "9999999999" : customerPhone);

        Map<String, Object> body = new HashMap<>();
        body.put("order_id", orderId);
        body.put("order_amount", amount);
        body.put("order_currency", "INR");
        body.put("customer_details", customer);
        Map<String, String> meta = new HashMap<>();
        String localOrderId = orderId.startsWith("SP-") ? orderId.substring(3) : orderId;
        meta.put("return_url", returnUrl + "?orderId=" + localOrderId + "&return=1");
        if (notifyUrl != null && !notifyUrl.isBlank()) {
            meta.put("notify_url", notifyUrl);
        }
        body.put("order_meta", meta);

        Map<?, ?> response = restClient.post()
                .uri("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .header("x-api-version", apiVersion)
                .header("x-client-id", clientId)
                .header("x-client-secret", clientSecret)
                .header("x-idempotency-key", orderId)
                .body(body)
                .retrieve()
                .body(Map.class);

        return new GatewayOrder(
                stringValue(response, "order_id"),
                stringValue(response, "payment_session_id"),
                stringValue(response, "order_status"));
    }

    @Override
    public GatewayPayment getPayment(String gatewayOrderId) {
        requireCredentials();
        List<?> payments = restClient.get()
                .uri("/orders/{orderId}/payments", gatewayOrderId)
                .header("x-api-version", apiVersion)
                .header("x-client-id", clientId)
                .header("x-client-secret", clientSecret)
                .retrieve()
                .body(List.class);
        if (payments == null || payments.isEmpty()) {
            return new GatewayPayment(null, null, null, "PENDING", null, gatewayOrderId);
        }
        Map<?, ?> payment = (Map<?, ?>) payments.get(payments.size() - 1);
        return new GatewayPayment(
                stringValue(payment, "cf_payment_id"),
                stringValue(payment, "bank_reference"),
                decimalValue(payment, "payment_amount"),
                stringValue(payment, "payment_status"),
                null, gatewayOrderId);
    }

    @Override
    public boolean verifyWebhookSignature(String signature, String timestamp, String rawBody) {
        if (signature == null || timestamp == null || rawBody == null || clientSecret.isBlank()) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(clientSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] digest = mac.doFinal((timestamp + rawBody).getBytes(StandardCharsets.UTF_8));
            return MessageDigest.isEqual(
                    Base64.getEncoder().encode(digest),
                    signature.getBytes(StandardCharsets.UTF_8));
        } catch (GeneralSecurityException exception) {
            return false;
        }
    }

    @Override
    public GatewayPayment parseWebhookPayment(Map<?, ?> payload) {
        Map<?, ?> data = nestedMap(payload, "data");
        Map<?, ?> payment = nestedMap(data, "payment");
        Map<?, ?> order = nestedMap(data, "order");
        return new GatewayPayment(
                stringValue(payment, "cf_payment_id"),
                stringValue(payment, "bank_reference"),
                decimalValue(payment, "payment_amount"),
                stringValue(payment, "payment_status"),
                stringValue(order, "order_id"), stringValue(order, "order_id"));
    }

    private static Map<?, ?> nestedMap(Map<?, ?> map, String key) {
        Object value = map == null ? null : map.get(key);
        return value instanceof Map<?, ?> nested ? nested : Map.of();
    }

    private void requireCredentials() {
        if (clientId.isBlank() || clientSecret.isBlank()) {
            throw new IllegalStateException("Cashfree payment gateway credentials are not configured");
        }
    }

    private static String stringValue(Map<?, ?> map, String key) {
        Object value = map == null ? null : map.get(key);
        return value == null ? null : String.valueOf(value);
    }

    private static BigDecimal decimalValue(Map<?, ?> map, String key) {
        String value = stringValue(map, key);
        return value == null ? null : new BigDecimal(value);
    }
}
