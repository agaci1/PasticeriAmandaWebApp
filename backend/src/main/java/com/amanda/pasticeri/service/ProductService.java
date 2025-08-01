package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Product;
import com.amanda.pasticeri.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository repository;

    public List<Product> getAll() {
        return repository.findAll();
    }

    @Retryable(value = {DataAccessException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public Product save(Product product) {
        try {
            logger.info("💾 Saving product: {}", product.getName());
            Product savedProduct = repository.save(product);
            logger.info("✅ Product saved successfully: {}", savedProduct.getId());
            return savedProduct;
        } catch (DataAccessException e) {
            logger.error("❌ Database error while saving product: {}", e.getMessage());
            throw e;
        }
    }

    @Retryable(value = {DataAccessException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public Product update(Long id, Product updated) {
        try {
            logger.info("🔄 Updating product with ID: {}", id);
            Optional<Product> optional = repository.findById(id);
            if (optional.isEmpty()) {
                logger.error("❌ Product not found with ID: {}", id);
                throw new RuntimeException("Product not found");
            }

            Product existing = optional.get();
            existing.setName(updated.getName());
            existing.setCategory(updated.getCategory());
            existing.setDescription(updated.getDescription());
            existing.setPrice(updated.getPrice());
            existing.setPriceType(updated.getPriceType());
            existing.setImageUrl(updated.getImageUrl());
            
            Product savedProduct = repository.save(existing);
            logger.info("✅ Product updated successfully: {}", savedProduct.getId());
            return savedProduct;
        } catch (DataAccessException e) {
            logger.error("❌ Database error while updating product: {}", e.getMessage());
            throw e;
        }
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Product getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }
}