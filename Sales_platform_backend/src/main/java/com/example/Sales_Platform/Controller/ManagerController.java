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

import com.example.Sales_Platform.DTO.CustomerRequestDTO;
import com.example.Sales_Platform.DTO.CustomerResponseDTO;
import com.example.Sales_Platform.DTO.EmployeeRequestDTO;
import com.example.Sales_Platform.DTO.EmployeeResponseDTO;
import com.example.Sales_Platform.DTO.InventoryResponseDTO;
import com.example.Sales_Platform.DTO.OrderCreateRequestDTO;
import com.example.Sales_Platform.DTO.OrderResponseDTO;
import com.example.Sales_Platform.DTO.StockRequestDTO;
import com.example.Sales_Platform.DTO.UserRequestDTO;
import com.example.Sales_Platform.DTO.UserResponseDTO;
import com.example.Sales_Platform.Intities.CustomerStatus;
import com.example.Sales_Platform.Intities.EmployeeStatus;
import com.example.Sales_Platform.Intities.OrderStatus;
import com.example.Sales_Platform.Services.CustomerServices;
import com.example.Sales_Platform.Services.EmployeeServices;
import com.example.Sales_Platform.Services.InventoryServices;
import com.example.Sales_Platform.Services.OrderServices;
import com.example.Sales_Platform.Services.UserServices;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasAnyAuthority('ROLE_MANAGER', 'ROLE_ADMIN', 'MANAGER', 'ADMIN')")
public class ManagerController {

    private final EmployeeServices employeeServices;
    private final CustomerServices customerServices;
    private final OrderServices orderServices;
    private final InventoryServices inventoryServices;
    private final UserServices userServices;

    public ManagerController(
            EmployeeServices employeeServices,
            CustomerServices customerServices,
            OrderServices orderServices,
            InventoryServices inventoryServices,
            UserServices userServices) {
        this.employeeServices = employeeServices;
        this.customerServices = customerServices;
        this.orderServices = orderServices;
        this.inventoryServices = inventoryServices;
        this.userServices = userServices;
    }

    @PostMapping("/users")
    public UserResponseDTO createEmployeeUser(
            @RequestBody UserRequestDTO request) {
        return userServices.createEmployeeUser(request);
    }

    @PostMapping("/employees")
    public EmployeeResponseDTO createEmployee(
            @RequestBody EmployeeRequestDTO request) {
        return employeeServices.createEmployee(request);
    }

    @GetMapping("/employees/{id}")
    public EmployeeResponseDTO getEmployeeById(
            @PathVariable Long id) {
        return employeeServices.getEmployeeById(id);
    }

    @GetMapping("/employees/user/{userId}")
    public EmployeeResponseDTO getEmployeeByUserId(
            @PathVariable Long userId) {
        return employeeServices.getEmployeeByUserId(userId);
    }

    @GetMapping("/employees/manager/{managerId}")
    public List<EmployeeResponseDTO> getEmployeesByManager(
            @PathVariable Long managerId) {
        return employeeServices.getEmployeesByManager(managerId);
    }

    @GetMapping("/employees/department/{departmentId}")
    public List<EmployeeResponseDTO> getEmployeesByDepartment(
            @PathVariable Long departmentId) {
        return employeeServices.getEmployeesByDepartment(departmentId);
    }

    @PutMapping("/employees/{id}")
    public EmployeeResponseDTO updateEmployee(
            @PathVariable Long id,
            @RequestBody EmployeeRequestDTO request) {
        return employeeServices.updateEmployee(id, request);
    }

    @PutMapping("/employees/{id}/status")
    public EmployeeResponseDTO updateEmployeeStatus(
            @PathVariable Long id,
            @RequestParam EmployeeStatus status) {
        return employeeServices.updateEmployeeStatus(id, status);
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

    @GetMapping("/customers/code/{customerCode}")
    public CustomerResponseDTO getCustomerByCode(
            @PathVariable String customerCode) {
        return customerServices.getCustomerByCode(customerCode);
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

    @PostMapping("/customers")
    public CustomerResponseDTO createCustomer(
            @RequestBody CustomerRequestDTO request) {
        return customerServices.createCustomer(request);
    }

    @PutMapping("/customers/{id}")
    public CustomerResponseDTO updateCustomer(
            @PathVariable Long id,
            @RequestBody CustomerRequestDTO request) {
        return customerServices.updateCustomer(id, request);
    }

    @PutMapping("/customers/{id}/status")
    public CustomerResponseDTO updateCustomerStatus(
            @PathVariable Long id,
            @RequestParam CustomerStatus status) {
        return customerServices.updateCustomerStatus(id, status);
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

    @GetMapping("/orders/number")
    public OrderResponseDTO getOrderByNumber(
            @RequestParam String orderNumber) {
        return orderServices.getOrderByNumber(orderNumber);
    }

    @GetMapping("/orders/customer/{customerId}")
    public List<OrderResponseDTO> getCustomerOrders(
            @PathVariable Long customerId) {
        return orderServices.getCustomerOrders(customerId);
    }

    @GetMapping("/orders/employee/{employeeId}")
    public List<OrderResponseDTO> getEmployeeOrders(
            @PathVariable Long employeeId) {
        return orderServices.getEmployeeOrders(employeeId);
    }

    @GetMapping("/orders/status")
    public List<OrderResponseDTO> getOrdersByStatus(
            @RequestParam OrderStatus status) {
        return orderServices.getOrdersByStatus(status);
    }

    @PostMapping("/orders")
    public OrderResponseDTO createOrder(
            @RequestBody OrderCreateRequestDTO request) {
        return orderServices.createOrder(request);
    }

    @PutMapping("/orders/{id}/status")
    public OrderResponseDTO updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return orderServices.updateOrderStatus(id, status);
    }

    @PutMapping("/orders/{id}/cancel")
    public OrderResponseDTO cancelOrder(
            @PathVariable Long id) {
        return orderServices.cancelOrder(id);
    }

    @GetMapping("/inventory/product/{productId}")
    public InventoryResponseDTO getInventoryByProduct(
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

    @PostMapping("/inventory/stock/add")
    public InventoryResponseDTO addStock(
            @RequestBody StockRequestDTO request) {
        return inventoryServices.addStock(request);
    }

    @PostMapping("/inventory/stock/remove")
    public InventoryResponseDTO removeStock(
            @RequestBody StockRequestDTO request) {
        return inventoryServices.removeStock(request);
    }

    @PostMapping("/inventory/stock/adjust")
    public InventoryResponseDTO adjustStock(
            @RequestBody StockRequestDTO request) {
        return inventoryServices.adjustStock(request);
    }
}
