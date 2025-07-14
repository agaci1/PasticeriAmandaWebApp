package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Order;
import com.amanda.pasticeri.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository repository;

    @Autowired
    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    public List<Order> getAll() {
        return repository.findAll();
    }

    public Order save(Order order) {
        return repository.save(order);
    }
}
