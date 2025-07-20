package com.amanda.pasticeri.service;

import com.amanda.pasticeri.model.User;
import com.amanda.pasticeri.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean registerUser(String email, String password, String name) {
        if (userRepository.findByEmail(email).isPresent()) {
            return false; // Email already in use
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        user.setRole("USER"); // All signups are normal users

        userRepository.save(user);
        return true;
    }
}
