package com.amanda.pasticeri.controller;

import com.amanda.pasticeri.dto.MenuOrderDto;
import com.amanda.pasticeri.dto.OrderRequestDto;
import com.amanda.pasticeri.model.Order;
import com.amanda.pasticeri.security.JwtTokenProvider;
import com.amanda.pasticeri.service.OrderService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final JwtTokenProvider jwtTokenProvider;

    public OrderController(OrderService orderService, JwtTokenProvider jwtTokenProvider) {
        this.orderService = orderService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<Order> getAll() {
        return orderService.getAll();
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> adminOnlyStuff() {
        return ResponseEntity.ok("Hello Admin!");
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public List<Order> getMyOrders(@RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        String email = jwtTokenProvider.getEmailFromToken(token);
        return orderService.getOrdersByEmail(email);
    }

    // ✅ FIXED: Secure custom order using token email
    @PostMapping(value = "/custom", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> placeCustomOrder(@ModelAttribute OrderRequestDto orderDto,
                                              @RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        String email = jwtTokenProvider.getEmailFromToken(token);
        orderService.placeCustomOrder(orderDto, email);
        return ResponseEntity.ok("Custom order submitted successfully.");
    }

    // ✅ Menu Order (JSON)
    @PostMapping(value = "/menu", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> placeMenuOrder(@RequestBody MenuOrderDto menuOrderDto) {
        orderService.placeMenuOrder(menuOrderDto);
        return ResponseEntity.ok("Menu order placed successfully.");
    }

    // ✅ Client order history
    @GetMapping("/client/orders")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public List<Order> getClientOrders(@RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        String email = jwtTokenProvider.getEmailFromToken(token);
        return orderService.getOrdersByEmail(email);
    }
}
