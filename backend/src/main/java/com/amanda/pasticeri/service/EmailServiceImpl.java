package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Order;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendOrderConfirmation(String to, Order order) {
        String subject = "Your Cake Order Confirmation 🍰";
        String body = "Dear " + order.getCustomerName() + ",\n\n"
                + "Thank you for your order!\n\n"
                + "Details:\n"
                + "Product: " + order.getProductName() + "\n"
                + "People: " + order.getNumberOfPersons() + "\n"
                + "Note: " + order.getCustomNote() + "\n"
                + "Total: €" + order.getTotalPrice() + "\n\n"
                + "We will contact you shortly for further steps.\n\n"
                + "With love,\nPasticeri Amanda ❤️";

        sendEmail(to, subject, body);
    }

    @Override
    public void sendAdminNotification(String to, Order order) {
        String subject = "🛎️ New Order Received";
        String body = "New order received:\n\n"
                + "Customer: " + order.getCustomerName() + " (" + order.getCustomerEmail() + ")\n"
                + "Phone: " + order.getCustomerPhone() + "\n"
                + "Product: " + order.getProductName() + "\n"
                + "People: " + order.getNumberOfPersons() + "\n"
                + "Note: " + order.getCustomNote() + "\n"
                + "Total: €" + order.getTotalPrice();

        sendEmail(to, subject, body);
    }

    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        String subject = "Reset Your Password 🔐";
        String body = "Hi,\n\nWe received a request to reset your password.\n\n"
                + "Click the link below to reset it:\n" + resetLink
                + "\n\nIf you didn’t request this, please ignore this email.\n\n— Pasticeri Amanda";

        sendEmail(to, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace(); // In production, use a logger
        }
    }
}
