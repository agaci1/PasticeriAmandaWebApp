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
        String currentDir = System.getProperty("user.dir");
        
        logger.info("Current directory: {}", currentDir);
        logger.info("RAILWAY_VOLUME_MOUNT_PATH: {}", railwayPath);
        
        if (railwayPath != null && !railwayPath.trim().isEmpty()) {
            this.uploadDir = railwayPath + "/uploads/";
        } else if (currentDir != null && currentDir.contains("/app")) {
            // We're in Railway production environment
            this.uploadDir = "/app/uploads/";
        } else {
            this.uploadDir = "uploads/";
        }
        
        logger.info("ImageUploadService initialized with upload directory: {}", uploadDir);
        
        // Ensure upload directory exists
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                logger.info("Created upload directory: {}", uploadPath.toAbsolutePath());
            }
        } catch (IOException e) {
            logger.error("Failed to create upload directory: {}", e.getMessage(), e);
        }
    }

    public String saveImage(MultipartFile file) {
        return saveFile(file, "image");
    }

    public String saveVideo(MultipartFile file) {
        return saveFile(file, "video");
    }

    public String saveFile(MultipartFile file, String fileType) {
        try {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File is null or empty");
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.trim().isEmpty()) {
                throw new IllegalArgumentException("Original filename is null or empty");
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null) {
                throw new IllegalArgumentException("Content type is null");
            }

            if ("image".equals(fileType) && !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Invalid file type. Only image files are allowed.");
            }

            if ("video".equals(fileType) && !contentType.startsWith("video/")) {
                // Fallback: check file extension for videos
                if (originalFilename != null) {
                    String lowerFilename = originalFilename.toLowerCase();
                    boolean isValidVideoExtension = lowerFilename.endsWith(".mp4") || 
                                                 lowerFilename.endsWith(".avi") || 
                                                 lowerFilename.endsWith(".mov") || 
                                                 lowerFilename.endsWith(".wmv") || 
                                                 lowerFilename.endsWith(".flv") || 
                                                 lowerFilename.endsWith(".webm") || 
                                                 lowerFilename.endsWith(".mkv");
                    if (!isValidVideoExtension) {
                        throw new IllegalArgumentException("Invalid file type. Only video files are allowed.");
                    }
                } else {
                    throw new IllegalArgumentException("Invalid file type. Only video files are allowed.");
                }
            }

            // Validate file size (50MB limit for videos, 10MB for images)
            long maxSize = "video".equals(fileType) ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
            if (file.getSize() > maxSize) {
                String maxSizeMB = "video".equals(fileType) ? "50MB" : "10MB";
                throw new IllegalArgumentException("File size too large. Maximum size is " + maxSizeMB + ".");
            }

            // Sanitize filename
            String sanitizedFilename = originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
            String filename = System.currentTimeMillis() + "_" + sanitizedFilename;
            
            Path uploadPath = Paths.get(uploadDir);
            Path filepath = uploadPath.resolve(filename);
            
            logger.info("Saving {} file to: {}", fileType, filepath.toAbsolutePath());
            
            // Create directories if they don't exist
            Files.createDirectories(uploadPath);
            
            // Save the file
            file.transferTo(filepath.toFile());
            
            // Verify file was saved
            if (!Files.exists(filepath)) {
                throw new RuntimeException("File was not saved successfully");
            }
            
            logger.info("{} file saved successfully: {}", fileType, filename);
            
            // Return the URL path (relative to the server root)
            return "/uploads/" + filename;
        } catch (IOException e) {
            logger.error("Failed to upload {} file: {}", fileType, e.getMessage(), e);
            throw new RuntimeException("Failed to upload " + fileType + " file: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error during {} file upload: {}", fileType, e.getMessage(), e);
            throw new RuntimeException("Failed to upload " + fileType + " file: " + e.getMessage(), e);
        }
    }
}
