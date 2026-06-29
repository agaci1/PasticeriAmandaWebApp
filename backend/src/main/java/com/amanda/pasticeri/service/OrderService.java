package com.amanda.pasticeri.service;

import com.amanda.pasticeri.dto.MenuOrderDto;
import com.amanda.pasticeri.dto.OrderRequestDto;
import com.amanda.pasticeri.dto.CartOrderDto;
import com.amanda.pasticeri.model.Order;
import com.amanda.pasticeri.model.Product;
import com.amanda.pasticeri.repository.OrderRepository;
import com.amanda.pasticeri.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AsyncEmailService asyncEmailService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    public Order save(Order order) {
        logger.info("💾 Saving order: {}", order.getProductName());
        Order savedOrder = orderRepository.save(order);

        logger.info("✅ ORDER SAVED with ID: {}", savedOrder.getId());
        logger.info("📧 Triggering asyncEmailService.sendOrderNotifications for order ID: {}", savedOrder.getId());

        asyncEmailService.sendOrderNotifications(savedOrder);

        logger.info("✅ Email notification task queued for order ID: {}", savedOrder.getId());
        return savedOrder;
    }

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByCustomerEmail(email);
    }

    public void placeCustomOrder(OrderRequestDto dto) {
        logger.info("📝 placeCustomOrder called with product: {}", dto.getProductName());
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

    public Order placeCustomOrder(OrderRequestDto dto, String email) {
        logger.info("📝 placeCustomOrder called with email: {}, product: {}", email, dto.getProductName());
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
                        logger.error("❌ Failed to save image: {}", e.getMessage(), e);
                    }
                }
            }
            order.setImageUrls(urls.toString());
        }

        // Set initial status and order type
        order.setStatus("pending-quote");
        order.setOrderType("custom");

        return save(order);
    }

    public void placeMenuOrder(MenuOrderDto dto) {
        logger.info("📝 placeMenuOrder called");
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
                logger.warn("⚠️ Failed to parse delivery date/time: {}", e.getMessage());
            }
        }

        save(order);
    }

    public void placeCartOrder(CartOrderDto cartOrderDto, String authenticatedEmail) {
        logger.info("📝 placeCartOrder called for email: {}", authenticatedEmail);
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
                logger.warn("⚠️ Failed to parse delivery date/time: {}", e.getMessage());
            }
        }
        
        logger.info("💾 Saving cart order to database");
        orderRepository.save(order);

        logger.info("📧 Triggering asyncEmailService.sendOrderNotifications for cart order ID: {}", order.getId());
        asyncEmailService.sendOrderNotifications(order);
        logger.info("✅ Email notification task queued for cart order ID: {}", order.getId());
    }

    public void setOrderPrice(Long id, double price) {
        logger.info("💰 setOrderPrice called for order ID: {} with price: {}", id, price);
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setTotalPrice(price);
        order.setStatus("pending");
        orderRepository.save(order);

        logger.info("📧 Triggering asyncEmailService.sendPriceSetNotification for order ID: {}", id);
        asyncEmailService.sendPriceSetNotification(order);
        logger.info("✅ Price set email notification task queued for order ID: {}", id);
    }

    public void markOrderComplete(Long id) {
        logger.info("✅ markOrderComplete called for order ID: {}", id);
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("completed");
        orderRepository.save(order);
        
        logger.info("📧 Triggering asyncEmailService.sendCompletionNotifications for order ID: {}", id);
        asyncEmailService.sendCompletionNotifications(order);
        logger.info("✅ Completion email notification task queued for order ID: {}", id);
    }

    public void cancelOrder(Long id) {
        logger.info("❌ cancelOrder called for order ID: {}", id);
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("canceled");
        orderRepository.save(order);
        
        logger.info("📧 Triggering asyncEmailService.sendCancellationNotifications for order ID: {}", id);
        asyncEmailService.sendCancellationNotifications(order);
        logger.info("✅ Cancellation email notification task queued for order ID: {}", id);
    }

    public void cancelMyOrder(Long id, String userEmail) {
        logger.info("🔍 Starting cancelMyOrder for ID: {}, User: {}", id, userEmail);
        
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        logger.info("📋 Found order: ID={}, Status={}, Email={}", order.getId(), order.getStatus(), order.getCustomerEmail());
        logger.info("📸 Image URLs: {}", (order.getImageUrls() != null ? order.getImageUrls() : "null"));
        
        // Verify the order belongs to the user
        if (!order.getCustomerEmail().equals(userEmail)) {
            logger.error("❌ User {} attempted to cancel order belonging to {}", userEmail, order.getCustomerEmail());
            throw new RuntimeException("You can only cancel your own orders");
        }
        
        // Check if order is not already completed or canceled
        if ("completed".equals(order.getStatus()) || "canceled".equals(order.getStatus())) {
            logger.warn("⚠️ Cannot cancel order {} - already in status: {}", id, order.getStatus());
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
            
            logger.info("⏰ Custom order time: {}, Current time: {}, Difference: {}", orderTime, currentTime, (orderTime - currentTime));
            
            if (orderTime - currentTime <= oneDay) {
                logger.error("❌ Custom order cancellation rejected - less than 1 day before order date");
                throw new RuntimeException("Custom orders can only be cancelled at least 1 day before the due date");
            }
        } else {
            // ✅ Menu orders: 5 hours before delivery time
            if (order.getDeliveryDateTime() != null) {
                long deliveryTime = order.getDeliveryDateTime().toInstant(java.time.ZoneOffset.UTC).toEpochMilli();
                long currentTime = System.currentTimeMillis();
                long fiveHours = 5 * 60 * 60 * 1000;
                
                logger.info("⏰ Menu order delivery time: {}, Current time: {}, Difference: {}", deliveryTime, currentTime, (deliveryTime - currentTime));
                
                if (deliveryTime - currentTime <= fiveHours) {
                    logger.error("❌ Menu order cancellation rejected - less than 5 hours before delivery");
                    throw new RuntimeException("Menu orders can only be cancelled at least 5 hours before the delivery time");
                }
            } else {
                logger.error("❌ Menu order has no delivery date/time");
                throw new RuntimeException("Menu order must have a delivery date/time to be cancelled");
            }
        }
        
        logger.info("✅ Order can be cancelled, updating status to 'canceled'");
        
        // Update the status directly
        order.setStatus("canceled");
        
        logger.info("💾 Saving updated order...");
        try {
            orderRepository.save(order);
            logger.info("✅ Order saved successfully");
        } catch (Exception e) {
            logger.error("❌ Database save error: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save order: " + e.getMessage());
        }
        
        logger.info("📧 Triggering asyncEmailService.sendCancellationNotifications for order ID: {}", id);
        asyncEmailService.sendCancellationNotifications(order);
        logger.info("✅ Cancellation email notification task queued for order ID: {}", id);
    }
    
    // ✅ Auto-complete menu orders when delivery time passes
    public void autoCompleteMenuOrders() {
        logger.debug("⏰ autoCompleteMenuOrders scheduled task running");
        List<Order> pendingMenuOrders = orderRepository.findAll().stream()
            .filter(order -> "pending".equals(order.getStatus()) && 
                           order.getDeliveryDateTime() != null &&
                           order.getDeliveryDateTime().isBefore(LocalDateTime.now()))
            .toList();
        
        logger.info("📋 Found {} pending menu orders to auto-complete", pendingMenuOrders.size());
        
        for (Order order : pendingMenuOrders) {
            logger.info("✅ Auto-completing menu order ID: {}", order.getId());
            order.setStatus("completed");
            orderRepository.save(order);
            asyncEmailService.sendCompletionNotifications(order);
        }
    }
}
