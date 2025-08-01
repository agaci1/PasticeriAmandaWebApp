package com.amanda.pasticeri.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component
public class DatabaseInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    @Autowired
    private Environment environment;

    @Autowired
    private DataSource dataSource;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeDatabase() {
        logger.info("🔧 Initializing database connection...");
        
        try (Connection connection = dataSource.getConnection()) {
            logger.info("✅ Database connection established successfully");
            logger.info("📊 Database URL: {}", environment.getProperty("spring.datasource.url"));
            logger.info("👤 Database User: {}", environment.getProperty("spring.datasource.username"));
            
            // Test a simple query
            try (var statement = connection.createStatement()) {
                statement.execute("SELECT 1");
                logger.info("✅ Database query test successful");
            }
            
        } catch (SQLException e) {
            logger.error("❌ Database connection failed: {}", e.getMessage());
            logger.error("🔍 SQL State: {}, Error Code: {}", e.getSQLState(), e.getErrorCode());
            
            // Don't throw the exception, just log it
            // The application should still start even if there are connection issues
        }
        
        logger.info("🏁 Database initialization completed");
    }
} 