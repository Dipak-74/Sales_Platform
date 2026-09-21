package com.example.Sales_Platform.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.Customer;
import com.example.Sales_Platform.Intities.CustomerStatus;

public interface CustomerRepo extends JpaRepository<Customer, Long> {
	Optional<Customer> findByUser_Id(Long userId);

    Optional<Customer> findByCustomerCode(String customerCode);

    List<Customer> findByEmail(String email);

    List<Customer> findByStatus(CustomerStatus status);

    List<Customer> findByNameContainingIgnoreCase(String name);

    List<Customer> findByPhone(String phone);
}
