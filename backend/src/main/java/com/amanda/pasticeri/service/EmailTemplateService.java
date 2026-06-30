package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Order;
import org.springframework.stereotype.Service;

@Service
public class EmailTemplateService {

    public String getOrderConfirmationTemplate(Order order) {
        String intro = isCustomOrder(order)
            ? "We received your custom request and our team will review every detail before confirming the final price."
            : "Your order has been received and reserved for the selected time.";

        return layout(
            "Order received",
            "Thank you, " + esc(order.getCustomerName()),
            intro,
            orderDetails(order, true)
                + imageSection(order)
                + note("Next step", isCustomOrder(order)
                    ? "We will contact you shortly with the final price confirmation."
                    : "If pickup or delivery details need attention, we will contact you directly."),
            "With love, Pasticeri Amanda"
        );
    }

    public String getNewOrderNotificationTemplate(Order order) {
        return layout(
            "Admin notice",
            "New order received",
            "A customer order needs attention in the admin panel.",
            customerDetails(order)
                + orderDetails(order, true)
                + imageSection(order)
                + note(isCustomOrder(order) ? "Action needed" : "Menu order",
                    isCustomOrder(order)
                        ? "Review the design, flavour, date, and set the final price."
                        : "Prepare this order for the scheduled pickup or delivery time."),
            "Pasticeri Amanda Admin"
        );
    }

    public String getAdminPriceSetTemplate(Order order) {
        return layout(
            "Admin confirmation",
            "Price was set",
            "The customer has been sent the confirmed price for this order.",
            customerDetails(order)
                + orderDetails(order, true)
                + pricePanel(order)
                + imageSection(order)
                + note("Admin status", "The order is now marked pending and ready for production follow-up."),
            "Pasticeri Amanda Admin"
        );
    }

    public String getAdminOrderCancelledTemplate(Order order) {
        return layout(
            "Admin alert",
            "Order cancelled",
            "This order has been cancelled and should no longer be prepared.",
            customerDetails(order)
                + orderDetails(order, true)
                + imageSection(order)
                + statusPanel("Cancelled", "#7f1d1d", "No further production action is needed unless the customer contacts the shop."),
            "Pasticeri Amanda Admin"
        );
    }

    public String getAdminOrderCompletedTemplate(Order order) {
        return layout(
            "Admin confirmation",
            "Order completed",
            "The order has been marked complete and the customer has been notified.",
            customerDetails(order)
                + orderDetails(order, true)
                + pricePanel(order)
                + statusPanel("Completed", "#1f5135", "This order can be archived with completed orders."),
            "Pasticeri Amanda Admin"
        );
    }

    public String getOrderCancelledTemplate(Order order) {
        return layout(
            "Order update",
            "Your order was cancelled",
            "This is a confirmation that the order below is no longer active.",
            orderDetails(order, false)
                + note("Cancelled", "If this was a mistake, please contact us and we will help you place a new order."),
            "Pasticeri Amanda"
        );
    }

    public String getPriceSetTemplate(Order order) {
        return layout(
            "Price confirmation",
            "Your final price is ready",
            "We reviewed your custom request and prepared the confirmed price.",
            orderDetails(order, true)
                + pricePanel(order)
                + imageSection(order)
                + note("Confirmed", "Your order is now ready for production. We will contact you if any extra detail is needed."),
            "With love, Pasticeri Amanda"
        );
    }

    public String getOrderCompletedTemplate(Order order) {
        return layout(
            "Order complete",
            "Your order is ready",
            "Thank you for choosing Pasticeri Amanda. Your order has been completed.",
            orderDetails(order, true)
                + pricePanel(order)
                + note("Thank you", "We hope your celebration feels as beautiful as it tastes."),
            "With love, Pasticeri Amanda"
        );
    }

    public String getPasswordResetTemplate(String resetLink) {
        return layout(
            "Account security",
            "Reset your password",
            "We received a request to reset your Pasticeri Amanda account password.",
            """
                <div style="text-align:center; margin: 28px 0;">
                  <a href="%s" style="background:#b88a2c; color:#fffdf7; text-decoration:none; padding:14px 26px; border-radius:999px; font-weight:700; letter-spacing:.04em; display:inline-block;">Reset password</a>
                </div>
                """.formatted(esc(resetLink))
                + note("Security note", "This link is intended only for you. If you did not request it, you can ignore this email."),
            "Pasticeri Amanda"
        );
    }

