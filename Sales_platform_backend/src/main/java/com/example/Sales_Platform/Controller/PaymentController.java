package com.example.Sales_Platform.Controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Sales_Platform.DTO.PaymentRequestDTO;
import com.example.Sales_Platform.DTO.PaymentResponseDTO;
import com.example.Sales_Platform.Intities.PaymentStatus;
import com.example.Sales_Platform.Services.PaymentServices;

@RestController
@RequestMapping("/api")
public class PaymentController {

    private final PaymentServices paymentServices;

    public PaymentController(PaymentServices paymentServices) {
        this.paymentServices = paymentServices;
    }

    @PostMapping("/payments")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public PaymentResponseDTO createPayment(
            @RequestBody PaymentRequestDTO request) {
        return paymentServices.createPayment(request);
    }

    @GetMapping("/payments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public PaymentResponseDTO getPaymentById(
            @PathVariable Long id) {
        return paymentServices.getPaymentById(id);
    }

    @GetMapping("/payments/order/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public PaymentResponseDTO getPaymentByOrder(
            @PathVariable Long orderId) {
        return paymentServices.getPaymentByOrder(orderId);
    }

    @GetMapping("/payments/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<PaymentResponseDTO> getPaymentsByStatus(
            @RequestParam PaymentStatus status) {
        return paymentServices.getPaymentsByStatus(status);
    }

    @PutMapping("/payments/{id}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE')")
    public PaymentResponseDTO updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam PaymentStatus status) {
        return paymentServices.updatePaymentStatus(id, status);
    }

    @PutMapping("/payments/{id}/verify")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public PaymentResponseDTO verifyPayment(
            @PathVariable Long id) {
        return paymentServices.verifyPayment(id);
    }

    @PostMapping("/payments/webhook")
    public void webhook(HttpServletRequest request) throws Exception {
        paymentServices.handleWebhook(
                request.getHeader("x-webhook-signature"),
                request.getHeader("x-webhook-timestamp"),
                request.getInputStream().readAllBytes());
    }
}
