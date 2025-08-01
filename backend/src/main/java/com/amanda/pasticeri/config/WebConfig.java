package com.amanda.pasticeri.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Check for Railway volume mount path
        String railwayPath = System.getenv("RAILWAY_VOLUME_MOUNT_PATH");
        String uploadsPath;
        
        if (railwayPath != null && !railwayPath.trim().isEmpty()) {
            uploadsPath = "file:" + railwayPath + "/uploads/";
        } else {
            uploadsPath = "file:uploads/";
        }
        
        logger.info("Configuring static resource handler for uploads at: {}", uploadsPath);
        
        registry
            .addResourceHandler("/uploads/**")
            .addResourceLocations(uploadsPath)
            .setCachePeriod(3600); // Cache for 1 hour
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                            "https://pasticeriamanda.com",
                            "https://www.pasticeriamanda.com",
                            "http://localhost:3000"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
