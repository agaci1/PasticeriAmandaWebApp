package com.amanda.pasticeri.controller;

import com.amanda.pasticeri.dto.JwtResponse;
import com.amanda.pasticeri.dto.LoginRequest;
import com.amanda.pasticeri.dto.ForgotPasswordRequest;
import com.amanda.pasticeri.dto.ResetPasswordRequest;
import com.amanda.pasticeri.model.PasswordResetToken;
import com.amanda.pasticeri.model.User;
import com.amanda.pasticeri.repository.PasswordResetTokenRepository;
import com.amanda.pasticeri.repository.UserRepository;
import com.amanda.pasticeri.service.AuthService;
import com.amanda.pasticeri.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"https://pasticeriamanda.com", "https://www.pasticeriamanda.com", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            JwtResponse response = authService.login(request.getEmail(), request.getPassword());

            if (response != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("success", false, "message", "Invalid credentials"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body(Map.of("success", false, "message", "Server error"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        Optional<User> existing = userRepository.findByEmail(user.getEmail());

        if (existing.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("success", false, "message", "Email already in use"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("success", true, "message", "User registered successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {
            String token = UUID.randomUUID().toString();
            Date expiry = new Date(System.currentTimeMillis() + 1000 * 60 * 60); // 1 hour

            PasswordResetToken resetToken = new PasswordResetToken(
                    request.getEmail(), token, expiry
            );
            tokenRepository.save(resetToken);

            String link = "https://pasticeriamanda.vercel.app/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(request.getEmail(), link);
        }

        return ResponseEntity.ok("If an account exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(request.getToken());

        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiryDate().before(new Date())) {
            return ResponseEntity.badRequest().body("Token is invalid or expired.");
        }

        Optional<User> userOpt = userRepository.findByEmail(tokenOpt.get().getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        tokenRepository.delete(tokenOpt.get());

        return ResponseEntity.ok("Password has been reset successfully.");
    }

    // Temporary endpoint to promote user to admin (for testing only)
    @PostMapping("/promote-to-admin")
    public ResponseEntity<?> promoteToAdmin(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }
        
        User user = userOpt.get();
        user.setRole("ADMIN");
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("success", true, "message", "User promoted to admin successfully"));
    }
}
