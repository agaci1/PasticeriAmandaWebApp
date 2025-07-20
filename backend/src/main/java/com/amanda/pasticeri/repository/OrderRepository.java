package com.amanda.pasticeri.repository;

import com.amanda.pasticeri.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // The save(Order order) method is already included from JpaRepository.

    // Find all orders by customer's email
    List<Order> findByCustomerEmail(String customerEmail);

    // Find all orders by product name
    List<Order> findByProductNameContainingIgnoreCase(String productName);

    // Find all orders sorted by order date
    List<Order> findAllByOrderByOrderDateDesc();

}
