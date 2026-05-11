package com.interviewbot.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.interviewbot.backend.model.User;
import com.interviewbot.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
   
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        try {
            User user = authService.register(
                body.get("fullName"),
                body.get("email"),
                body.get("password")
            );
            return ResponseEntity.ok(Map.of(
                "message", "Signed up successfully!",
                "user", Map.of(
                    "id", user.getId(),
                    "fullName", user.getName(),
                    "email", user.getEmail(),
                    "bio", user.getBio() != null ? user.getBio() : ""
                ),
                "token", "dummy-token-123"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            User user = authService.register(
                body.get("name"),
                body.get("email"),
                body.get("password")
            );
            return ResponseEntity.ok(Map.of(
                "message", "Registered successfully!",
                "userId",  user.getId(),
                "name",    user.getName()
            ));
        } catch (Exception e) {
            // Sends exact error message back to React
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            User user = authService.login(
                body.get("email"),
                body.get("password")
            );
            return ResponseEntity.ok(Map.of(
                "message", "Login successful!",
                "user", Map.of(
                    "id", user.getId(),
                    "fullName", user.getName(),
                    "email", user.getEmail(),
                    "bio", user.getBio() != null ? user.getBio() : ""
                ),
                "token", "dummy-token-123"
            ));
        } catch (Exception e) {
            // Sends exact error message back to React
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage()
            ));
        }
    }
}
