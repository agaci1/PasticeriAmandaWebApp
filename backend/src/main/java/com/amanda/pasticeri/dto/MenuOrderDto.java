package com.amanda.pasticeri.dto;
import lombok.Data;

@Data
public class MenuOrderDto {
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long productId;
    private Integer quantity;
}

