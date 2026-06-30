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
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailTemplateService emailTemplateService;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.port:465}")
    private int mailPort;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${app.mail.resend-api-key:}")
    private String resendApiKey;

    @Value("${app.mail.resend-from:Pasticeri Amanda <onboarding@resend.dev>}")
    private String resendFrom;

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
    public void sendAdminPriceSetNotification(String to, Order order) {
        String subject = "💰 Price Set - Order #" + order.getId();
        String body = emailTemplateService.getAdminPriceSetTemplate(order);
        sendHtmlEmailWithLogo(to, subject, body, order);
    }

    @Override
    public void sendAdminCancellationNotification(String to, Order order) {
        String subject = "❌ Order Cancelled - Order #" + order.getId();
        String body = emailTemplateService.getAdminOrderCancelledTemplate(order);
        sendHtmlEmailWithLogo(to, subject, body, order);
    }

    @Override
    public void sendAdminCompletionNotification(String to, Order order) {
        String subject = "✅ Order Completed - Order #" + order.getId();
        String body = emailTemplateService.getAdminOrderCompletedTemplate(order);
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

    public void sendTestEmail(String to) {
        String subject = "🧪 Test Email - Pastiçeri Amanda";
        String body = """
            <html>
              <body>
                <h2>Pastiçeri Amanda email test</h2>
                <p>If you received this email, SMTP is configured correctly.</p>
              </body>
            </html>
            """;
        sendHtmlEmailWithLogo(to, subject, body);
    }

    private void sendHtmlEmailWithLogo(String to, String subject, String htmlBody) {
        sendHtmlEmailWithLogo(to, subject, htmlBody, null);
    }

    private void sendHtmlEmailWithLogo(String to, String subject, String htmlBody, Order order) {
        logger.info("═══════════════════════════════════════════════════════════");
        logger.info("🚀 STARTING EMAIL SEND PROCESS");
        logger.info("   To: {}", to);
        logger.info("   Subject: {}", subject);
        logger.info("═══════════════════════════════════════════════════════════");

        // First check if mail is enabled globally
        if (!mailEnabled) {
            logger.warn("⚠️ EMAIL SERVICE DISABLED - Set app.mail.enabled=true to enable emails");
            logger.info("═══════════════════════════════════════════════════════════");
            throw new IllegalStateException("Email service is disabled. Set MAIL_ENABLED=true.");
        }

        if (isResendConfigured()) {
            sendWithResend(to, subject, htmlBody, order);
            return;
        }

        // Then check if SMTP is configured
        if (!isMailConfigured()) {
            logger.error("═══════════════════════════════════════════════════════════");
            logger.error("❌ CRITICAL: SMTP NOT CONFIGURED");
            logger.error("   Missing configuration for email to: {}", to);
            logger.error("   SMTP Host: {}", mailHost == null || mailHost.isBlank() ? "NOT SET" : "SET");
            logger.error("   SMTP Port: {}", mailPort);
            logger.error("   SMTP Username: {}", mailUsername == null || mailUsername.isBlank() ? "NOT SET" : "SET");
            logger.error("   SMTP Password: {}", mailPassword == null || mailPassword.isBlank() ? "NOT SET" : "SET");
            logger.error("   Required environment variables on Railway:");
            logger.error("     - SMTP_HOST=smtp.gmail.com");
            logger.error("     - SMTP_PORT=465");
            logger.error("     - SMTP_USERNAME=your-email@gmail.com");
            logger.error("     - SMTP_PASSWORD=your-app-password");
            logger.error("     - MAIL_ENABLED=true");
            logger.error("═══════════════════════════════════════════════════════════");
            throw new IllegalStateException("SMTP is not configured. Set SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD and MAIL_ENABLED=true.");
        }

        try {
            logger.info("📬 Creating MIME message...");
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            logger.info("📮 Setting email fields...");
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
                            String currentDir = System.getProperty("user.dir");
                            String[] possiblePaths = {
                                currentDir + trimmed,
                                currentDir + "/backend" + trimmed,
                                currentDir + "/uploads" + trimmed.substring(8),
                                "uploads" + trimmed.substring(8),
                                currentDir + "/backend/uploads" + trimmed.substring(8),
                                currentDir + "/uploads" + trimmed.substring(8)
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

            logger.info("🔄 Attempting to send email via JavaMailSender...");
            logger.info("   Host: {}:{}", mailHost, mailPort);
            logger.info("   From: {}", mailUsername);
            logger.info("   To: {}", to);
            
            mailSender.send(message);
            
            logger.info("═══════════════════════════════════════════════════════════");
            logger.info("✅✅✅ EMAIL SENT SUCCESSFULLY! ✅✅✅");
            logger.info("   Recipient: {}", to);
            logger.info("   Subject: {}", subject);
            logger.info("═══════════════════════════════════════════════════════════");
            
        } catch (MailException e) {
            logger.error("═══════════════════════════════════════════════════════════");
            logger.error("❌ MAIL EXCEPTION - Email sending FAILED to {}", to);
            logger.error("   Error: {}", e.getMessage());
            logger.error("   This usually means SMTP credentials are invalid or server is unreachable");
            logger.error("   Stack trace:");
            logger.error("═══════════════════════════════════════════════════════════", e);
            throw new RuntimeException("Failed to send email to " + to, e);
        } catch (MessagingException e) {
            logger.error("═══════════════════════════════════════════════════════════");
            logger.error("❌ MESSAGING EXCEPTION - Email sending FAILED to {}", to);
            logger.error("   Error: {}", e.getMessage());
            logger.error("   Stack trace:");
            logger.error("═══════════════════════════════════════════════════════════", e);
            throw new RuntimeException("Failed to prepare email to " + to, e);
        } catch (Exception e) {
            logger.error("═══════════════════════════════════════════════════════════");
            logger.error("❌ UNEXPECTED ERROR - Email sending FAILED to {}", to);
            logger.error("   Error: {}", e.getMessage());
            logger.error("   Stack trace:");
            logger.error("═══════════════════════════════════════════════════════════", e);
            throw new RuntimeException("Failed to send email to " + to, e);
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

    private boolean isResendConfigured() {
        return resendApiKey != null && !resendApiKey.isBlank() && !resendApiKey.contains("${");
    }

    private void sendWithResend(String to, String subject, String htmlBody, Order order) {
        logger.info("📨 Sending email via Resend HTTPS API");
        logger.info("   From: {}", resendFrom);
        logger.info("   To: {}", to);

        String attachmentsJson = buildResendAttachmentsJson(order);
        String payload = """
            {
              "from": "%s",
              "to": ["%s"],
              "subject": "%s",
              "html": "%s"%s
            }
            """.formatted(
                escapeJson(resendFrom),
                escapeJson(to),
                escapeJson(subject),
                escapeJson(htmlBody),
                attachmentsJson
            );

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.resend.com/emails"))
            .timeout(Duration.ofSeconds(20))
            .header("Authorization", "Bearer " + resendApiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build();

        try {
            HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                logger.error("❌ Resend email failed with status {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("Resend email failed with status " + response.statusCode());
            }

            logger.info("✅✅✅ EMAIL SENT SUCCESSFULLY VIA RESEND! ✅✅✅");
        } catch (IOException e) {
            throw new RuntimeException("Failed to send email through Resend", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Email sending through Resend was interrupted", e);
        }
    }

    private String prepareHtmlForResend(String htmlBody) {
        return htmlBody.replaceAll("<img[^>]+src=\\\"cid:[^\\\"]+\\\"[^>]*>", "");
    }

    private String buildResendAttachmentsJson(Order order) {
        if (order == null || order.getImageUrls() == null || order.getImageUrls().isBlank()) {
            return "";
        }

        List<String> attachments = new ArrayList<>();
        String[] imageUrls = order.getImageUrls().split(",");
        int imageIndex = 1;
        for (String imageUrl : imageUrls) {
            if (imageUrl == null || imageUrl.isBlank()) {
                continue;
            }

            File imageFile = findUploadFile(imageUrl.trim());
            if (imageFile == null) {
                logger.warn("⚠️ Resend attachment skipped; file not found for {}", imageUrl.trim());
                continue;
            }

            try {
                String base64Content = Base64.getEncoder().encodeToString(Files.readAllBytes(imageFile.toPath()));
                String contentType = Files.probeContentType(imageFile.toPath());
                if (contentType == null || contentType.isBlank()) {
                    contentType = "application/octet-stream";
                }

                attachments.add("""
                    {
                      "filename": "%s",
                      "content": "%s",
                      "content_type": "%s",
                      "content_id": "orderImage%d"
                    }
                    """.formatted(
                        escapeJson(imageFile.getName()),
                        base64Content,
                        escapeJson(contentType),
                        imageIndex
                    ));
                imageIndex++;
            } catch (IOException e) {
                logger.warn("⚠️ Failed to read image attachment {}: {}", imageFile.getAbsolutePath(), e.getMessage());
            }
        }

        if (attachments.isEmpty()) {
            return "";
        }

        logger.info("📎 Adding {} order image attachment(s) to Resend email", attachments.size());
        return ",\n  \"attachments\": [" + String.join(",", attachments) + "\n  ]";
    }

    private File findUploadFile(String imageUrl) {
        if (!imageUrl.startsWith("/uploads/")) {
            return null;
        }

        String currentDir = System.getProperty("user.dir");
        String fileName = imageUrl.substring(9);
        String[] possiblePaths = {
            currentDir + imageUrl,
            currentDir + "/backend" + imageUrl,
            currentDir + "/uploads/" + fileName,
            "uploads/" + fileName,
            currentDir + "/backend/uploads/" + fileName
        };

        for (String path : possiblePaths) {
            File testFile = new File(path);
            if (testFile.exists() && testFile.isFile()) {
                return testFile;
            }
        }

        return null;
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }

        StringBuilder escaped = new StringBuilder();
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            switch (c) {
                case '\\' -> escaped.append("\\\\");
                case '"' -> escaped.append("\\\"");
                case '\n' -> escaped.append("\\n");
                case '\r' -> escaped.append("\\r");
                case '\t' -> escaped.append("\\t");
                default -> escaped.append(c);
            }
        }
        return escaped.toString();
    }
}
