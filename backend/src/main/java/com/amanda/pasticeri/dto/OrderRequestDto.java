package com.amanda.pasticeri.dto;

import org.springframework.web.multipart.MultipartFile;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDto {
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String productName;
    private Integer numberOfPersons;
    private String customNote;
    private String flavour; // ✅ New flavor field
    private String orderDate;
    private List<MultipartFile> uploadedImages; // Optional, multiple images
}
