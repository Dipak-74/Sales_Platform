package com.example.Sales_Platform.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.AddressType;
import com.example.Sales_Platform.Intities.CustomerAddress;

public interface CustomerAddressRepo extends JpaRepository<CustomerAddress, Long>{
	List<CustomerAddress> findByCustomer_Id(Long customerId);

    List<CustomerAddress> findByCustomer_IdAndIsDefault(
            Long customerId,
            Boolean isDefault);

    List<CustomerAddress> findByAddressType(
            AddressType addressType);
}
