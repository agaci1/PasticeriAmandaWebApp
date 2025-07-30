package com.amanda.pasticeri.dto;
import lombok.Data;

@Data
public class MenuOrderDto {
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long productId;
    private Integer quantity;
    private String deliveryDateTime; // Added missing field
    private Double totalPrice; // Added missing field
    
    // Helper methods to maintain compatibility
    public String getProductName() {
        // This will be set by the service layer based on productId
        return null; // Will be populated by service
    }
    
    public Integer getNumberOfPersons() {
        return quantity; // Map quantity to numberOfPersons
    }
}

