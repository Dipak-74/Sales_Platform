package com.example.Sales_Platform.Services;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Sales_Platform.DTO.PaymentRequestDTO;
import com.example.Sales_Platform.DTO.PaymentResponseDTO;
import com.example.Sales_Platform.Intities.Customer;
import com.example.Sales_Platform.Intities.Inventory;
import com.example.Sales_Platform.Intities.InventoryTransaction;
import com.example.Sales_Platform.Intities.InventoryTransactionType;
import com.example.Sales_Platform.Intities.Order;
import com.example.Sales_Platform.Intities.OrderStatus;
import com.example.Sales_Platform.Intities.Payment;
import com.example.Sales_Platform.Intities.PaymentStatus;
import com.example.Sales_Platform.Repo.CustomerRepo;
import com.example.Sales_Platform.Repo.InventoryRepo;
import com.example.Sales_Platform.Repo.InventoryTransactionRepo;
import com.example.Sales_Platform.Repo.OrderRepo;
import com.example.Sales_Platform.Repo.PaymentRepo;
import com.example.Sales_Platform.Repo.UserRepo;
import com.google.gson.Gson;

@Service
public class PaymentServicesImpl implements PaymentServices {
    @Autowired
    PaymentRepo paymentRepo;

    @Autowired
    OrderRepo orderRepo;

    @Autowired
    CustomerRepo customerRepo;

    @Autowired
    InventoryRepo inventoryRepo;

    @Autowired
    InventoryTransactionRepo inventoryTransactionRepo;

    @Autowired
    UserRepo userRepo;

    @Autowired
    PaymentGatewayService paymentGatewayService;

    private final Gson gson = new Gson();

    @Override
    @Transactional
    public PaymentResponseDTO createPayment(PaymentRequestDTO request) {
        if (request == null || request.getOrderId() == null) {
            throw new RuntimeException("Order is required");
        }
        if (request.getPaymentMethod() == null) {
            throw new RuntimeException("Payment method is required");
        }

        Order order = orderRepo.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        assertCustomerOwnsOrder(order);
        if (order.getTotalAmount() == null || order.getTotalAmount().signum() <= 0) {
            throw new RuntimeException("Order total must be greater than zero");
        }
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be paid");
        }
        if (paymentRepo.findByOrder_Id(order.getId()).isPresent()) {
            throw new RuntimeException("Payment already exists for this order");
        }

        Customer customer = order.getCustomer();
        String gatewayOrderId = "SP-" + order.getId();
        PaymentGatewayService.GatewayOrder gatewayOrder = paymentGatewayService.createOrder(
                gatewayOrderId,
                order.getTotalAmount(),
                String.valueOf(customer.getId()),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone());

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setGatewayOrderId(gatewayOrder.orderId());
        Payment savedPayment = paymentRepo.save(payment);

