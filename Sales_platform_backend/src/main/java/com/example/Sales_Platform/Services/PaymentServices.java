package com.example.Sales_Platform.Services;

import java.util.List;

import com.example.Sales_Platform.DTO.PaymentRequestDTO;
import com.example.Sales_Platform.DTO.PaymentResponseDTO;
import com.example.Sales_Platform.Intities.PaymentStatus;

public interface PaymentServices {

    PaymentResponseDTO createPayment(PaymentRequestDTO request);

    PaymentResponseDTO getPaymentById(Long id);

    PaymentResponseDTO getPaymentByOrder(Long orderId);

    List<PaymentResponseDTO> getPaymentsByStatus(
            PaymentStatus status);

    PaymentResponseDTO updatePaymentStatus(
            Long id,
            PaymentStatus status);

    PaymentResponseDTO verifyPayment(Long id);

        void handleWebhook(String signature, String timestamp, byte[] rawBody);
}