    private String layout(String eyebrow, String title, String intro, String content, String signoff) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Pasticeri Amanda</title>
            </head>
            <body style="margin:0; padding:0; background:#f7f0e4; font-family: Georgia, 'Times New Roman', serif; color:#2d2419;">
              <div style="display:none; max-height:0; overflow:hidden;">%s - %s</div>
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#f7f0e4; padding:28px 12px;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:640px; background:#fffdf7; border:1px solid #e6d5b3; box-shadow:0 18px 48px rgba(79,53,22,.13);">
                      <tr>
                        <td style="padding:34px 28px 26px; text-align:center; background:#fffaf0; border-bottom:1px solid #ead9b7;">
                          <div style="font-size:26px; color:#b88a2c; line-height:1;">♛</div>
                          <div style="font-size:28px; letter-spacing:.14em; text-transform:uppercase; color:#2d2419; font-weight:700; margin-top:8px;">Pasticeri Amanda</div>
                          <div style="font-size:11px; letter-spacing:.38em; text-transform:uppercase; color:#9c7a38; margin-top:8px;">Est. 2019</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:34px 34px 18px;">
                          <div style="font-family:Arial, sans-serif; font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:#b88a2c; font-weight:700;">%s</div>
                          <h1 style="margin:12px 0 12px; font-size:31px; line-height:1.18; color:#2d2419; font-weight:700;">%s</h1>
                          <p style="margin:0; font-family:Arial, sans-serif; font-size:15px; line-height:1.7; color:#6b5a44;">%s</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 34px 34px;">
                          %s
                          <div style="margin-top:30px; padding-top:22px; border-top:1px solid #ead9b7; text-align:center; font-family:Arial, sans-serif; color:#7b6a53;">
                            <div style="font-family:Georgia, 'Times New Roman', serif; color:#2d2419; font-size:18px;">%s</div>
                            <div style="margin-top:12px; font-size:13px; line-height:1.7;">Rruga Lefter Talo<br>+355 69 352 0462<br>pasticeriamanda@gmail.com</div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(esc(eyebrow), esc(title), esc(eyebrow), esc(title), esc(intro), content, esc(signoff));
    }

    private String customerDetails(Order order) {
        return card("Customer", rows(
            row("Name", order.getCustomerName()),
            row("Email", order.getCustomerEmail()),
            row("Phone", order.getCustomerPhone())
        ));
    }

    private String orderDetails(Order order, boolean includePrice) {
        String price = includePrice ? row("Price", money(order)) : "";
        return card("Order details", rows(
            row("Order", order.getId() == null ? "" : "#" + order.getId()),
            row("Product", order.getProductName()),
            row("Quantity", String.valueOf(order.getNumberOfPersons())),
            row("Flavour", order.getFlavour()),
            row("Description", order.getCustomNote()),
            row("Order date", order.getOrderDate() == null ? "" : order.getOrderDate().toString()),
            deliveryRows(order),
            price
        ));
    }

    private String pricePanel(Order order) {
        if (order.getTotalPrice() == null) {
            return "";
        }

        return """
            <div style="margin:18px 0; padding:24px; background:#2d2419; color:#fffdf7; text-align:center; border:1px solid #b88a2c;">
              <div style="font-family:Arial, sans-serif; font-size:11px; letter-spacing:.24em; text-transform:uppercase; color:#e6c778;">Final price</div>
              <div style="font-size:32px; margin-top:8px; font-weight:700;">ALL %s</div>
            </div>
            """.formatted(esc(order.getTotalPrice().toString()));
    }

    private String statusPanel(String title, String backgroundColor, String body) {
        return """
            <div style="margin:18px 0; padding:24px; background:%s; color:#fffdf7; text-align:center; border:1px solid #b88a2c;">
              <div style="font-family:Arial, sans-serif; font-size:11px; letter-spacing:.24em; text-transform:uppercase; color:#e6c778;">%s</div>
              <div style="font-family:Arial, sans-serif; font-size:14px; line-height:1.7; margin-top:10px;">%s</div>
            </div>
            """.formatted(backgroundColor, esc(title), esc(body));
    }

    private String imageSection(Order order) {
        if (order.getImageUrls() == null || order.getImageUrls().isBlank()) {
            return "";
        }

        StringBuilder images = new StringBuilder();
        String[] imageUrls = order.getImageUrls().split(",");
        int imageIndex = 1;
        for (String imageUrl : imageUrls) {
            if (imageUrl != null && imageUrl.trim().startsWith("/uploads/")) {
                images.append("""
                    <img src="cid:orderImage%d" alt="Order design" style="width:150px; max-width:100%%; height:auto; border:1px solid #d7bd7a; margin:6px; display:inline-block;">
                    """.formatted(imageIndex));
                imageIndex++;
            }
        }

        if (images.length() == 0) {
            return "";
        }

        return """
            <div style="margin:18px 0; padding:22px; background:#fffaf0; border:1px solid #ead9b7;">
              <div style="font-family:Arial, sans-serif; font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:#b88a2c; font-weight:700; margin-bottom:14px;">Design images</div>
              <div style="text-align:center;">%s</div>
              <p style="font-family:Arial, sans-serif; font-size:12px; color:#7b6a53; line-height:1.6; margin:14px 0 0;">If the preview is hidden by your email app, the uploaded design is included as an attachment.</p>
            </div>
            """.formatted(images.toString());
    }

    private String note(String title, String body) {
        return """
            <div style="margin:18px 0; padding:20px; background:#fbf6ec; border-left:4px solid #b88a2c; font-family:Arial, sans-serif;">
              <div style="font-size:13px; font-weight:700; color:#2d2419; margin-bottom:6px;">%s</div>
              <div style="font-size:14px; line-height:1.7; color:#6b5a44;">%s</div>
            </div>
            """.formatted(esc(title), esc(body));
    }

    private String card(String title, String rows) {
        if (rows == null || rows.isBlank()) {
            return "";
        }

        return """
            <div style="margin:18px 0; padding:22px; background:#fffaf0; border:1px solid #ead9b7;">
              <div style="font-family:Arial, sans-serif; font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:#b88a2c; font-weight:700; margin-bottom:12px;">%s</div>
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="font-family:Arial, sans-serif;">%s</table>
            </div>
            """.formatted(esc(title), rows);
    }

    private String rows(String... rows) {
        StringBuilder builder = new StringBuilder();
        for (String row : rows) {
            if (row != null && !row.isBlank()) {
                builder.append(row);
            }
        }
        return builder.toString();
    }

    private String row(String label, String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        return """
            <tr>
              <td style="padding:8px 0; color:#8a765b; font-size:13px; width:34%%; vertical-align:top;">%s</td>
              <td style="padding:8px 0; color:#2d2419; font-size:14px; line-height:1.55; font-weight:600;">%s</td>
            </tr>
            """.formatted(esc(label), esc(value));
    }

    private String deliveryRows(Order order) {
        if (order.getDeliveryDateTime() == null) {
            return "";
        }

        return row("Delivery date", order.getDeliveryDateTime().toLocalDate().toString())
            + row("Delivery time", order.getDeliveryDateTime().toLocalTime().toString().substring(0, 5));
    }

    private String money(Order order) {
        return order.getTotalPrice() == null ? "To be confirmed" : "ALL " + order.getTotalPrice();
    }

    private boolean isCustomOrder(Order order) {
        return (order.getCustomNote() != null && !order.getCustomNote().isBlank())
            || (order.getFlavour() != null && !order.getFlavour().isBlank())
            || (order.getImageUrls() != null && !order.getImageUrls().isBlank())
            || "pending-quote".equals(order.getStatus())
            || "custom".equals(order.getOrderType());
    }

    private String esc(String value) {
        if (value == null) {
            return "";
        }

        return value
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#39;");
    }
}
