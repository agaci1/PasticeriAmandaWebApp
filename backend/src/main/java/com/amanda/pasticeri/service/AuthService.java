package com.amanda.pasticeri.service;

import com.amanda.pasticeri.dto.JwtResponse;
import com.amanda.pasticeri.model.User;
import com.amanda.pasticeri.repository.UserRepository;
import com.amanda.pasticeri.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public JwtResponse login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                String role = user.getRole();
                if (role != null && (role.equalsIgnoreCase("ROLE_ADMIN") || role.equalsIgnoreCase("role_admin"))) {
                    role = "ADMIN";
                }
                return new JwtResponse(jwtTokenProvider.generateToken(user), role, user.getEmail());
            }
        }

        return null;
    }
}
