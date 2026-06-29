package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Order;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailTemplateService emailTemplateService;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

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
    public void sendOrderCompletedEmail(String to, Order order) {
        String subject = "✅ Order Complete - Pastiçeri Amanda";
        String body = emailTemplateService.getOrderCompletedTemplate(order);
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
        if (!isMailConfigured()) {
            throw new IllegalStateException("SMTP is not configured. Set SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD and MAIL_ENABLED=true on Railway.");
        }

        logger.info("🧪 Sending test email to: {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(mailUsername);
            helper.setTo(to);
            helper.setSubject("🧪 Test Email - Pastiçeri Amanda");
            helper.setText("This is a test email to verify email functionality is working.", false);

            mailSender.send(message);
            logger.info("✅ Test email sent successfully!");
        } catch (Exception e) {
            logger.error("❌ Test email failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send test email: " + e.getMessage(), e);
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
            logger.error("❌ Email sending failed to {}: {}", to, e.getMessage(), e);
        }
    }

    private void sendHtmlEmailWithLogo(String to, String subject, String htmlBody) {
        sendHtmlEmailWithLogo(to, subject, htmlBody, null);
    }

    private void sendHtmlEmailWithLogo(String to, String subject, String htmlBody, Order order) {
        // First check if mail is enabled globally
        if (!mailEnabled) {
            logger.warn("⚠️ EMAIL SERVICE DISABLED - Set app.mail.enabled=true to enable emails");
            return;
        }

        // Then check if SMTP is configured
        if (!isMailConfigured()) {
            logger.error("❌ CRITICAL: SMTP NOT CONFIGURED");
            logger.error("   Missing configuration for email to: {}", to);
            logger.error("   SMTP Host: {}", mailHost == null || mailHost.isBlank() ? "NOT SET" : "SET");
            logger.error("   SMTP Username: {}", mailUsername == null || mailUsername.isBlank() ? "NOT SET" : "SET");
            logger.error("   SMTP Password: {}", mailPassword == null || mailPassword.isBlank() ? "NOT SET" : "SET");
            logger.error("   Required environment variables on Railway:");
            logger.error("     - SMTP_HOST=smtp.gmail.com");
            logger.error("     - SMTP_USERNAME=your-email@gmail.com");
            logger.error("     - SMTP_PASSWORD=your-app-password");
            logger.error("     - MAIL_ENABLED=true");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(mailUsername);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            // Add logo
            File logo = new File("src/main/resources/static/logoAmanda.jpg");
            if (logo.exists()) {
                helper.addInline("logoAmanda", logo);
                logger.debug("✅ Logo added to email: {}", logo.getAbsolutePath());
            } else {
                logger.warn("⚠️ Logo file not found: {}", logo.getAbsolutePath());
            }

            // Add order images if available
            if (order != null && order.getImageUrls() != null && !order.getImageUrls().trim().isEmpty()) {
                logger.debug("📸 Processing order images: {}", order.getImageUrls());
                String[] imageUrls = order.getImageUrls().split(",");
                int imageIndex = 1;
                for (String imageUrl : imageUrls) {
                    if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                        String trimmed = imageUrl.trim();
                        logger.debug("📸 Processing image URL: {}", trimmed);
                        
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
                                logger.debug("🔍 Testing path: {}", testFile.getAbsolutePath());
                                if (testFile.exists() && testFile.isFile()) {
                                    imageFile = testFile;
                                    logger.debug("✅ Found image at: {}", testFile.getAbsolutePath());
                                    break;
                                }
                            }
                            
                            if (imageFile != null && imageFile.exists()) {
                                try {
                                    helper.addInline("orderImage" + imageIndex, imageFile);
                                    logger.debug("✅ Order image {} added to email: {}", imageIndex, imageFile.getAbsolutePath());
                                    imageIndex++;
                                } catch (Exception e) {
                                    logger.error("❌ Failed to add image {} to email: {}", imageIndex, e.getMessage(), e);
                                }
                            } else {
                                logger.error("❌ Order image file not found for URL: {}", trimmed);
                                logger.error("❌ Tried paths: {}", String.join(", ", possiblePaths));
                                // Try to list files in uploads directory for debugging
                                try {
                                    File uploadsDir = new File(currentDir + "/uploads");
                                    if (uploadsDir.exists() && uploadsDir.isDirectory()) {
                                        logger.info("📁 Files in uploads directory:");
                                        File[] files = uploadsDir.listFiles();
                                        if (files != null) {
                                            for (File file : files) {
                                                logger.info("  - {} ({} bytes)", file.getName(), file.length());
                                            }
                                        }
                                    }
                                } catch (Exception e) {
                                    logger.error("❌ Error listing uploads directory: {}", e.getMessage(), e);
                                }
                            }
                        } else {
                            logger.warn("⚠️ Skipping non-upload image: {}", trimmed);
                        }
                    }
                }
                logger.debug("📸 Total images processed for email: {}", (imageIndex - 1));
            } else {
                logger.debug("📸 No images to process for email");
            }

            mailSender.send(message);
            logger.info("✅ Email sent successfully to: {}", to);
        } catch (MailException e) {
            logger.error("❌ MAIL EXCEPTION - Email sending failed to {}: {}", to, e.getMessage(), e);
            logger.error("   This usually means SMTP credentials are invalid or server is unreachable");
        } catch (MessagingException e) {
            logger.error("❌ MESSAGING EXCEPTION - Email sending failed to {}: {}", to, e.getMessage(), e);
        } catch (Exception e) {
            logger.error("❌ UNEXPECTED ERROR - Email sending failed to {}: {}", to, e.getMessage(), e);
        }
    }

    private boolean isMailConfigured() {
        boolean isConfigured = mailHost != null && !mailHost.isBlank()
            && mailUsername != null && !mailUsername.isBlank()
            && mailPassword != null && !mailPassword.isBlank()
            && !mailHost.contains("${");
        
        logger.debug("Mail configuration check: {}", isConfigured ? "✅ CONFIGURED" : "❌ NOT CONFIGURED");
        return isConfigured;
    }
}
