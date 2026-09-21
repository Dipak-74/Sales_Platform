package com.example.Sales_Platform.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Sales_Platform.DTO.AddressRequestDTO;
import com.example.Sales_Platform.DTO.AddressResponseDTO;
import com.example.Sales_Platform.Intities.Customer;
import com.example.Sales_Platform.Intities.CustomerAddress;
import com.example.Sales_Platform.Repo.CustomerAddressRepo;
import com.example.Sales_Platform.Repo.CustomerRepo;

@Service
public class CustomerAddressServicesImpl
        implements CustomerAddressServices {

    @Autowired
    CustomerAddressRepo customerAddressRepo;

    @Autowired
    CustomerRepo customerRepo;


    // ADD ADDRESS
    @Override
    @Transactional
    public AddressResponseDTO addAddress(
            AddressRequestDTO request) {

        Customer customer =
                customerRepo.findById(request.getCustomerId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {

            List<CustomerAddress> addresses =
                    customerAddressRepo
                    .findByCustomer_IdAndIsDefault(
                            request.getCustomerId(),
                            true);

            for (CustomerAddress address : addresses) {
                address.setIsDefault(false);
            }

            customerAddressRepo.saveAll(addresses);
        }

        CustomerAddress address =
                new CustomerAddress();

        address.setCustomer(customer);
        address.setAddressLine(
                request.getAddressLine());
        address.setCity(
                request.getCity());
        address.setState(
                request.getState());
        address.setPincode(
                request.getPincode());
        address.setCountry(
                request.getCountry());
        address.setAddressType(
                request.getAddressType());
        address.setIsDefault(
                request.getIsDefault());

        CustomerAddress savedAddress =
                customerAddressRepo.save(address);

        return mapToResponseDTO(savedAddress);
    }


    // GET CUSTOMER ADDRESSES
    @Override
    public List<AddressResponseDTO>
    getCustomerAddresses(Long customerId) {

        return customerAddressRepo
                .findByCustomer_Id(customerId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // GET ADDRESS BY ID
    @Override
    public AddressResponseDTO
    getAddressById(Long id) {

        CustomerAddress address =
                customerAddressRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Address not found"));

        return mapToResponseDTO(address);
    }


    // UPDATE ADDRESS
    @Override
    @Transactional
    public AddressResponseDTO updateAddress(
            Long id,
            AddressRequestDTO request) {

        CustomerAddress address =
                customerAddressRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Address not found"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {

            List<CustomerAddress> addresses =
                    customerAddressRepo
                    .findByCustomer_IdAndIsDefault(
                            address.getCustomer().getId(),
                            true);

            for (CustomerAddress oldAddress : addresses) {

                if (!oldAddress.getId().equals(id)) {
                    oldAddress.setIsDefault(false);
                }
            }

            customerAddressRepo.saveAll(addresses);
        }

        address.setAddressLine(
                request.getAddressLine());
        address.setCity(
                request.getCity());
        address.setState(
                request.getState());
        address.setPincode(
                request.getPincode());
        address.setCountry(
                request.getCountry());
        address.setAddressType(
                request.getAddressType());
        address.setIsDefault(
                request.getIsDefault());

        CustomerAddress updatedAddress =
                customerAddressRepo.save(address);

        return mapToResponseDTO(updatedAddress);
    }


    // DELETE ADDRESS
    @Override
    public void deleteAddress(Long id) {

        CustomerAddress address =
                customerAddressRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Address not found"));

        customerAddressRepo.delete(address);
    }


    // SET DEFAULT ADDRESS
    @Override
    @Transactional
    public AddressResponseDTO setDefaultAddress(
            Long id) {

        CustomerAddress address =
                customerAddressRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Address not found"));

        Long customerId =
                address.getCustomer().getId();

        List<CustomerAddress> addresses =
                customerAddressRepo
                .findByCustomer_IdAndIsDefault(
                        customerId,
                        true);

        for (CustomerAddress oldAddress : addresses) {
            oldAddress.setIsDefault(false);
        }

        customerAddressRepo.saveAll(addresses);

        address.setIsDefault(true);

        CustomerAddress updatedAddress =
                customerAddressRepo.save(address);

        return mapToResponseDTO(updatedAddress);
    }


    // ENTITY → DTO
    private AddressResponseDTO mapToResponseDTO(
            CustomerAddress address) {

        AddressResponseDTO dto =
                new AddressResponseDTO();

        dto.setAddressId(address.getId());

        dto.setCustomerId(
                address.getCustomer().getId());

        dto.setAddressLine(
                address.getAddressLine());

        dto.setCity(
                address.getCity());

        dto.setState(
                address.getState());

        dto.setPincode(
                address.getPincode());

        dto.setCountry(
                address.getCountry());

        dto.setAddressType(
                address.getAddressType());

        dto.setIsDefault(
                address.getIsDefault());

        return dto;
    }
}