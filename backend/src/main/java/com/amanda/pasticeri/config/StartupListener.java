package com.amanda.pasticeri.config;

import com.amanda.pasticeri.service.ImageBackupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class StartupListener {

    private final ImageBackupService imageBackupService;

    @Autowired
    public StartupListener(ImageBackupService imageBackupService) {
        this.imageBackupService = imageBackupService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        System.out.println("🚀 Application started. Restoring images from backup...");
        imageBackupService.restoreImages();
        System.out.println("✅ Image restoration completed.");
    }
} 