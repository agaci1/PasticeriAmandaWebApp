package com.amanda.pasticeri.repository;

import com.amanda.pasticeri.model.FeedItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedItemRepository extends JpaRepository<FeedItem, Long> {
} 