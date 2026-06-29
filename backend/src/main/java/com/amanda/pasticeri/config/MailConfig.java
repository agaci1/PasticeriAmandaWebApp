package com.amanda.pasticeri.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender javaMailSender(
            @Value("${spring.mail.host:}") String host,
            @Value("${spring.mail.port:587}") int port,
            @Value("${spring.mail.username:}") String username,
            @Value("${spring.mail.password:}") String password,
            @Value("${spring.mail.properties.mail.smtp.ssl.enable:false}") boolean sslEnabled,
            @Value("${spring.mail.properties.mail.smtp.starttls.enable:true}") boolean startTlsEnabled
    ) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        
        // Only set values if they're not empty (allow nullability)
        if (host != null && !host.isBlank()) {
            sender.setHost(host);
        }
        if (username != null && !username.isBlank()) {
            sender.setUsername(username);
        }
        if (password != null && !password.isBlank()) {
            sender.setPassword(password);
        }
        
        sender.setPort(port);

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.connectiontimeout", "120000");
        props.put("mail.smtp.timeout", "120000");
        props.put("mail.smtp.writetimeout", "120000");

        // Port 587 (STARTTLS) configuration — better for Railway
        if (port == 587) {
            props.put("mail.smtp.ssl.enable", "false");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.starttls.required", "true");
        } 
        // Port 465 (SSL) configuration — for direct SSL connections
        else if (port == 465) {
            props.put("mail.smtp.ssl.enable", "true");
            props.put("mail.smtp.starttls.enable", "false");
            props.put("mail.smtp.socketFactory.port", String.valueOf(port));
            props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            props.put("mail.smtp.socketFactory.fallback", "false");
        }
        // Custom configuration — allow explicit control
        else {
            boolean useSsl = sslEnabled || port == 465;
            if (useSsl) {
                props.put("mail.smtp.ssl.enable", "true");
                props.put("mail.smtp.starttls.enable", "false");
                props.put("mail.smtp.socketFactory.port", String.valueOf(port));
                props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
                props.put("mail.smtp.socketFactory.fallback", "false");
            } else {
                props.put("mail.smtp.ssl.enable", "false");
                props.put("mail.smtp.starttls.enable", String.valueOf(startTlsEnabled));
            }
        }

        return sender;
    }
}
