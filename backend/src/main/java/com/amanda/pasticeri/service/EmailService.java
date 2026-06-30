package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Order;

public interface EmailService {
    void sendOrderConfirmation(String to, Order order);
    void sendAdminNotification(String to, Order order);
    void sendAdminPriceSetNotification(String to, Order order);
    void sendAdminCancellationNotification(String to, Order order);
    void sendAdminCompletionNotification(String to, Order order);
    void sendOrderCancelledEmail(String to, Order order);
    void sendPriceSetEmail(String to, Order order);
    void sendOrderCompletedEmail(String to, Order order);
    void sendPasswordResetEmail(String to, String resetLink);

    void sendOrderConfirmation(String to, String htmlContent);
    void sendAdminNotification(String to, String htmlContent);

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        // Implement your email sending logic here using JavaMailSender or similar
        // Example:
        // MimeMessage message = javaMailSender.createMimeMessage();
        // MimeMessageHelper helper = new MimeMessageHelper(message, true);
        // helper.setTo(to);
        // helper.setSubject(subject);
        // helper.setText(htmlContent, true);
        // javaMailSender.send(message);
    }
}
