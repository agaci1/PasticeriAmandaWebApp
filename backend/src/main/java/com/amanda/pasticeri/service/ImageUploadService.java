package com.amanda.pasticeri.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageUploadService {

    private final String uploadDir = "uploads/";

    public String saveImage(MultipartFile file) {
        try {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filepath = Paths.get(uploadDir + filename);

            Files.createDirectories(filepath.getParent());
            file.transferTo(filepath.toFile());

            // In production, return a full URL
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }
}
