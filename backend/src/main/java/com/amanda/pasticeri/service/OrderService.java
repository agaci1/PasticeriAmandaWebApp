package com.amanda.pasticeri.service;

import com.amanda.pasticeri.dto.MenuOrderDto;
import com.amanda.pasticeri.dto.OrderRequestDto;
import com.amanda.pasticeri.model.Order;
import com.amanda.pasticeri.model.Product;
import com.amanda.pasticeri.repository.OrderRepository;
import com.amanda.pasticeri.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
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
        order.setCustomerPhone(dto.getCustomerPhoneCustom());
        order.setProductName(dto.getProductName());
        order.setNumberOfPersons(dto.getNumberOfPersons());
        order.setCustomNote(dto.getCustomNote());

        if (dto.getOrderDate() != null) {
            order.setOrderDate(LocalDate.parse(dto.getOrderDate()));
        }

        MultipartFile file = dto.getUploadedImage();
        if (file != null && !file.isEmpty()) {
            String imageUrl = imageUploadService.saveImage(file);
            order.setImageUrl(imageUrl);
        }

        // No price yet, admin will update later
        save(order);
    }

    public void placeCustomOrder(OrderRequestDto dto, String email) {
        Order order = new Order();

        // Required fields
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerEmail(email);
        order.setCustomerPhone(dto.getCustomerPhoneCustom());
        order.setProductName(dto.getProductName());
        order.setNumberOfPersons(dto.getNumberOfPersons());
        order.setCustomNote(dto.getCustomNote());


        if (dto.getOrderDate() != null && !dto.getOrderDate().isEmpty()) {
            order.setOrderDate(LocalDate.parse(dto.getOrderDate()));
        } else {
            order.setOrderDate(LocalDate.now());
        }

        // Optional: image
        MultipartFile file = dto.getUploadedImage();
        if (file != null && !file.isEmpty()) {
            try {
                String imageUrl = imageUploadService.saveImage(file);
                order.setImageUrl(imageUrl);
            } catch (Exception e) {
                System.out.println("⚠️ Image upload failed: " + e.getMessage());
            }
        }

        // Mandatory fields (prevent silent failure)
        order.setStatus("PENDING");
        order.setTotalPrice(0.0); // Admin sets later

        try {
            save(order);
        } catch (Exception e) {
            System.out.println("❌ Failed to save custom order: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void placeMenuOrder(MenuOrderDto dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        double totalPrice = product.getPricePerPerson() * dto.getQuantity();

        Order order = new Order();
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerEmail(dto.getCustomerEmail());
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setProductName(product.getName());
        order.setNumberOfPersons(dto.getQuantity());
        order.setOrderDate(LocalDate.now());
        order.setTotalPrice(totalPrice);

        save(order);
    }
}
