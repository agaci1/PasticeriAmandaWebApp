package com.amanda.pasticeri.dto;

public class JwtResponse {
    private String token;
    private String role;
    private String email;

    public JwtResponse(String token, String role, String email) {
        this.token = token;
        this.role = role;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getEmail() {
        return email;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
