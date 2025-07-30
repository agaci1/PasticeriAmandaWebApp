package com.amanda.pasticeri.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageUploadService {

    private final String uploadDir = System.getenv("RAILWAY_VOLUME_MOUNT_PATH") != null ? 
        System.getenv("RAILWAY_VOLUME_MOUNT_PATH") + "/uploads/" : "uploads/";

    public String saveImage(MultipartFile file) {
        try {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            
            // Use the configured upload directory
            String uploadPathStr = uploadDir;
            
            Path uploadPath = Paths.get(uploadPathStr);
            Path filepath = uploadPath.resolve(filename);
            
            System.out.println("📁 Upload directory: " + uploadPathStr);
            System.out.println("📁 Upload path: " + uploadPath);
            System.out.println("📁 Full file path: " + filepath);
            System.out.println("📁 File size: " + file.getSize() + " bytes");
            
            // Create directories if they don't exist
            Files.createDirectories(uploadPath);
            
            // Save the file
            file.transferTo(filepath.toFile());
            
            System.out.println("✅ Image saved successfully: " + filepath);
            
            // Return the URL path
            return "/uploads/" + filename;
        } catch (IOException e) {
            System.err.println("❌ Failed to upload image: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to upload image", e);
        }
    }
}
