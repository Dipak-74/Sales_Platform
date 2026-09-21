package com.example.Sales_Platform.Controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Sales_Platform.DTO.AddressRequestDTO;
import com.example.Sales_Platform.DTO.AddressResponseDTO;
import com.example.Sales_Platform.DTO.CustomerRequestDTO;
import com.example.Sales_Platform.DTO.CustomerResponseDTO;
import com.example.Sales_Platform.DTO.OrderResponseDTO;
import com.example.Sales_Platform.Services.CustomerAddressServices;
import com.example.Sales_Platform.Services.CustomerServices;
import com.example.Sales_Platform.Services.OrderServices;

@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'CUSTOMER')")
public class CustomerController {

    private final CustomerServices customerServices;
    private final CustomerAddressServices customerAddressServices;
    private final OrderServices orderServices;

    public CustomerController(
            CustomerServices customerServices,
            CustomerAddressServices customerAddressServices,
            OrderServices orderServices) {
        this.customerServices = customerServices;
        this.customerAddressServices = customerAddressServices;
        this.orderServices = orderServices;
    }

    @GetMapping("/profile/user/{userId}")
    public CustomerResponseDTO getCustomerByUserId(
            @PathVariable Long userId) {
        return customerServices.getCustomerByUserId(userId);
    }

    @GetMapping("/profile/{id}")
    public CustomerResponseDTO getCustomerById(
            @PathVariable Long id) {
        return customerServices.getCustomerById(id);
    }

    @PutMapping("/profile/{id}")
    public CustomerResponseDTO updateCustomer(
            @PathVariable Long id,
            @RequestBody CustomerRequestDTO request) {
        return customerServices.updateCustomer(id, request);
    }

    @GetMapping("/addresses/customer/{customerId}")
    public List<AddressResponseDTO> getCustomerAddresses(
            @PathVariable Long customerId) {
        return customerAddressServices.getCustomerAddresses(customerId);
    }

    @GetMapping("/addresses/{id}")
    public AddressResponseDTO getAddressById(
            @PathVariable Long id) {
        return customerAddressServices.getAddressById(id);
    }

    @PostMapping("/addresses")
    public AddressResponseDTO addAddress(
            @RequestBody AddressRequestDTO request) {
        return customerAddressServices.addAddress(request);
    }

    @PutMapping("/addresses/{id}")
    public AddressResponseDTO updateAddress(
            @PathVariable Long id,
            @RequestBody AddressRequestDTO request) {
        return customerAddressServices.updateAddress(id, request);
    }

    @DeleteMapping("/addresses/{id}")
    public void deleteAddress(
            @PathVariable Long id) {
        customerAddressServices.deleteAddress(id);
    }

    @PutMapping("/addresses/{id}/default")
    public AddressResponseDTO setDefaultAddress(
            @PathVariable Long id) {
        return customerAddressServices.setDefaultAddress(id);
    }

    @GetMapping("/orders/customer/{customerId}")
    public List<OrderResponseDTO> getCustomerOrders(
            @PathVariable Long customerId) {
        return orderServices.getCustomerOrders(customerId);
    }

    @GetMapping("/orders/{id}")
    public OrderResponseDTO getOrderById(
            @PathVariable Long id) {
        return orderServices.getOrderById(id);
    }
}
