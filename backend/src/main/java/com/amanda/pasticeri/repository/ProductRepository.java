package com.amanda.pasticeri.repository;

import com.amanda.pasticeri.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}