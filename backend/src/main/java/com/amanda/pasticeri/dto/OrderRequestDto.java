package com.amanda.pasticeri.dto;

import org.springframework.web.multipart.MultipartFile;
import lombok.Data;

@Data
public class OrderRequestDto {
    private String customerName;
    private String customerEmail;
    private String customerPhoneCustom;
    private String productName;
    private Integer numberOfPersons;
    private String customNote;
    private String orderDate;
    private MultipartFile uploadedImage; // Optional
}
