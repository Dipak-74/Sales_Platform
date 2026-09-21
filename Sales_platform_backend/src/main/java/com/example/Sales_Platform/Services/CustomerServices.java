package com.example.Sales_Platform.Services;

import java.util.List;

import com.example.Sales_Platform.DTO.CustomerRequestDTO;
import com.example.Sales_Platform.DTO.CustomerResponseDTO;
import com.example.Sales_Platform.Intities.CustomerStatus;

public interface CustomerServices {

    // Create
    CustomerResponseDTO createCustomer(
            CustomerRequestDTO request);

    // Get all
    List<CustomerResponseDTO> getAllCustomers();

    // Get by ID
    CustomerResponseDTO getCustomerById(Long id);

    // Get by User ID
    CustomerResponseDTO getCustomerByUserId(Long userId);

    // Get by Customer Code
    CustomerResponseDTO getCustomerByCode(
            String customerCode);

    // Search by name
    List<CustomerResponseDTO> searchCustomers(
            String name);

    // Search by phone
    List<CustomerResponseDTO> getCustomersByPhone(
            String phone);

    // Filter by status
    List<CustomerResponseDTO> getCustomersByStatus(
            CustomerStatus status);

    // Update
    CustomerResponseDTO updateCustomer(
            Long id,
            CustomerRequestDTO request);

    // Active / Inactive
    CustomerResponseDTO updateCustomerStatus(
            Long id,
            CustomerStatus status);
}