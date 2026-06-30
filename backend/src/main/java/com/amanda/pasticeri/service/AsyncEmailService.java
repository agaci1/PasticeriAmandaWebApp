package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class AsyncEmailService {

    private static final Logger logger = LoggerFactory.getLogger(AsyncEmailService.class);
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
        logger.info("🔔 sendOrderNotifications triggered for order ID: {} to customer: {}", order.getId(), order.getCustomerEmail());
        executor.execute(() -> {
            if (hasCustomerEmail(order)) {
                try {
                    logger.info("📧 Attempting to send order confirmation to: {}", order.getCustomerEmail());
                    emailService.sendOrderConfirmation(order.getCustomerEmail(), order);
                    logger.info("✅ Order confirmation email sent to: {}", order.getCustomerEmail());
                } catch (Exception e) {
                    logger.error("⚠️ Failed to send order confirmation email: {}", e.getMessage(), e);
                }
            } else {
                logger.warn("⚠️ Skipping customer email — no customer email on order #" + order.getId());
            }

            try {
                logger.info("📧 Attempting to send admin notification for order ID: {}", order.getId());
                emailService.sendAdminNotification(ADMIN_EMAIL, order);
                logger.info("✅ Admin notification email sent for order ID: {}", order.getId());
            } catch (Exception e) {
                logger.error("⚠️ Failed to send admin notification email: {}", e.getMessage(), e);
            }
        });
    }

    public void sendPriceSetNotification(Order order) {
        logger.info("💰 sendPriceSetNotification triggered for order ID: {}", order.getId());
        executor.execute(() -> {
            if (hasCustomerEmail(order)) {
                try {
                    logger.info("📧 Attempting to send price set email to: {}", order.getCustomerEmail());
                    emailService.sendPriceSetEmail(order.getCustomerEmail(), order);
                    logger.info("✅ Price set email sent to: {}", order.getCustomerEmail());
                } catch (Exception e) {
                    logger.error("⚠️ Failed to send price set email: {}", e.getMessage(), e);
                }
            } else {
                logger.warn("⚠️ Skipping price email — no customer email on order #" + order.getId());
            }

            try {
                logger.info("📧 Attempting to send admin price-set notification for order ID: {}", order.getId());
                emailService.sendAdminPriceSetNotification(ADMIN_EMAIL, order);
                logger.info("✅ Admin price-set notification sent for order ID: {}", order.getId());
            } catch (Exception e) {
                logger.error("⚠️ Failed to send admin price-set notification: {}", e.getMessage(), e);
            }
        });
    }

    public void sendCancellationNotifications(Order order) {
        logger.info("❌ sendCancellationNotifications triggered for order ID: {}", order.getId());
        executor.execute(() -> {
            if (hasCustomerEmail(order)) {
                try {
                    logger.info("📧 Attempting to send cancellation email to customer: {}", order.getCustomerEmail());
                    emailService.sendOrderCancelledEmail(order.getCustomerEmail(), order);
                    logger.info("✅ Cancellation email sent to customer");
                } catch (Exception e) {
                    logger.error("⚠️ Failed to send cancellation email to customer: {}", e.getMessage(), e);
                }
            }

            try {
                logger.info("📧 Attempting to send admin cancellation notification");
                emailService.sendAdminCancellationNotification(ADMIN_EMAIL, order);
                logger.info("✅ Admin cancellation notification sent");
            } catch (Exception e) {
                logger.error("⚠️ Failed to send admin cancellation notification: {}", e.getMessage(), e);
            }
        });
    }

    public void sendCompletionNotifications(Order order) {
        logger.info("✅ sendCompletionNotifications triggered for order ID: {}", order.getId());
        executor.execute(() -> {
            if (hasCustomerEmail(order)) {
                try {
                    logger.info("📧 Attempting to send completion email to: {}", order.getCustomerEmail());
                    emailService.sendOrderCompletedEmail(order.getCustomerEmail(), order);
                    logger.info("✅ Completion email sent to: {}", order.getCustomerEmail());
                } catch (Exception e) {
                    logger.error("⚠️ Failed to send completion email: {}", e.getMessage(), e);
                }
            }

            try {
                logger.info("📧 Attempting to send admin completion notification");
                emailService.sendAdminCompletionNotification(ADMIN_EMAIL, order);
                logger.info("✅ Admin completion notification sent for order ID: {}", order.getId());
            } catch (Exception e) {
                logger.error("⚠️ Failed to send admin completion notification: {}", e.getMessage(), e);
            }
        });
    }

    private boolean hasCustomerEmail(Order order) {
        return order.getCustomerEmail() != null && !order.getCustomerEmail().isBlank();
    }
}
