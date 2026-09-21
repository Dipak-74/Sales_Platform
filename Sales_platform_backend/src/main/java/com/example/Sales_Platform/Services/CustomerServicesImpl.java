package com.example.Sales_Platform.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Sales_Platform.DTO.CustomerRequestDTO;
import com.example.Sales_Platform.DTO.CustomerResponseDTO;
import com.example.Sales_Platform.Intities.Customer;
import com.example.Sales_Platform.Intities.CustomerStatus;
import com.example.Sales_Platform.Intities.User;
import com.example.Sales_Platform.Repo.CustomerRepo;
import com.example.Sales_Platform.Repo.UserRepo;

@Service
public class CustomerServicesImpl
        implements CustomerServices {

    @Autowired
    CustomerRepo customerRepo;

    @Autowired
    UserRepo userRepo;


    // CREATE CUSTOMER
    @Override
    public CustomerResponseDTO createCustomer(
            CustomerRequestDTO request) {

        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Customer customer = new Customer();

        customer.setUser(user);

        customer.setName(user.getName());
        customer.setEmail(user.getEmail());

        customer.setPhone(request.getPhone());

        customer.setStatus(CustomerStatus.ACTIVE);

        customer.setCustomerCode(
                "CUS" + System.currentTimeMillis());

        Customer savedCustomer =
                customerRepo.save(customer);

        return mapToResponseDTO(savedCustomer);
    }


    // GET ALL
    @Override
    public List<CustomerResponseDTO>
    getAllCustomers() {

        return customerRepo.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // GET BY ID
    @Override
    public CustomerResponseDTO
    getCustomerById(Long id) {

        Customer customer = customerRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found"));

        return mapToResponseDTO(customer);
    }


    // GET BY USER ID
    @Override
    public CustomerResponseDTO
    getCustomerByUserId(Long userId) {

        return customerRepo.findByUser_Id(userId)
                .map(this::mapToResponseDTO)
                .orElseGet(() -> {
                    CustomerRequestDTO request = new CustomerRequestDTO();
                    request.setUserId(userId);
                    return createCustomer(request);
                });
    }


    // GET BY CUSTOMER CODE
    @Override
    public CustomerResponseDTO
    getCustomerByCode(String customerCode) {

        Customer customer =
                customerRepo
                .findByCustomerCode(customerCode)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found"));

        return mapToResponseDTO(customer);
    }


    // SEARCH BY NAME
    @Override
    public List<CustomerResponseDTO>
    searchCustomers(String name) {

        return customerRepo
                .findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // GET BY PHONE
    @Override
    public List<CustomerResponseDTO>
    getCustomersByPhone(String phone) {

        return customerRepo
                .findByPhone(phone)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // GET BY STATUS
    @Override
    public List<CustomerResponseDTO>
    getCustomersByStatus(CustomerStatus status) {

        return customerRepo
                .findByStatus(status)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // UPDATE
    @Override
    public CustomerResponseDTO updateCustomer(
            Long id,
            CustomerRequestDTO request) {

        Customer customer =
                customerRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found"));

        customer.setPhone(request.getPhone());

        Customer updatedCustomer =
                customerRepo.save(customer);

        return mapToResponseDTO(updatedCustomer);
    }


    // UPDATE STATUS
    @Override
    public CustomerResponseDTO updateCustomerStatus(
            Long id,
            CustomerStatus status) {

        Customer customer =
                customerRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found"));

        customer.setStatus(status);

        Customer updatedCustomer =
                customerRepo.save(customer);

        return mapToResponseDTO(updatedCustomer);
    }


    // ENTITY → DTO
    private CustomerResponseDTO mapToResponseDTO(
            Customer customer) {

        CustomerResponseDTO dto =
                new CustomerResponseDTO();

        dto.setCustomerId(customer.getId());

        dto.setUserId(
                customer.getUser().getId());

        dto.setCustomerCode(
                customer.getCustomerCode());

        dto.setName(
                customer.getName());

        dto.setEmail(
                customer.getEmail());

        dto.setPhone(
                customer.getPhone());

        dto.setStatus(
                customer.getStatus());

        return dto;
    }
}