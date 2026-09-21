package com.example.Sales_Platform.Services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Sales_Platform.DTO.OrderCreateRequestDTO;
import com.example.Sales_Platform.DTO.OrderItemRequestDTO;
import com.example.Sales_Platform.DTO.OrderItemResponseDTO;
import com.example.Sales_Platform.DTO.OrderResponseDTO;
import com.example.Sales_Platform.Intities.Customer;
import com.example.Sales_Platform.Intities.Employee;
import com.example.Sales_Platform.Intities.Order;
import com.example.Sales_Platform.Intities.OrderItem;
import com.example.Sales_Platform.Intities.OrderStatus;
import com.example.Sales_Platform.Intities.Product;
import com.example.Sales_Platform.Repo.CustomerRepo;
import com.example.Sales_Platform.Repo.EmployeeRepo;
import com.example.Sales_Platform.Repo.OrderRepo;
import com.example.Sales_Platform.Repo.ProductRepo;

@Service
public class OrderServicesImpl
        implements OrderServices {

    @Autowired
    OrderRepo orderRepo;

    @Autowired
    CustomerRepo customerRepo;

    @Autowired
    EmployeeRepo employeeRepo;

    @Autowired
    ProductRepo productRepo;


    // CREATE ORDER
    @Override
    @Transactional
    public OrderResponseDTO createOrder(
            OrderCreateRequestDTO request) {

        Customer customer =
                customerRepo.findById(request.getCustomerId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found"));

        Employee employee = null;

        if (request.getEmployeeId() != null) {

            employee =
                    employeeRepo.findById(
                            request.getEmployeeId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Employee not found"));
        }


        Order order = new Order();

        order.setCustomer(customer);
        order.setEmployee(employee);

        order.setOrderNumber(
                "ORD" + System.currentTimeMillis());

        order.setOrderDate(LocalDateTime.now());

        order.setDiscount(
                request.getDiscount() != null
                        ? request.getDiscount()
                        : BigDecimal.ZERO);

        order.setTax(
                request.getTax() != null
                        ? request.getTax()
                        : BigDecimal.ZERO);

        order.setStatus(OrderStatus.PENDING);


        BigDecimal subtotal = BigDecimal.ZERO;

        List<OrderItem> orderItems =
                new ArrayList<>();


        for (OrderItemRequestDTO itemRequest
                : request.getItems()) {

            Product product =
                    productRepo.findById(
                            itemRequest.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found"));


            BigDecimal unitPrice =
                    product.getSellingPrice();

            BigDecimal quantity =
                    BigDecimal.valueOf(
                            itemRequest.getQuantity());


            BigDecimal itemTotal =
                    unitPrice.multiply(quantity);


            BigDecimal itemDiscount =
                    itemRequest.getDiscount() != null
                            ? itemRequest.getDiscount()
                            : BigDecimal.ZERO;


            itemTotal =
                    itemTotal.subtract(itemDiscount);


            OrderItem orderItem =
                    new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(
                    itemRequest.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setDiscount(itemDiscount);
            orderItem.setTotalPrice(itemTotal);


            orderItems.add(orderItem);

            subtotal =
                    subtotal.add(itemTotal);
        }


        BigDecimal total =
                subtotal
                .subtract(order.getDiscount())
                .add(order.getTax());


        order.setSubtotal(subtotal);
        order.setTotalAmount(total);

        order.setOrderItems(orderItems);


        Order savedOrder =
                orderRepo.save(order);

        return mapToResponseDTO(savedOrder);
    }


    // GET ALL
    @Override
    public List<OrderResponseDTO>
    getAllOrders() {

        return orderRepo.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // GET BY ID
    @Override
    public OrderResponseDTO
    getOrderById(Long id) {

        Order order =
                orderRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"));

        return mapToResponseDTO(order);
    }


    // GET BY ORDER NUMBER
    @Override
    public OrderResponseDTO
    getOrderByNumber(String orderNumber) {

        Order order =
                orderRepo.findByOrderNumber(
                        orderNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"));

        return mapToResponseDTO(order);
    }


    // CUSTOMER ORDERS
    @Override
    public List<OrderResponseDTO>
    getCustomerOrders(Long customerId) {

        return orderRepo
                .findByCustomerId(customerId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // EMPLOYEE ORDERS
    @Override
    public List<OrderResponseDTO>
    getEmployeeOrders(Long employeeId) {

        return orderRepo
                .findByEmployeeId(employeeId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // STATUS FILTER
    @Override
    public List<OrderResponseDTO>
    getOrdersByStatus(OrderStatus status) {

        return orderRepo
                .findByStatus(status)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // UPDATE STATUS
    @Override
    public OrderResponseDTO
    updateOrderStatus(
            Long id,
            OrderStatus status) {

        Order order =
                orderRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"));

        order.setStatus(status);

        Order updatedOrder =
                orderRepo.save(order);

        return mapToResponseDTO(updatedOrder);
    }


    // CANCEL ORDER
    @Override
    public OrderResponseDTO
    cancelOrder(Long id) {

        Order order =
                orderRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"));

        order.setStatus(
                OrderStatus.CANCELLED);

        Order cancelledOrder =
                orderRepo.save(order);

        return mapToResponseDTO(
                cancelledOrder);
    }


    // ENTITY → DTO
    private OrderResponseDTO mapToResponseDTO(
            Order order) {

        OrderResponseDTO dto =
                new OrderResponseDTO();

        dto.setOrderId(order.getId());

        dto.setOrderNumber(
                order.getOrderNumber());

        dto.setCustomerId(
                order.getCustomer().getId());

        dto.setCustomerName(
                order.getCustomer().getName());


        if (order.getEmployee() != null) {

            dto.setEmployeeId(
                    order.getEmployee().getId());

            dto.setEmployeeName(
                    order.getEmployee()
                         .getUser()
                         .getName());
        }


        dto.setOrderDate(
                order.getOrderDate());

        dto.setSubtotal(
                order.getSubtotal());

        dto.setDiscount(
                order.getDiscount());

        dto.setTax(
                order.getTax());

        dto.setTotalAmount(
                order.getTotalAmount());

        dto.setStatus(
                order.getStatus());


        List<OrderItemResponseDTO> itemDTOs =
                order.getOrderItems()
                .stream()
                .map(item -> {

                    OrderItemResponseDTO itemDTO =
                            new OrderItemResponseDTO();

                    itemDTO.setOrderItemId(
                            item.getId());

                    itemDTO.setProductId(
                            item.getProduct().getId());

                    itemDTO.setProductName(
                            item.getProduct().getName());

                    itemDTO.setQuantity(
                            item.getQuantity());

                    itemDTO.setUnitPrice(
                            item.getUnitPrice());

                    itemDTO.setDiscount(
                            item.getDiscount());

                    itemDTO.setTotalPrice(
                            item.getTotalPrice());

                    return itemDTO;

                })
                .toList();


        dto.setItems(itemDTOs);

        return dto;
    }
}