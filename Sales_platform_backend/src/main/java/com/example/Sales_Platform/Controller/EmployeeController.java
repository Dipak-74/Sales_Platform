package com.example.Sales_Platform.Controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Sales_Platform.DTO.CustomerResponseDTO;
import com.example.Sales_Platform.DTO.InventoryResponseDTO;
import com.example.Sales_Platform.DTO.OrderResponseDTO;
import com.example.Sales_Platform.Intities.CustomerStatus;
import com.example.Sales_Platform.Intities.OrderStatus;
import com.example.Sales_Platform.Services.CustomerServices;
import com.example.Sales_Platform.Services.InventoryServices;
import com.example.Sales_Platform.Services.OrderServices;

@RestController
@RequestMapping("/api/employee")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeController {

    private final CustomerServices customerServices;
    private final OrderServices orderServices;
    private final InventoryServices inventoryServices;

    public EmployeeController(
            CustomerServices customerServices,
            OrderServices orderServices,
            InventoryServices inventoryServices) {
        this.customerServices = customerServices;
        this.orderServices = orderServices;
        this.inventoryServices = inventoryServices;
    }

    @GetMapping("/customers")
    public List<CustomerResponseDTO> getAllCustomers() {
        return customerServices.getAllCustomers();
    }

    @GetMapping("/customers/{id}")
    public CustomerResponseDTO getCustomerById(
            @PathVariable Long id) {
        return customerServices.getCustomerById(id);
    }

    @GetMapping("/customers/user/{userId}")
    public CustomerResponseDTO getCustomerByUserId(
            @PathVariable Long userId) {
        return customerServices.getCustomerByUserId(userId);
    }

    @GetMapping("/customers/search")
    public List<CustomerResponseDTO> searchCustomers(
            @RequestParam String name) {
        return customerServices.searchCustomers(name);
    }

    @GetMapping("/customers/phone")
    public List<CustomerResponseDTO> getCustomersByPhone(
            @RequestParam String phone) {
        return customerServices.getCustomersByPhone(phone);
    }

    @GetMapping("/customers/status")
    public List<CustomerResponseDTO> getCustomersByStatus(
            @RequestParam CustomerStatus status) {
        return customerServices.getCustomersByStatus(status);
    }

    @GetMapping("/orders")
    public List<OrderResponseDTO> getAllOrders() {
        return orderServices.getAllOrders();
    }

    @GetMapping("/orders/{id}")
    public OrderResponseDTO getOrderById(
            @PathVariable Long id) {
        return orderServices.getOrderById(id);
    }

    @GetMapping("/orders/customer/{customerId}")
    public List<OrderResponseDTO> getCustomerOrders(
            @PathVariable Long customerId) {
        return orderServices.getCustomerOrders(customerId);
    }

    @GetMapping("/orders/status")
    public List<OrderResponseDTO> getOrdersByStatus(
            @RequestParam OrderStatus status) {
        return orderServices.getOrdersByStatus(status);
    }

    @GetMapping("/inventory/product/{productId}")
    public com.example.Sales_Platform.DTO.InventoryResponseDTO getInventoryByProduct(
            @PathVariable Long productId) {
        return inventoryServices.getInventoryByProduct(productId);
    }

    @GetMapping("/inventory")
    public List<InventoryResponseDTO> getAllInventory() {
        return inventoryServices.getAllInventory();
    }

    @GetMapping("/inventory/low-stock")
    public List<InventoryResponseDTO> getLowStockProducts() {
        return inventoryServices.getLowStockProducts();
    }
}
