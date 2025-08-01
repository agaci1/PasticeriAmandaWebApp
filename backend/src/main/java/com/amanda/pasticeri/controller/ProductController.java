package com.amanda.pasticeri.controller;

import com.amanda.pasticeri.model.Product;
import com.amanda.pasticeri.service.ProductService;
import com.amanda.pasticeri.service.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"https://pasticeriamanda.com", "https://www.pasticeriamanda.com", "http://localhost:3000"}, allowCredentials = "true")
public class ProductController {

    private final ProductService service;
    private final ImageUploadService imageUploadService;

    public ProductController(ProductService service, ImageUploadService imageUploadService) {
        this.service = service;
        this.imageUploadService = imageUploadService;
    }

    @GetMapping
    public List<Product> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Product product) {
        try {
            Product savedProduct = service.save(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create product: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Product product) {
        try {
            Product updatedProduct = service.update(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update product: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete product: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No image file provided"));
            }
            
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid file type. Only image files are allowed."));
            }
            
            // Validate file size (10MB limit)
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("error", "File size too large. Maximum size is 10MB."));
            }
            
            String imageUrl = imageUploadService.saveImage(file);
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

    @GetMapping("/test-uploads")
    public ResponseEntity<Map<String, Object>> testUploads() {
        Map<String, Object> response = new HashMap<>();
        String currentDir = System.getProperty("user.dir");
        String railwayPath = System.getenv("RAILWAY_VOLUME_MOUNT_PATH");
        
        response.put("currentDirectory", currentDir);
        response.put("railwayVolumeMountPath", railwayPath);
        
        // Test both possible upload paths
        String[] possiblePaths = {
            currentDir + "/uploads",
            railwayPath != null ? railwayPath + "/uploads" : null
        };
        
        List<Map<String, Object>> pathTests = new ArrayList<>();
        for (String path : possiblePaths) {
            if (path != null) {
                Map<String, Object> pathInfo = new HashMap<>();
                File uploadsDir = new File(path);
                pathInfo.put("path", path);
                pathInfo.put("exists", uploadsDir.exists());
                pathInfo.put("isDirectory", uploadsDir.isDirectory());
                pathInfo.put("canRead", uploadsDir.canRead());
                pathInfo.put("canWrite", uploadsDir.canWrite());
                pathInfo.put("absolutePath", uploadsDir.getAbsolutePath());
                
                if (uploadsDir.exists() && uploadsDir.isDirectory()) {
                    File[] files = uploadsDir.listFiles();
                    List<Map<String, Object>> fileList = new ArrayList<>();
                    if (files != null) {
                        for (File file : files) {
                            Map<String, Object> fileInfo = new HashMap<>();
                            fileInfo.put("name", file.getName());
                            fileInfo.put("size", file.length());
                            fileInfo.put("isFile", file.isFile());
                            fileInfo.put("isDirectory", file.isDirectory());
                            fileInfo.put("canRead", file.canRead());
                            fileList.add(fileInfo);
                        }
                    }
                    pathInfo.put("files", fileList);
                    pathInfo.put("fileCount", files != null ? files.length : 0);
                }
                pathTests.add(pathInfo);
            }
        }
        response.put("pathTests", pathTests);
        
        return ResponseEntity.ok(response);
    }
}
