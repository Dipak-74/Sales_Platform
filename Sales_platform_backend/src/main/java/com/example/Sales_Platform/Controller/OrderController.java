package com.example.Sales_Platform.Controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Sales_Platform.DTO.OrderCreateRequestDTO;
import com.example.Sales_Platform.DTO.OrderItemResponseDTO;
import com.example.Sales_Platform.DTO.OrderResponseDTO;
import com.example.Sales_Platform.Intities.OrderStatus;
import com.example.Sales_Platform.Services.OrderItemServices;
import com.example.Sales_Platform.Services.OrderServices;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderServices orderServices;
    private final OrderItemServices orderItemServices;

    public OrderController(
            OrderServices orderServices,
            OrderItemServices orderItemServices) {
        this.orderServices = orderServices;
        this.orderItemServices = orderItemServices;
    }

    @PostMapping("/orders")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_EMPLOYEE', 'ROLE_CUSTOMER', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public OrderResponseDTO createOrder(
            @RequestBody OrderCreateRequestDTO request) {
        return orderServices.createOrder(request);
    }

    @GetMapping("/orders")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_EMPLOYEE', 'ROLE_CUSTOMER', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<OrderResponseDTO> getAllOrders() {
        return orderServices.getAllOrders();
    }

    @GetMapping("/orders/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public OrderResponseDTO getOrderById(
            @PathVariable Long id) {
        return orderServices.getOrderById(id);
    }

    @GetMapping("/orders/number")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public OrderResponseDTO getOrderByNumber(
            @RequestParam String orderNumber) {
        return orderServices.getOrderByNumber(orderNumber);
    }

    @GetMapping("/orders/customer/{customerId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<OrderResponseDTO> getCustomerOrders(
            @PathVariable Long customerId) {
        return orderServices.getCustomerOrders(customerId);
    }

    @GetMapping("/orders/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE')")
    public List<OrderResponseDTO> getEmployeeOrders(
            @PathVariable Long employeeId) {
        return orderServices.getEmployeeOrders(employeeId);
    }

    @GetMapping("/orders/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<OrderResponseDTO> getOrdersByStatus(
            @RequestParam OrderStatus status) {
        return orderServices.getOrdersByStatus(status);
    }

    @PutMapping("/orders/{id}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE')")
    public OrderResponseDTO updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return orderServices.updateOrderStatus(id, status);
    }

    @PutMapping("/orders/{id}/cancel")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public OrderResponseDTO cancelOrder(
            @PathVariable Long id) {
        return orderServices.cancelOrder(id);
    }

    @GetMapping("/orders/{orderId}/items")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<OrderItemResponseDTO> getItemsByOrder(
            @PathVariable Long orderId) {
        return orderItemServices.getItemsByOrder(orderId);
    }

    @GetMapping("/orders/items/product/{productId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<OrderItemResponseDTO> getItemsByProduct(
            @PathVariable Long productId) {
        return orderItemServices.getItemsByProduct(productId);
    }
}
