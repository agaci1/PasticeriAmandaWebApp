package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AsyncEmailService {

    private static final String ADMIN_EMAIL = "pasticeriamanda@gmail.com";

    @Autowired
    private EmailService emailService;

    @Async("emailTaskExecutor")
    public void sendOrderNotifications(Order order) {
        try {
            emailService.sendOrderConfirmation(order.getCustomerEmail(), order);
            System.out.println("✅ Order confirmation email sent to: " + order.getCustomerEmail());
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send order confirmation email: " + e.getMessage());
        }

        try {
            emailService.sendAdminNotification(ADMIN_EMAIL, order);
            System.out.println("✅ Admin notification email sent for order ID: " + order.getId());
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send admin notification email: " + e.getMessage());
        }
    }

    @Async("emailTaskExecutor")
    public void sendPriceSetNotification(Order order) {
        try {
            emailService.sendPriceSetEmail(order.getCustomerEmail(), order);
            System.out.println("✅ Price set email sent to: " + order.getCustomerEmail());
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send price set email: " + e.getMessage());
        }
    }

    @Async("emailTaskExecutor")
    public void sendCancellationNotifications(Order order) {
        try {
            emailService.sendOrderCancelledEmail(order.getCustomerEmail(), order);
            System.out.println("✅ Cancellation email sent to customer");
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send cancellation email to customer: " + e.getMessage());
        }

        try {
            emailService.sendAdminNotification(ADMIN_EMAIL, order);
            System.out.println("✅ Admin cancellation notification sent");
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send admin cancellation notification: " + e.getMessage());
        }
    }
}
