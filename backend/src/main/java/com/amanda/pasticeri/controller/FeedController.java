package com.amanda.pasticeri.controller;

import com.amanda.pasticeri.model.FeedItem;
import com.amanda.pasticeri.repository.FeedItemRepository;
import com.amanda.pasticeri.service.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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

    // Add a new feed item (image upload or video link) - admin only
    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public FeedItem addFeedItem(
        @RequestParam String type, // 'image' or 'video'
        @RequestParam String title,
        @RequestParam String description,
        @RequestParam(required = false) MultipartFile file,
        @RequestParam(required = false) String url
    ) throws IOException {
        FeedItem item = new FeedItem();
        item.setType(type);
        item.setTitle(title);
        item.setDescription(description);
        
        if ("image".equals(type) && file != null && !file.isEmpty()) {
            // Use ImageUploadService for consistent file handling
            String imageUrl = imageUploadService.saveImage(file);
            item.setUrl(imageUrl);
        } else if ("video".equals(type) && url != null) {
            item.setUrl(url);
        } else {
            throw new IllegalArgumentException("Invalid feed item: must provide image file or video url");
        }
        
        return feedRepo.save(item);
    }

    // Delete a feed item - admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteFeedItem(@PathVariable Long id) {
        feedRepo.deleteById(id);
    }
} 