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

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.port:465}")
    private int mailPort;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("service", "Pasticeri Amanda API");
        body.put("status", "online");
        body.put("health", "/api/health");
        body.put("version", buildVersion);
        return ResponseEntity.ok(body);
    }

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
        body.put("mail", buildMailStatus());

        return ResponseEntity.ok(body);
    }

    private Map<String, Object> buildMailStatus() {
        boolean hostSet = mailHost != null && !mailHost.isBlank() && !mailHost.contains("${");
        boolean userSet = mailUsername != null && !mailUsername.isBlank();
        boolean passSet = mailPassword != null && !mailPassword.isBlank();

        Map<String, Object> mail = new LinkedHashMap<>();
        mail.put("enabled", mailEnabled);
        mail.put("host", hostSet ? mailHost : "missing");
        mail.put("port", mailPort);
        mail.put("username", userSet ? mailUsername : "missing");
        mail.put("passwordSet", passSet);
        mail.put("configured", mailEnabled && hostSet && userSet && passSet);
        mail.put("recommendedPort", 465);
        return mail;
    }
}
