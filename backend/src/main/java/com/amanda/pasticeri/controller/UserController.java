package com.amanda.pasticeri.controller;

import com.amanda.pasticeri.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestParam String email, @RequestParam String password, @RequestParam String name) {
        boolean success = userService.registerUser(email, password, name);

        if (success) {
            return ResponseEntity.ok().body("{\"success\": true}");
        } else {
            return ResponseEntity.badRequest().body("{\"success\": false, \"message\": \"Email already in use\"}");
        }
    }
}
