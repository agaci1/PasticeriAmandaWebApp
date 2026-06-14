package com.amanda.pasticeri.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Value("${app.build.version:unknown}")
    private String buildVersion;

    @GetMapping("/api/health")
    public ResponseEntity<?> healthCheck() {
        String commit = System.getenv("RAILWAY_GIT_COMMIT_SHA");
        if (commit == null || commit.isBlank()) {
            commit = "local";
        } else if (commit.length() > 7) {
            commit = commit.substring(0, 7);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "healthy");
        body.put("version", buildVersion);
        body.put("commit", commit);
        body.put("service", "Pasticeri Amanda Backend");
        body.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(body);
    }
}
