package com.amanda.pasticeri.controller;

import com.amanda.pasticeri.model.Order;
import com.amanda.pasticeri.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @GetMapping
    public List<Order> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        return service.save(order);
    }
}
