package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Order;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailTemplateService emailTemplateService;

    @Override
    public void sendOrderConfirmation(String to, Order order) {
        String subject = "🍰 Your Pastiçeri Amanda Order Confirmation";
        String body = emailTemplateService.getOrderConfirmationTemplate(order);
        sendHtmlEmailWithLogo(to, subject, body, order);
    }

    @Override
    public void sendOrderConfirmation(String to, String htmlContent) {
        sendHtmlEmailWithLogo(to, "Pastiçeri Amanda - Order Confirmation", htmlContent);
    }

    @Override
    public void sendAdminNotification(String to, Order order) {
        String subject = "🛎️ New Order Alert - Pastiçeri Amanda";
        String body = emailTemplateService.getNewOrderNotificationTemplate(order);
        sendHtmlEmailWithLogo(to, subject, body, order);
    }

    @Override
    public void sendAdminNotification(String to, String htmlContent) {
        sendHtmlEmailWithLogo(to, "Pastiçeri Amanda - New Order", htmlContent);
    }

    @Override
    public void sendOrderCancelledEmail(String to, Order order) {
        String subject = "❌ Order Cancelled - Pastiçeri Amanda";
        String body = emailTemplateService.getOrderCancelledTemplate(order);
        sendHtmlEmailWithLogo(to, subject, body, order);
    }

    @Override
    public void sendPriceSetEmail(String to, Order order) {
        String subject = "💰 Price Set - Pastiçeri Amanda";
        String body = emailTemplateService.getPriceSetTemplate(order);
        sendHtmlEmailWithLogo(to, subject, body, order);
    }

    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        String subject = "🔐 Reset Your Password - Pastiçeri Amanda";
        String body = emailTemplateService.getPasswordResetTemplate(resetLink);
        sendHtmlEmailWithLogo(to, subject, body);
    }

    // Test method for debugging email issues
    public void sendTestEmail(String to) {
        System.out.println("🧪 Sending test email to: " + to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("🧪 Test Email - Pastiçeri Amanda");
            helper.setText("This is a test email to verify email functionality is working.", false);
            
            System.out.println("📧 Test email created, attempting to send...");
            mailSender.send(message);
            System.out.println("✅ Test email sent successfully!");
        } catch (Exception e) {
            System.err.println("❌ Test email failed: " + e.getMessage());
            e.printStackTrace();
        }
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

    private void sendHtmlEmailWithLogo(String to, String subject, String htmlBody) {
        sendHtmlEmailWithLogo(to, subject, htmlBody, null);
    }

    private void sendHtmlEmailWithLogo(String to, String subject, String htmlBody, Order order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // HTML enabled

            // Add logo
            File logo = new File("src/main/resources/static/logoAmanda.jpg");
            if (logo.exists()) {
                helper.addInline("logoAmanda", logo);
                System.out.println("✅ Logo added to email: " + logo.getAbsolutePath());
            } else {
                System.out.println("⚠️ Logo file not found: " + logo.getAbsolutePath());
            }

            // Add order images if available
            if (order != null && order.getImageUrls() != null && !order.getImageUrls().trim().isEmpty()) {
                System.out.println("📸 Processing order images: " + order.getImageUrls());
                String[] imageUrls = order.getImageUrls().split(",");
                int imageIndex = 1;
                for (String imageUrl : imageUrls) {
                    if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                        String trimmed = imageUrl.trim();
                        System.out.println("📸 Processing image URL: " + trimmed);
                        
                        if (trimmed.startsWith("/uploads/")) {
                            // Try multiple possible paths
                            String currentDir = System.getProperty("user.dir");
                            String[] possiblePaths = {
                                currentDir + trimmed,
                                currentDir + "/backend" + trimmed,
                                currentDir + "/uploads" + trimmed.substring(8), // Remove /uploads/ prefix
                                "uploads" + trimmed.substring(8), // Relative path
                                currentDir + "/backend/uploads" + trimmed.substring(8), // Backend uploads
                                currentDir + "/uploads" + trimmed.substring(8) // Direct uploads
                            };
                            
                            File imageFile = null;
                            for (String path : possiblePaths) {
                                File testFile = new File(path);
                                System.out.println("🔍 Testing path: " + testFile.getAbsolutePath());
                                if (testFile.exists() && testFile.isFile()) {
                                    imageFile = testFile;
                                    System.out.println("✅ Found image at: " + testFile.getAbsolutePath());
                                    break;
                                }
                            }
                            
                            if (imageFile != null && imageFile.exists()) {
                                try {
                                    helper.addInline("orderImage" + imageIndex, imageFile);
                                    System.out.println("✅ Order image " + imageIndex + " added to email: " + imageFile.getAbsolutePath());
                                    imageIndex++;
                                } catch (Exception e) {
                                    System.err.println("❌ Failed to add image " + imageIndex + " to email: " + e.getMessage());
                                    e.printStackTrace();
                                }
                            } else {
                                System.err.println("❌ Order image file not found for URL: " + trimmed);
                                System.err.println("❌ Tried paths: " + String.join(", ", possiblePaths));
                                // Try to list files in uploads directory for debugging
                                try {
                                    File uploadsDir = new File(currentDir + "/uploads");
                                    if (uploadsDir.exists() && uploadsDir.isDirectory()) {
                                        System.out.println("📁 Files in uploads directory:");
                                        File[] files = uploadsDir.listFiles();
                                        if (files != null) {
                                            for (File file : files) {
                                                System.out.println("  - " + file.getName() + " (" + file.length() + " bytes)");
                                            }
                                        }
                                    }
                                } catch (Exception e) {
                                    System.err.println("❌ Error listing uploads directory: " + e.getMessage());
                                }
                            }
                        } else {
                            System.out.println("⚠️ Skipping non-upload image: " + trimmed);
                        }
                    }
                }
                System.out.println("📸 Total images processed for email: " + (imageIndex - 1));
            } else {
                System.out.println("📸 No images to process for email");
            }

            mailSender.send(message);
            System.out.println("✅ Email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.err.println("❌ Email sending failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
