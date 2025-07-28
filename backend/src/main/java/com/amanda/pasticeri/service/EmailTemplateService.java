package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Order;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailTemplateService {

    private static final String LOGO_URL = "https://pasticeriamanda.com/logo.png"; // Replace with actual logo URL
    // For local testing, use http://192.168.0.195:8080 as the base URL for images
    private static final String BASE_IMAGE_URL = "http://192.168.0.195:8080";
    
    private static String escapePercent(String input) {
        return input == null ? "" : input.replace("%", "%%");
    }

    // Helper for client email header
    private String getClientHeader() {
        return """
            <div style=\"background: transparent; padding: 0; text-align: center;\">
                <img src=\"cid:logoAmanda\" alt=\"Pasticeri Amanda\" style=\"width: 100%%; height: auto; display: block; margin: 0 auto;\">
            </div>
        """;
    }
    // Helper for client email footer
    private String getClientFooter() {
        return """
            <div style=\"background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 25px; border-radius: 15px; text-align: center;\">
                <h3 style=\"margin: 0 0 15px 0; font-size: 18px;\">📍 Visit Us</h3>
                <p style=\"margin: 5px 0; font-size: 16px;\"><strong>Rruga Lefter Talo</strong></p>
                <p style=\"margin: 5px 0; font-size: 16px;\">📞 <strong>+355 69 352 0462</strong></p>
                <p style=\"margin: 5px 0; font-size: 16px;\">📧 <strong>pasticeriamanda@gmail.com</strong></p>
                <p style=\"margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;\">Open every day: 8:00 AM - 11:00 PM</p>
            </div>
            <div style=\"text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f3f4f6;\">
                <p style=\"color: #6b7280; font-size: 14px; margin: 0;\">With love,<br><strong style=\"color: #ec4899; font-size: 16px;\">Pasticeri Amanda ❤️</strong></p>
            </div>
        """;
    }
    // Helper for admin email header
    private String getAdminHeader() {
        return """
            <div style=\"background: transparent; padding: 0; text-align: center;\">
                <img src=\"cid:logoAmanda\" alt=\"Pasticeri Amanda\" style=\"width: 100%%; height: auto; display: block; margin: 0 auto;\">
            </div>
        """;
    }
    // Helper for admin email footer
    private String getAdminFooter() {
        return """
            <div style=\"text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f3f4f6;\">
                <p style=\"color: #6b7280; font-size: 14px; margin: 0;\"><strong style=\"color: #dc2626; font-size: 16px;\">Pasticeri Amanda Admin Panel</strong></p>
            </div>
        """;
    }

    public String getOrderConfirmationTemplate(Order order) {
        String customerName = escapePercent(order.getCustomerName());
        String productName = escapePercent(order.getProductName());
        String numberOfPersons = String.valueOf(order.getNumberOfPersons());
        String customNote = escapePercent(order.getCustomNote());
        String flavour = escapePercent(order.getFlavour());
        String orderDate = order.getOrderDate() != null ? order.getOrderDate().toString() : "Unknown";
        String totalPrice = order.getTotalPrice() != null ? order.getTotalPrice().toString() : "To be confirmed";
        String imageSection = getImageSection(order);
        
        // Check if this is a custom order (has custom note, flavour, or images)
        boolean isCustomOrder = (order.getCustomNote() != null && !order.getCustomNote().trim().isEmpty()) || 
                               (order.getFlavour() != null && !order.getFlavour().trim().isEmpty()) ||
                               (order.getImageUrls() != null && !order.getImageUrls().trim().isEmpty()) ||
                               "pending-quote".equals(order.getStatus());
        
        String flavourSection = isCustomOrder && flavour != null && !flavour.trim().isEmpty() 
            ? String.format("<p><strong style=\"color: #1e40af;\">Flavour:</strong> %s</p>", flavour)
            : "";
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset=\"UTF-8\">
                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                <title>Order Confirmation - Pasticeri Amanda</title>
            </head>
            <body style=\"margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #fdf2f8 0%%, #fef3c7 50%%, #f3e8ff 100%%);\">
                <div style=\"max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);\">
                    %s
                    <div style=\"padding: 40px 30px;\">
                        <h1 style=\"color: #1e293b; margin: 0 0 20px 0; font-size: 28px; text-align: center;\">🎉 Thank you, %s! 🎉</h1>
                        <div style=\"background: linear-gradient(135deg, #fdf2f8 0%%, #fef3c7 50%%, #f3e8ff 100%%); background-color: #fff; padding: 25px; border-radius: 15px; margin: 20px 0;\">
                            <h3 style=\"color: #000; margin: 0 0 15px 0; font-size: 20px; font-weight: 700; text-shadow: 0 1px 0 #fff;\">📋 Order Details</h3>
                            <div style=\"color: #374151; line-height: 1.6;\">
                                <p><strong style=\"color: #1e40af;\">Product:</strong> %s</p>
                                <p><strong style=\"color: #1e40af;\">Quantity:</strong> %s</p>
                                <p><strong style=\"color: #1e40af;\">Description:</strong> %s</p>
                                %s
                                <p><strong style=\"color: #1e40af;\">Date:</strong> %s</p>
                                <p><strong style=\"color: #dc2626;\">Total Price:</strong> ALL%s</p>
                            </div>
                        </div>
                        %s
                        <div style=\"background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #f59e0b;\">
                            <p style=\"margin: 0; color: #374151; font-size: 14px;\"><strong>ℹ️ Note:</strong> We'll review your order and send you the final price confirmation shortly. For any questions, feel free to contact us!</p>
                        </div>
                        %s
                    </div>
                </div>
            </body>
            </html>
        """, getClientHeader(), customerName, productName, numberOfPersons, customNote, flavourSection, orderDate, totalPrice, imageSection, getClientFooter());
    }
    
    public String getNewOrderNotificationTemplate(Order order) {
        // Check if this is a custom order (has custom note, flavour, or images)
        boolean isCustomOrder = (order.getCustomNote() != null && !order.getCustomNote().trim().isEmpty()) || 
                               (order.getFlavour() != null && !order.getFlavour().trim().isEmpty()) ||
                               (order.getImageUrls() != null && !order.getImageUrls().trim().isEmpty()) ||
                               "pending-quote".equals(order.getStatus());
        
        String flavourSection = isCustomOrder && order.getFlavour() != null && !order.getFlavour().trim().isEmpty() 
            ? String.format("<p><strong style=\"color: #1e40af;\">Flavour:</strong> %s</p>", order.getFlavour())
            : "";
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset=\"UTF-8\">
                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                <title>New Order Received - Pasticeri Amanda</title>
            </head>
            <body style=\"margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #fdf2f8 0%%, #fef3c7 50%%, #f3e8ff 100%%);\">
                <div style=\"max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);\">
                    %s
                    <div style=\"padding: 40px 30px;\">
                        <h1 style=\"color: #1e293b; margin: 0 0 20px 0; font-size: 28px; text-align: center;\">🎉 New Order Received! 🎉</h1>
                        <div style=\"background: linear-gradient(135deg, #fef2f2 0%%, #fef3c7 50%%, #f3e8ff 100%%); background-color: #fff; padding: 25px; border-radius: 15px; margin: 20px 0;\">
                            <h3 style=\"color: #dc2626; margin: 0 0 15px 0; font-size: 20px; font-weight: 700; text-shadow: 0 1px 0 #fff;\">👤 Customer Information</h3>
                            <div style=\"color: #374151; line-height: 1.6;\">
                                <p><strong style=\"color: #1e40af;\">Name:</strong> %s</p>
                                <p><strong style=\"color: #1e40af;\">Email:</strong> %s</p>
                                <p><strong style=\"color: #1e40af;\">Phone:</strong> %s</p>
                            </div>
                        </div>
                        <div style=\"background: linear-gradient(135deg, #fdf2f8 0%%, #fef3c7 50%%, #f3e8ff 100%%); background-color: #fff; padding: 25px; border-radius: 15px; margin: 20px 0;\">
                            <h3 style=\"color: #7c3aed; margin: 0 0 15px 0; font-size: 20px; font-weight: 700; text-shadow: 0 1px 0 #fff;\">📋 Order Details</h3>
                            <div style=\"color: #374151; line-height: 1.6;\">
                                <p><strong style=\"color: #1e40af;\">Product:</strong> %s</p>
                                <p><strong style=\"color: #1e40af;\">Quantity:</strong> %s</p>
                                <p><strong style=\"color: #1e40af;\">Description:</strong> %s</p>
                                %s
                                <p><strong style=\"color: #1e40af;\">Date:</strong> %s</p>
                                <p><strong style=\"color: #dc2626;\">Total Price:</strong> ALL%s</p>
                            </div>
                        </div>
                        %s
                        <div style=\"background: #dc2626; color: white; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;\">
                            <p style=\"margin: 0; font-size: 16px; font-weight: 600;\">⚡ Please review this order and set the price as soon as possible!</p>
                        </div>
                        %s
                    </div>
                </div>
            </body>
            </html>
        """, getAdminHeader(), order.getCustomerName(), order.getCustomerEmail(), order.getCustomerPhone(), order.getProductName(), String.valueOf(order.getNumberOfPersons()), order.getCustomNote(), flavourSection, order.getOrderDate() != null ? order.getOrderDate().toString() : "Unknown", order.getTotalPrice() != null ? order.getTotalPrice().toString() : "To be confirmed", getImageSection(order), getAdminFooter());
    }
    
    public String getOrderCancelledTemplate(Order order) {
        // Check if this is a custom order (has custom note, flavour, or images)
        boolean isCustomOrder = (order.getCustomNote() != null && !order.getCustomNote().trim().isEmpty()) || 
                               (order.getFlavour() != null && !order.getFlavour().trim().isEmpty()) ||
                               (order.getImageUrls() != null && !order.getImageUrls().trim().isEmpty()) ||
                               "pending-quote".equals(order.getStatus());
        
        String flavourSection = isCustomOrder && order.getFlavour() != null && !order.getFlavour().trim().isEmpty() 
            ? String.format("<p><strong style=\"color: #1e40af;\">Flavour:</strong> %s</p>", order.getFlavour())
            : "";
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset=\"UTF-8\">
                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                <title>Order Cancelled - Pasticeri Amanda</title>
            </head>
            <body style=\"margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #fdf2f8 0%%, #fef3c7 50%%, #f3e8ff 100%%);\">
                <div style=\"max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);\">
                    %s
                    <div style=\"padding: 40px 30px;\">
                        <h1 style=\"color: #1e293b; margin: 0 0 20px 0; font-size: 28px; text-align: center;\">Order Cancellation Notice</h1>
                        <div style=\"background: linear-gradient(135deg, #f3f4f6 0%%, #e5e7eb 50%%, #d1d5db 100%%); background-color: #fff; padding: 25px; border-radius: 15px; margin: 20px 0;\">
                            <h3 style=\"color: #374151; margin: 0 0 15px 0; font-size: 20px; font-weight: 700; text-shadow: 0 1px 0 #fff;\">📋 Cancelled Order Details</h3>
                            <div style=\"color: #374151; line-height: 1.6;\">
                                <p><strong style=\"color: #1e40af;\">Order ID:</strong> #%s</p>
                                <p><strong style=\"color: #1e40af;\">Product:</strong> %s</p>
                                <p><strong style=\"color: #1e40af;\">Quantity:</strong> %s</p>
                                %s
                                <p><strong style=\"color: #1e40af;\">Date:</strong> %s</p>
                            </div>
                        </div>
                        <div style=\"background: #fef2f2; border: 2px solid #fecaca; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;\">
                            <p style=\"margin: 0; color: #dc2626; font-size: 16px; font-weight: 600;\">🚫 This order has been cancelled</p>
                        </div>
                        %s
                    </div>
                </div>
            </body>
            </html>
        """, getClientHeader(), order.getId() != null ? order.getId().toString() : "Unknown", order.getProductName(), String.valueOf(order.getNumberOfPersons()), flavourSection, order.getOrderDate() != null ? order.getOrderDate().toString() : "Unknown", getClientFooter());
    }
    
    public String getPriceSetTemplate(Order order) {
        // Check if this is a custom order (has custom note, flavour, or images)
        boolean isCustomOrder = (order.getCustomNote() != null && !order.getCustomNote().trim().isEmpty()) || 
                               (order.getFlavour() != null && !order.getFlavour().trim().isEmpty()) ||
                               (order.getImageUrls() != null && !order.getImageUrls().trim().isEmpty()) ||
                               "pending-quote".equals(order.getStatus());
        
        String flavourSection = isCustomOrder && order.getFlavour() != null && !order.getFlavour().trim().isEmpty() 
            ? String.format("<p><strong style=\"color: #1e40af;\">Flavour:</strong> %s</p>", order.getFlavour())
            : "";
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset=\"UTF-8\">
                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                <title>Price Set - Pasticeri Amanda</title>
            </head>
            <body style=\"margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #fdf2f8 0%%, #fef3c7 50%%, #f3e8ff 100%%);\">
                <div style=\"max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);\">
                    %s
                    <div style=\"padding: 40px 30px;\">
                        <h1 style=\"color: #1e293b; margin: 0 0 20px 0; font-size: 28px; text-align: center;\">🎉 Your Order Price is Ready! 🎉</h1>
                        <div style=\"background: linear-gradient(135deg, #ecfdf5 0%%, #fef3c7 50%%, #f3e8ff 100%%); background-color: #fff; padding: 25px; border-radius: 15px; margin: 20px 0;\">
                            <h3 style=\"color: #059669; margin: 0 0 15px 0; font-size: 20px; font-weight: 700; text-shadow: 0 1px 0 #fff;\">📋 Order Details</h3>
                            <div style=\"color: #374151; line-height: 1.6;\">
                                <p><strong style=\"color: #1e40af;\">Product:</strong> %s</p>
                                <p><strong style=\"color: #1e40af;\">Quantity:</strong> %s</p>
                                <p><strong style=\"color: #1e40af;\">Description:</strong> %s</p>
                                %s
                                <p><strong style=\"color: #1e40af;\">Date:</strong> %s</p>
                            </div>
                        </div>
                        <div style=\"background: #059669; color: white; padding: 25px; border-radius: 15px; margin: 25px 0; text-align: center;\">
                            <h3 style=\"margin: 0 0 10px 0; font-size: 22px; font-weight: 700; text-shadow: 0 1px 0 #fff;\">💰 Final Price</h3>
                            <p style=\"margin: 0; font-size: 32px; font-weight: 700;\">ALL%s</p>
                        </div>
                        %s
                        <div style=\"background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #059669;\">
                            <p style=\"margin: 0; color: #374151; font-size: 14px;\"><strong>✅ Your order is now ready for production!</strong><br>We'll contact you if we need any additional information.</p>
                        </div>
                        %s
                    </div>
                </div>
            </body>
            </html>
        """, getClientHeader(), order.getProductName(), String.valueOf(order.getNumberOfPersons()), order.getCustomNote(), flavourSection, order.getOrderDate() != null ? order.getOrderDate().toString() : "Unknown", order.getTotalPrice() != null ? order.getTotalPrice().toString() : "Unknown", getImageSection(order), getClientFooter());
    }
    
    public String getPasswordResetTemplate(String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset - Pasticeri Amanda</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fef3c7 50%, #f3e8ff 100%);">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <!-- Header with Logo -->
                    <div style="background: linear-gradient(135deg, #1e40af 0%, #f59e0b 50%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
                        <img src="cid:logoAmanda" alt="Pasticeri Amanda" style="width: 200px; height: auto; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                        <h1 style="color: white; margin: 20px 0 0 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                            🔐 Password Reset
                        </h1>
                    </div>
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <h2 style="color: #1e40af; margin: 0 0 20px 0; font-size: 24px; text-align: center;">
                            Reset Your Password
                        </h2>
                        <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fef3c7 50%, #f3e8ff 100%); background-color: #fff; padding: 25px; border-radius: 15px; margin: 20px 0;">
                            <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                                We received a request to reset your password for your Pasticeri Amanda account.
                            </p>
                            <div style="text-align: center; margin: 25px 0;">
                                <a href="%s" style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);">
                                    🔐 Reset Password
                                </a>
                            </div>
                            <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
                                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                            </p>
                        </div>
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                            <p style="margin: 0; color: #374151; font-size: 14px;">
                                <strong>🔒 Security Note:</strong> This link will expire in 24 hours for your security.
                            </p>
                        </div>
                        <!-- Contact Info -->
                        <div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 25px; border-radius: 15px; text-align: center;">
                            <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700; text-shadow: 0 1px 0 #fff;">📍 Visit Us</h3>
                            <p style="margin: 5px 0; font-size: 16px;"><strong>Rruga Lefter Talo</strong></p>
                            <p style="margin: 5px 0; font-size: 16px;">📞 <strong>+355 69 352 0462</strong></p>
                            <p style="margin: 5px 0; font-size: 16px;">📧 <strong>pasticeriamanda@gmail.com</strong></p>
                        </div>
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f3f4f6;">
                            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                                With love,<br>
                                <strong style="color: #ec4899; font-size: 16px;">Pasticeri Amanda ❤️</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        """.formatted(resetLink);
    }
    
    private String getImageSection(Order order) {
        if (order.getImageUrls() == null || order.getImageUrls().isEmpty()) {
            return "";
        }
        StringBuilder imageHtml = new StringBuilder();
        imageHtml.append("""
            <div style=\"background: linear-gradient(135deg, #fdf2f8 0%%, #fef3c7 50%%, #f3e8ff 100%%); background-color: #fff; padding: 25px; border-radius: 15px; margin: 20px 0; color: #000; font-weight: 700; text-shadow: 0 1px 0 #fff;\">
                <h3 style=\"color: #000; margin: 0 0 15px 0; font-size: 20px; font-weight: 700; text-shadow: 0 1px 0 #fff;\">📸 Your Design Images</h3>
                <div style=\"display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;\">
        """);
        String[] imageUrls = order.getImageUrls().split(",");
        int imageIndex = 1;
        for (String imageUrl : imageUrls) {
            if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                String trimmed = imageUrl.trim();
                if (trimmed.startsWith("/uploads/")) {
                    // Use inline image reference instead of URL
                    imageHtml.append(String.format("""
                        <img src=\"cid:orderImage%d\" alt=\"Order Design\" style=\"max-width: 150px; max-height: 150px; object-fit: cover; border-radius: 10px; border: 3px solid #f59e0b; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: #fff;\">
                    """, imageIndex));
                    imageIndex++;
                }
            }
        }
        imageHtml.append("""
                </div>
            </div>
        """);
        return imageHtml.toString();
    }
} 