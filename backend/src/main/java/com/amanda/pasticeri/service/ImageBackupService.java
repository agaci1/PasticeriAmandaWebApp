package com.amanda.pasticeri.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImageBackupService {

    private final String backupDir = "backup/uploads/";
    private final ImageUploadService imageUploadService;

    @Autowired
    public ImageBackupService(ImageUploadService imageUploadService) {
        this.imageUploadService = imageUploadService;
    }

    public void backupImages() {
        try {
            String uploadDir = System.getenv("RAILWAY_VOLUME_MOUNT_PATH") != null ? 
                System.getenv("RAILWAY_VOLUME_MOUNT_PATH") + "/uploads/" : "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            Path backupPath = Paths.get(backupDir);

            if (!Files.exists(uploadPath)) {
                System.out.println("📁 Upload directory doesn't exist, nothing to backup");
                return;
            }

            // Create backup directory
            Files.createDirectories(backupPath);

            // Copy all files from uploads to backup
            List<Path> files = Files.walk(uploadPath)
                .filter(Files::isRegularFile)
                .collect(Collectors.toList());

            for (Path file : files) {
                Path relativePath = uploadPath.relativize(file);
                Path backupFile = backupPath.resolve(relativePath);
                
                // Create parent directories if they don't exist
                Files.createDirectories(backupFile.getParent());
                
                // Copy file
                Files.copy(file, backupFile, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("✅ Backed up: " + file.getFileName());
            }

            System.out.println("✅ Backup completed. Total files: " + files.size());
        } catch (IOException e) {
            System.err.println("❌ Backup failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void restoreImages() {
        try {
            String uploadDir = System.getenv("RAILWAY_VOLUME_MOUNT_PATH") != null ? 
                System.getenv("RAILWAY_VOLUME_MOUNT_PATH") + "/uploads/" : "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            Path backupPath = Paths.get(backupDir);

            if (!Files.exists(backupPath)) {
                System.out.println("📁 Backup directory doesn't exist, nothing to restore");
                return;
            }

            // Create upload directory
            Files.createDirectories(uploadPath);

            // Copy all files from backup to uploads
            List<Path> files = Files.walk(backupPath)
                .filter(Files::isRegularFile)
                .collect(Collectors.toList());

            for (Path file : files) {
                Path relativePath = backupPath.relativize(file);
                Path uploadFile = uploadPath.resolve(relativePath);
                
                // Create parent directories if they don't exist
                Files.createDirectories(uploadFile.getParent());
                
                // Copy file
                Files.copy(file, uploadFile, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("✅ Restored: " + file.getFileName());
            }

            System.out.println("✅ Restore completed. Total files: " + files.size());
        } catch (IOException e) {
            System.err.println("❌ Restore failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
} 