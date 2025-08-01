package com.amanda.pasticeri.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageUploadService {
    
    private static final Logger logger = LoggerFactory.getLogger(ImageUploadService.class);

    private final String uploadDir;

    public ImageUploadService() {
        // Check for Railway volume mount path first, then fallback to local uploads
        String railwayPath = System.getenv("RAILWAY_VOLUME_MOUNT_PATH");
        if (railwayPath != null && !railwayPath.trim().isEmpty()) {
            this.uploadDir = railwayPath + "/uploads/";
        } else {
            this.uploadDir = "uploads/";
        }
        logger.info("ImageUploadService initialized with upload directory: {}", uploadDir);
    }

    public String saveImage(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File is null or empty");
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.trim().isEmpty()) {
                throw new IllegalArgumentException("Original filename is null or empty");
            }

            // Sanitize filename
            String sanitizedFilename = originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
            String filename = System.currentTimeMillis() + "_" + sanitizedFilename;
            
            Path uploadPath = Paths.get(uploadDir);
            Path filepath = uploadPath.resolve(filename);
            
            logger.info("Saving image to: {}", filepath.toAbsolutePath());
            
            // Create directories if they don't exist
            Files.createDirectories(uploadPath);
            
            // Save the file
            file.transferTo(filepath.toFile());
            
            // Verify file was saved
            if (!Files.exists(filepath)) {
                throw new RuntimeException("File was not saved successfully");
            }
            
            logger.info("Image saved successfully: {}", filename);
            
            // Return the URL path (relative to the server root)
            return "/uploads/" + filename;
        } catch (IOException e) {
            logger.error("Failed to upload image: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error during image upload: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }
}
