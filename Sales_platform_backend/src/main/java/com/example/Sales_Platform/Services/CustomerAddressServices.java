package com.example.Sales_Platform.Services;

import java.util.List;

import com.example.Sales_Platform.DTO.AddressRequestDTO;
import com.example.Sales_Platform.DTO.AddressResponseDTO;

public interface CustomerAddressServices {

    // Add address
    AddressResponseDTO addAddress(
            AddressRequestDTO request);

    // Get all addresses of customer
    List<AddressResponseDTO> getCustomerAddresses(
            Long customerId);

    // Get address by ID
    AddressResponseDTO getAddressById(
            Long id);

    // Update address
    AddressResponseDTO updateAddress(
            Long id,
            AddressRequestDTO request);

    // Delete address
    void deleteAddress(Long id);

    // Set default address
    AddressResponseDTO setDefaultAddress(
            Long id);
}