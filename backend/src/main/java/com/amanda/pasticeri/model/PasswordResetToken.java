package com.amanda.pasticeri.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String token;
    private Date expiryDate;

    // Constructors
    public PasswordResetToken() {}

    public PasswordResetToken(String email, String token, Date expiryDate) {
        this.email = email;
        this.token = token;
        this.expiryDate = expiryDate;
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Date getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Date expiryDate) { this.expiryDate = expiryDate; }
}
