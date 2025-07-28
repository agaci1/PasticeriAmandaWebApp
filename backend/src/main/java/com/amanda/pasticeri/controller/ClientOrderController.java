package com.amanda.pasticeri.controller;

import com.amanda.pasticeri.model.Order;
import com.amanda.pasticeri.security.JwtTokenProvider;
import com.amanda.pasticeri.service.OrderService;
import com.amanda.pasticeri.service.EmailServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = {"https://pasticeriamanda.com", "https://www.pasticeriamanda.com", "http://localhost:3000"}, allowCredentials = "true")
public class ClientOrderController {

    private final OrderService orderService;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailServiceImpl emailService;

    public ClientOrderController(OrderService orderService, JwtTokenProvider jwtTokenProvider, EmailServiceImpl emailService) {
        this.orderService = orderService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
    }

    @GetMapping("/orders")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public List<Order> getMyOrders(@RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        String email = jwtTokenProvider.getEmailFromToken(token);
        return orderService.getOrdersByEmail(email);
    }

    @PostMapping("/orders/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> cancelMyOrder(@PathVariable("id") Long id, @RequestHeader("Authorization") String tokenHeader) {
        System.out.println("🎯 CLIENT CANCEL ORDER ENDPOINT HIT - Order ID: " + id);
        try {
            String token = tokenHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getEmailFromToken(token);
            orderService.cancelMyOrder(id, email);
            return ResponseEntity.ok().body(Map.of("message", "Order canceled successfully."));
        } catch (Exception e) {
            System.out.println("❌ CLIENT CANCEL ORDER ERROR: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/test-email")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> testEmail(@RequestHeader("Authorization") String tokenHeader) {
        try {
            String token = tokenHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getEmailFromToken(token);
            
            emailService.sendTestEmail(email);
            
            return ResponseEntity.ok().body(Map.of("message", "Test email sent successfully."));
        } catch (Exception e) {
            System.out.println("❌ TEST EMAIL ERROR: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 