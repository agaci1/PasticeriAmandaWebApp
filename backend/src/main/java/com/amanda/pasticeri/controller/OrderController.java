package com.amanda.pasticeri.controller;

import com.amanda.pasticeri.dto.MenuOrderDto;
import com.amanda.pasticeri.dto.OrderRequestDto;
import com.amanda.pasticeri.dto.CartOrderDto;
import com.amanda.pasticeri.model.Order;
import com.amanda.pasticeri.security.JwtTokenProvider;
import com.amanda.pasticeri.service.OrderService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public ResponseEntity<?> placeCartOrder(@RequestBody CartOrderDto cartOrderDto, @RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        String email = jwtTokenProvider.getEmailFromToken(token);
        orderService.placeCartOrder(cartOrderDto, email);
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

    @PutMapping("/{id}/set-price")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> setOrderPrice(@PathVariable Long id, @RequestBody SetPriceRequest request) {
        orderService.setOrderPrice(id, request.getPrice());
        return ResponseEntity.ok("Order price set and client notified.");
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> markOrderComplete(@PathVariable Long id) {
        orderService.markOrderComplete(id);
        return ResponseEntity.ok("Order marked as completed.");
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok("Order canceled.");
    }

    public static class SetPriceRequest {
        private double price;
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
    }
}
