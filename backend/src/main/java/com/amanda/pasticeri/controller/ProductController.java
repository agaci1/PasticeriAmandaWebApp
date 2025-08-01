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
            String imageUrl = imageUploadService.saveImage(file);
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

    @GetMapping("/test-uploads")
    public ResponseEntity<Map<String, Object>> testUploads() {
        Map<String, Object> response = new HashMap<>();
        String currentDir = System.getProperty("user.dir");
        String uploadsPath = currentDir + "/uploads";
        File uploadsDir = new File(uploadsPath);
        
        response.put("currentDirectory", currentDir);
        response.put("uploadsPath", uploadsPath);
        response.put("uploadsExists", uploadsDir.exists());
        response.put("uploadsIsDirectory", uploadsDir.isDirectory());
        
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
                    fileList.add(fileInfo);
                }
            }
            response.put("files", fileList);
        }
        
        return ResponseEntity.ok(response);
    }
}