        PaymentResponseDTO response = mapToResponseDTO(savedPayment);
        response.setPaymentSessionId(gatewayOrder.paymentSessionId());
        return response;
    }

    @Override
    public PaymentResponseDTO getPaymentById(Long id) {
        return mapToResponseDTO(paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found")));
    }

    @Override
    public PaymentResponseDTO getPaymentByOrder(Long orderId) {
        return mapToResponseDTO(paymentRepo.findByOrder_Id(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found")));
    }

    @Override
    public List<PaymentResponseDTO> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepo.findByPaymentStatus(status).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public PaymentResponseDTO updatePaymentStatus(Long id, PaymentStatus status) {
        if (status == PaymentStatus.SUCCESS) {
            throw new RuntimeException("Payment success can only come from gateway verification");
        }
        Payment payment = paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setPaymentStatus(status);
        return mapToResponseDTO(paymentRepo.save(payment));
    }

    @Override
    @Transactional
    public PaymentResponseDTO verifyPayment(Long id) {
        Payment payment = paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        assertCustomerOwnsOrder(payment.getOrder());
        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
            return mapToResponseDTO(payment);
        }

        PaymentGatewayService.GatewayPayment gatewayPayment =
                paymentGatewayService.getPayment(payment.getGatewayOrderId());
        if (!payment.getAmount().equals(gatewayPayment.amount()) ||
                !"SUCCESS".equalsIgnoreCase(gatewayPayment.status())) {
            if ("FAILED".equalsIgnoreCase(gatewayPayment.status())) {
                payment.setPaymentStatus(PaymentStatus.FAILED);
                paymentRepo.save(payment);
            }
            return mapToResponseDTO(payment);
        }

        finalizeSuccessfulPayment(payment, gatewayPayment);
        return mapToResponseDTO(payment);
    }

    @Override
    @Transactional
    public void handleWebhook(String signature, String timestamp, byte[] rawBody) {
        String body = new String(rawBody, StandardCharsets.UTF_8);
        if (!paymentGatewayService.verifyWebhookSignature(signature, timestamp, body)) {
            throw new RuntimeException("Invalid payment webhook signature");
        }
        try {
                Map<?, ?> payload = gson.fromJson(body, Map.class);
            PaymentGatewayService.GatewayPayment gatewayPayment =
                    paymentGatewayService.parseWebhookPayment(payload);
            if (gatewayPayment.gatewayOrderId() == null) {
                return;
            }
            paymentRepo.findByGatewayOrderId(gatewayPayment.gatewayOrderId()).ifPresent(payment -> {
                if ("SUCCESS".equalsIgnoreCase(gatewayPayment.status()) &&
                        payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
                    if (!payment.getAmount().equals(gatewayPayment.amount())) {
                        throw new RuntimeException("Webhook amount does not match order amount");
                    }
                    finalizeSuccessfulPayment(payment, gatewayPayment);
                } else if ("FAILED".equalsIgnoreCase(gatewayPayment.status()) &&
                        payment.getPaymentStatus() == PaymentStatus.PENDING) {
                    payment.setPaymentStatus(PaymentStatus.FAILED);
                    paymentRepo.save(payment);
                }
            });
        } catch (RuntimeException exception) {
            throw new RuntimeException("Invalid payment webhook payload", exception);
        }
    }

    private void assertCustomerOwnsOrder(Order order) {
        var authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Authenticated user is required");
        }
        Customer customer = customerRepo.findByUser_Id(order.getCustomer().getUser().getId())
                .orElseThrow(() -> new RuntimeException("Order customer not found"));
        boolean staff = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().contains("ADMIN") ||
                        authority.getAuthority().contains("MANAGER") ||
                        authority.getAuthority().contains("EMPLOYEE"));
        if (!staff && !customer.getUser().getEmail().equalsIgnoreCase(authentication.getName())) {
            throw new RuntimeException("You can only pay for your own orders");
        }
    }

    private void finalizeSuccessfulPayment(Payment payment,
            PaymentGatewayService.GatewayPayment gatewayPayment) {
        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
            return;
        }
        Order order = payment.getOrder();
        if (order.getStatus() == OrderStatus.CONFIRMED ||
                inventoryTransactionRepo.existsByReferenceTypeAndReferenceId("ORDER", order.getId())) {
            payment.setPaymentStatus(PaymentStatus.SUCCESS);
            paymentRepo.save(payment);
            return;
        }
        for (var item : order.getOrderItems()) {
            Inventory inventory = inventoryRepo.findByProduct_Id(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Inventory not found"));
            if (inventory.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + item.getProduct().getName());
            }
        }
        var user = userRepo.findById(order.getCustomer().getUser().getId())
                .orElse(null);
        for (var item : order.getOrderItems()) {
            Inventory inventory = inventoryRepo.findByProduct_Id(item.getProduct().getId()).orElseThrow();
            inventory.setQuantity(inventory.getQuantity() - item.getQuantity());
            inventoryRepo.save(inventory);

            InventoryTransaction transaction = new InventoryTransaction();
            transaction.setProduct(item.getProduct());
            transaction.setTransactionType(InventoryTransactionType.OUT);
            transaction.setQuantity(item.getQuantity());
            transaction.setReferenceType("ORDER");
            transaction.setReferenceId(order.getId());
            transaction.setCreatedBy(user);
            inventoryTransactionRepo.save(transaction);
        }
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepo.save(order);
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setGatewayPaymentId(gatewayPayment.paymentId());
        payment.setTransactionId(gatewayPayment.transactionId());
        payment.setGatewaySignature(gatewayPayment.signature());
        payment.setPaidAt(LocalDateTime.now());
        paymentRepo.save(payment);
    }

    private PaymentResponseDTO mapToResponseDTO(Payment payment) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setPaymentId(payment.getId());
        dto.setOrderId(payment.getOrder().getId());
        dto.setOrderNumber(payment.getOrder().getOrderNumber());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentStatus(payment.getPaymentStatus());
        dto.setTransactionId(payment.getTransactionId());
        dto.setGatewayOrderId(payment.getGatewayOrderId());
        dto.setGatewayPaymentId(payment.getGatewayPaymentId());
        dto.setPaidAt(payment.getPaidAt());
        return dto;
    }
}
