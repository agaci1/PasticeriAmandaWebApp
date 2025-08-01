package com.amanda.pasticeri.controller;

import com.amanda.pasticeri.model.FeedItem;
import com.amanda.pasticeri.repository.FeedItemRepository;
import com.amanda.pasticeri.service.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feed")
@CrossOrigin(origins = {"https://pasticeriamanda.com", "https://www.pasticeriamanda.com", "http://localhost:3000"}, allowCredentials = "true")
public class FeedController {
    @Autowired
    private FeedItemRepository feedRepo;
    
    @Autowired
    private ImageUploadService imageUploadService;

    // List all feed items (newest first) - public access
    @GetMapping
    public List<FeedItem> getAll() {
        return feedRepo.findAll().stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .toList();
    }

    // Add a new feed item (image upload, video upload, or video link) - admin only
    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> addFeedItem(
        @RequestParam String type, // 'image' or 'video'
        @RequestParam String title,
        @RequestParam String description,
        @RequestParam(required = false) MultipartFile file,
        @RequestParam(required = false) String url
    ) {
        try {
            FeedItem item = new FeedItem();
            item.setType(type);
            item.setTitle(title);
            item.setDescription(description);
            
            if ("image".equals(type)) {
                if (file != null && !file.isEmpty()) {
                    // Validate file type for images
                    String contentType = file.getContentType();
                    if (contentType == null || !contentType.startsWith("image/")) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Invalid file type. Only image files are allowed for image type."));
                    }
                    
                    // Use ImageUploadService for consistent file handling
                    String imageUrl = imageUploadService.saveImage(file);
                    item.setUrl(imageUrl);
                } else {
                    return ResponseEntity.badRequest().body(Map.of("error", "Image file is required for image type."));
                }
            } else if ("video".equals(type)) {
                if (file != null && !file.isEmpty()) {
                    // Validate file type for videos
                    String contentType = file.getContentType();
                    if (contentType == null || !contentType.startsWith("video/")) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Invalid file type. Only video files are allowed for video type."));
                    }
                    
                    // Use ImageUploadService for video upload
                    String videoUrl = imageUploadService.saveVideo(file);
                    item.setUrl(videoUrl);
                } else if (url != null && !url.trim().isEmpty()) {
                    // Use provided video URL
                    item.setUrl(url);
                } else {
                    return ResponseEntity.badRequest().body(Map.of("error", "Either video file or video URL is required for video type."));
                }
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid type. Must be 'image' or 'video'."));
            }
            
            FeedItem savedItem = feedRepo.save(item);
            return ResponseEntity.ok(savedItem);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to add feed item: " + e.getMessage()));
        }
    }

    // Delete a feed item - admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteFeedItem(@PathVariable Long id) {
        try {
            feedRepo.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete feed item: " + e.getMessage()));
        }
    }
} 