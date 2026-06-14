package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class AsyncEmailService {

    private static final String ADMIN_EMAIL = "pasticeriamanda@gmail.com";

    private final EmailService emailService;
    private final ExecutorService executor = Executors.newSingleThreadExecutor(r -> {
        Thread thread = new Thread(r, "email-worker");
        thread.setDaemon(true);
        return thread;
    });

    @Autowired
    public AsyncEmailService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void sendOrderNotifications(Order order) {
        executor.execute(() -> {
            if (hasCustomerEmail(order)) {
                try {
                    emailService.sendOrderConfirmation(order.getCustomerEmail(), order);
                    System.out.println("✅ Order confirmation email sent to: " + order.getCustomerEmail());
                } catch (Exception e) {
                    System.err.println("⚠️ Failed to send order confirmation email: " + e.getMessage());
                }
            } else {
                System.err.println("⚠️ Skipping customer email — no customer email on order #" + order.getId());
            }

            try {
                emailService.sendAdminNotification(ADMIN_EMAIL, order);
                System.out.println("✅ Admin notification email sent for order ID: " + order.getId());
            } catch (Exception e) {
                System.err.println("⚠️ Failed to send admin notification email: " + e.getMessage());
            }
        });
    }

    public void sendPriceSetNotification(Order order) {
        executor.execute(() -> {
            if (!hasCustomerEmail(order)) {
                System.err.println("⚠️ Skipping price email — no customer email on order #" + order.getId());
                return;
            }

            try {
                emailService.sendPriceSetEmail(order.getCustomerEmail(), order);
                System.out.println("✅ Price set email sent to: " + order.getCustomerEmail());
            } catch (Exception e) {
                System.err.println("⚠️ Failed to send price set email: " + e.getMessage());
            }
        });
    }

    public void sendCancellationNotifications(Order order) {
        executor.execute(() -> {
            if (hasCustomerEmail(order)) {
                try {
                    emailService.sendOrderCancelledEmail(order.getCustomerEmail(), order);
                    System.out.println("✅ Cancellation email sent to customer");
                } catch (Exception e) {
                    System.err.println("⚠️ Failed to send cancellation email to customer: " + e.getMessage());
                }
            }

            try {
                emailService.sendAdminNotification(ADMIN_EMAIL, order);
                System.out.println("✅ Admin cancellation notification sent");
            } catch (Exception e) {
                System.err.println("⚠️ Failed to send admin cancellation notification: " + e.getMessage());
            }
        });
    }

    public void sendCompletionNotifications(Order order) {
        executor.execute(() -> {
            if (hasCustomerEmail(order)) {
                try {
                    emailService.sendOrderCompletedEmail(order.getCustomerEmail(), order);
                    System.out.println("✅ Completion email sent to: " + order.getCustomerEmail());
                } catch (Exception e) {
                    System.err.println("⚠️ Failed to send completion email: " + e.getMessage());
                }
            }

            try {
                emailService.sendAdminNotification(ADMIN_EMAIL, order);
                System.out.println("✅ Admin completion notification sent for order ID: " + order.getId());
            } catch (Exception e) {
                System.err.println("⚠️ Failed to send admin completion notification: " + e.getMessage());
            }
        });
    }

    private boolean hasCustomerEmail(Order order) {
        return order.getCustomerEmail() != null && !order.getCustomerEmail().isBlank();
    }
}
