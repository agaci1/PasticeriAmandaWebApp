package com.amanda.pasticeri.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ResponseEntity<?> healthCheck() {
        String commit = System.getenv("RAILWAY_GIT_COMMIT_SHA");
        if (commit == null || commit.isBlank()) {
            commit = "local";
        } else if (commit.length() > 7) {
            commit = commit.substring(0, 7);
        }

        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "timestamp", System.currentTimeMillis(),
            "service", "Pasticeri Amanda Backend",
            "commit", commit
        ));
    }
} 