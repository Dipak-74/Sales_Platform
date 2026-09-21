package com.example.Sales_Platform.Repo;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Sales_Platform.Intities.Payment;
import com.example.Sales_Platform.Intities.PaymentStatus;

public interface PaymentRepo extends JpaRepository<Payment, Long>{

	Optional<Payment> findByOrder_Id(Long orderId);

    List<Payment> findByTransactionId(String transactionId);

    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);

    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);
}
