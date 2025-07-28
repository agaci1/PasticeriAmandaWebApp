package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.Product;
import com.amanda.pasticeri.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    public List<Product> getAll() {
        return repository.findAll();
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    public Product update(Long id, Product updated) {
        Optional<Product> optional = repository.findById(id);
        if (optional.isEmpty()) throw new RuntimeException("Product not found");

        Product existing = optional.get();
        existing.setName(updated.getName());
        existing.setCategory(updated.getCategory());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setPriceType(updated.getPriceType());
        existing.setImageUrl(updated.getImageUrl());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Product getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }
}