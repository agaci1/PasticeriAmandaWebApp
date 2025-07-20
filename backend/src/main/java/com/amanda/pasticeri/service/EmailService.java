package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Order;

public interface EmailService {
    void sendOrderConfirmation(String to, Order order);
    void sendAdminNotification(String to, Order order);
    void sendPasswordResetEmail(String to, String resetLink);
}
