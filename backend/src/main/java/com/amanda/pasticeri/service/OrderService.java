package com.amanda.pasticeri.service;

import com.amanda.pasticeri.dto.MenuOrderDto;
import com.amanda.pasticeri.dto.OrderRequestDto;
import com.amanda.pasticeri.dto.CartOrderDto;
import com.amanda.pasticeri.model.Order;
import com.amanda.pasticeri.model.Product;
import com.amanda.pasticeri.repository.OrderRepository;
import com.amanda.pasticeri.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    public Order save(Order order) {
        Order savedOrder = orderRepository.save(order);

        // ✅ Add this log to confirm the order is saved
        System.out.println("✅ ORDER SAVED with ID: " + savedOrder.getId());

        // Email logic
        emailService.sendOrderConfirmation(order.getCustomerEmail(), savedOrder);
        emailService.sendAdminNotification("pasticeriamanda@gmail.com", savedOrder);

        return savedOrder;
    }

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByCustomerEmail(email);
    }

    public void placeCustomOrder(OrderRequestDto dto) {
        Order order = new Order();
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerEmail(dto.getCustomerEmail());
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setProductName(dto.getProductName());
        order.setNumberOfPersons(dto.getNumberOfPersons());
        order.setCustomNote(dto.getCustomNote());
        order.setFlavour(dto.getFlavour()); // ✅ Set flavor

        if (dto.getOrderDate() != null) {
            order.setOrderDate(LocalDate.parse(dto.getOrderDate()));
        }

        List<MultipartFile> files = dto.getUploadedImages();
        if (files != null && !files.isEmpty()) {
            StringBuilder urls = new StringBuilder();
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    String imageUrl = imageUploadService.saveImage(file);
                    if (urls.length() > 0) urls.append(",");
                    urls.append(imageUrl);
                }
            }
            order.setImageUrls(urls.toString());
        }

        // No price yet, admin will update later
        save(order);
    }

    public void placeCustomOrder(OrderRequestDto dto, String email) {
        Order order = new Order();

        // Required fields
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerEmail(email);
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setProductName(dto.getProductName());
        order.setNumberOfPersons(dto.getNumberOfPersons());
        order.setCustomNote(dto.getCustomNote());
        order.setFlavour(dto.getFlavour()); // ✅ Set flavor

        if (dto.getOrderDate() != null && !dto.getOrderDate().isEmpty()) {
            order.setOrderDate(LocalDate.parse(dto.getOrderDate()));
        } else {
            order.setOrderDate(LocalDate.now());
        }

        // Handle image uploads
        List<MultipartFile> files = dto.getUploadedImages();
        if (files != null && !files.isEmpty()) {
            StringBuilder urls = new StringBuilder();
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    try {
                        String imageUrl = imageUploadService.saveImage(file);
                        if (urls.length() > 0) urls.append(",");
                        urls.append(imageUrl);
                    } catch (RuntimeException e) {
                        System.err.println("❌ Failed to save image: " + e.getMessage());
                    }
                }
            }
            order.setImageUrls(urls.toString());
        }

        // Set initial status and order type
        order.setStatus("pending-quote");
        order.setOrderType("custom");

        // Save the order
        save(order);
    }

    public void placeMenuOrder(MenuOrderDto dto) {
        // Get product details to set product name and calculate total price
        Product product = productRepository.findById(dto.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found: " + dto.getProductId()));
        
        double totalPrice = product.getPrice() * dto.getQuantity();
        
        Order order = new Order();
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerEmail(dto.getCustomerEmail());
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setProductName(product.getName());
        order.setNumberOfPersons(dto.getNumberOfPersons());
        order.setOrderDate(LocalDate.now());
        order.setTotalPrice(totalPrice);
        order.setStatus("pending");
        order.setOrderType("menu");

        // Handle delivery date/time for menu orders
        if (dto.getDeliveryDateTime() != null && !dto.getDeliveryDateTime().isEmpty()) {
            try {
                LocalDateTime deliveryDateTime = LocalDateTime.parse(dto.getDeliveryDateTime());
                order.setDeliveryDateTime(deliveryDateTime);
            } catch (Exception e) {
                System.out.println("⚠️ Failed to parse delivery date/time: " + e.getMessage());
            }
        }

        save(order);
    }

    public void placeCartOrder(CartOrderDto cartOrderDto, String authenticatedEmail) {
        // Calculate total and build product names
        double total = 0;
        int totalQuantity = 0;
        StringBuilder productNames = new StringBuilder();
        
        for (CartOrderDto.CartItem item : cartOrderDto.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            
            double itemTotal = product.getPrice() * item.getQuantity();
            total += itemTotal;
            totalQuantity += item.getQuantity();
            
            if (productNames.length() > 0) productNames.append(", ");
            productNames.append(product.getName());
        }
        
        // Save the whole cart as a single Order entity
        Order order = new Order();
        order.setCustomerName(cartOrderDto.getName());
        order.setCustomerEmail(authenticatedEmail);
        order.setCustomerPhone(cartOrderDto.getPhone());
        order.setProductName(productNames.toString());
        order.setNumberOfPersons(totalQuantity);
        order.setOrderDate(LocalDate.now());
        order.setTotalPrice(total);
        order.setStatus("pending");
        order.setOrderType("menu"); // ✅ Mark as menu order
        
        // ✅ Handle delivery date/time for menu orders
        if (cartOrderDto.getDeliveryDateTime() != null && !cartOrderDto.getDeliveryDateTime().isEmpty()) {
            try {
                LocalDateTime deliveryDateTime = LocalDateTime.parse(cartOrderDto.getDeliveryDateTime());
                order.setDeliveryDateTime(deliveryDateTime);
            } catch (Exception e) {
                System.out.println("⚠️ Failed to parse delivery date/time: " + e.getMessage());
            }
        }
        orderRepository.save(order);

        // Use standardized templates for emails
        emailService.sendOrderConfirmation(authenticatedEmail, order);
        emailService.sendAdminNotification("pasticeriamanda@gmail.com", order);
    }

    public void setOrderPrice(Long id, double price) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setTotalPrice(price);
        order.setStatus("pending");
        orderRepository.save(order);
        // Send beautiful email to client with price
        emailService.sendPriceSetEmail(order.getCustomerEmail(), order);
    }

    public void markOrderComplete(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("completed");
        orderRepository.save(order);
        // Optionally send email to client or admin
    }

    public void cancelOrder(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("canceled");
        orderRepository.save(order);
        // Optionally send email to client or admin
    }

    public void cancelMyOrder(Long id, String userEmail) {
        System.out.println("🔍 Starting cancelMyOrder for ID: " + id + ", User: " + userEmail);
        
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        System.out.println("📋 Found order: ID=" + order.getId() + ", Status=" + order.getStatus() + ", Email=" + order.getCustomerEmail());
        System.out.println("📸 Image URLs: " + (order.getImageUrls() != null ? order.getImageUrls() : "null"));
        
        // Verify the order belongs to the user
        if (!order.getCustomerEmail().equals(userEmail)) {
            throw new RuntimeException("You can only cancel your own orders");
        }
        
        // Check if order is not already completed or canceled
        if ("completed".equals(order.getStatus()) || "canceled".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel this order");
        }
        
        // ✅ Different cancellation rules for menu vs custom orders
        boolean isCustomOrder = (order.getCustomNote() != null && !order.getCustomNote().trim().isEmpty()) || 
                               (order.getFlavour() != null && !order.getFlavour().trim().isEmpty()) ||
                               (order.getImageUrls() != null && !order.getImageUrls().trim().isEmpty()) ||
                               "pending-quote".equals(order.getStatus()) ||
                               "custom".equals(order.getOrderType());
        
        if (isCustomOrder) {
            // ✅ Custom orders: 1 day before order date
            long orderTime = order.getOrderDate().atStartOfDay().toInstant(java.time.ZoneOffset.UTC).toEpochMilli();
            long currentTime = System.currentTimeMillis();
            long oneDay = 24 * 60 * 60 * 1000;
            
            System.out.println("⏰ Custom order time: " + orderTime + ", Current time: " + currentTime + ", Difference: " + (orderTime - currentTime));
            
            if (orderTime - currentTime <= oneDay) {
                throw new RuntimeException("Custom orders can only be cancelled at least 1 day before the due date");
            }
        } else {
            // ✅ Menu orders: 5 hours before delivery time
            if (order.getDeliveryDateTime() != null) {
                long deliveryTime = order.getDeliveryDateTime().toInstant(java.time.ZoneOffset.UTC).toEpochMilli();
                long currentTime = System.currentTimeMillis();
                long fiveHours = 5 * 60 * 60 * 1000;
                
                System.out.println("⏰ Menu order delivery time: " + deliveryTime + ", Current time: " + currentTime + ", Difference: " + (deliveryTime - currentTime));
                
                if (deliveryTime - currentTime <= fiveHours) {
                    throw new RuntimeException("Menu orders can only be cancelled at least 5 hours before the delivery time");
                }
            } else {
                throw new RuntimeException("Menu order must have a delivery date/time to be cancelled");
            }
        }
        
        System.out.println("✅ Order can be cancelled, updating status to 'canceled'");
        
        // Update the status directly
        order.setStatus("canceled");
        
        System.out.println("💾 Saving updated order...");
        try {
            orderRepository.save(order);
            System.out.println("✅ Order saved successfully");
        } catch (Exception e) {
            System.err.println("❌ Database save error: " + e.getMessage());
            System.err.println("❌ Error type: " + e.getClass().getSimpleName());
            e.printStackTrace();
            throw new RuntimeException("Failed to save order: " + e.getMessage());
        }
        
        // Send beautiful cancellation emails (with error handling)
        try {
            emailService.sendOrderCancelledEmail(order.getCustomerEmail(), order);
            System.out.println("✅ Cancellation email sent to customer");
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send cancellation email to customer: " + e.getMessage());
            // Don't throw the error - order cancellation was successful
        }
        
        try {
            emailService.sendAdminNotification("pasticeriamanda@gmail.com", order);
            System.out.println("✅ Admin notification email sent");
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send admin notification email: " + e.getMessage());
            // Don't throw the error - order cancellation was successful
        }
    }
    
    // ✅ Auto-complete menu orders when delivery time passes
    public void autoCompleteMenuOrders() {
        List<Order> pendingMenuOrders = orderRepository.findAll().stream()
            .filter(order -> "pending".equals(order.getStatus()) && 
                           order.getDeliveryDateTime() != null &&
                           order.getDeliveryDateTime().isBefore(LocalDateTime.now()))
            .toList();
        
        for (Order order : pendingMenuOrders) {
            order.setStatus("completed");
            orderRepository.save(order);
            System.out.println("✅ Auto-completed menu order ID: " + order.getId());
        }
    }
}
