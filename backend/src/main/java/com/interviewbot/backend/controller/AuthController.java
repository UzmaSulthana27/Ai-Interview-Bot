package com.interviewbot.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.interviewbot.backend.model.User;
import com.interviewbot.backend.service.AuthService;
import com.interviewbot.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
   
    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

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
                "userId", user.getId(),
                "name", user.getName(),
                "sessionsUsed", 0,
                "sessionsLeft", 3,
                "isPremium", false,
                "user", Map.of(
                    "id", user.getId(),
                    "userId", user.getId(),
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
                "id",      user.getId(),
                "userId",  user.getId(),
                "name",    user.getName(),
                "sessionsUsed", 0,
                "sessionsLeft", 3,
                "isPremium",    false
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
                "userId", user.getId(),
                "name", user.getName(),
                "sessionsUsed", user.getSessionsUsed() != null ? user.getSessionsUsed() : 0,
                "sessionsLeft", user.getSessionsUsed() != null ? Math.max(0, 3 - user.getSessionsUsed()) : 3,
                "isPremium", user.getIsPremium() != null ? user.getIsPremium() : false,
                "user", Map.of(
                    "id", user.getId(),
                    "userId", user.getId(),
                    "fullName", user.getName(),
                    "email", user.getEmail(),
                    "bio", user.getBio() != null ? user.getBio() : "",
                    "isPremium", user.getIsPremium() != null ? user.getIsPremium() : false,
                    "sessionsUsed", user.getSessionsUsed() != null ? user.getSessionsUsed() : 0
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

    @PostMapping("/upgrade")
    public ResponseEntity<?> upgrade(
            @RequestBody Map<String, Object> body) {
        try {
            if (body.get("userId") == null) {
                throw new RuntimeException("User ID is required.");
            }
            Long userId = Long.valueOf(body.get("userId").toString());
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Payment Amount validation
            if (body.get("amount") == null) {
                throw new RuntimeException("Payment amount is required.");
            }
            double amount;
            try {
                amount = Double.parseDouble(body.get("amount").toString());
            } catch (NumberFormatException e) {
                throw new RuntimeException("Invalid amount format.");
            }
            if (amount < 19.99) {
                throw new RuntimeException("Insufficient payment amount. Premium costs $19.99.");
            }

            // Card details validation
            String cardNumber = (String) body.get("cardNumber");
            String expiry = (String) body.get("expiry");
            String cvv = (String) body.get("cvv");

            if (cardNumber == null || cardNumber.replaceAll("\\s+", "").length() < 16) {
                throw new RuntimeException("Invalid card number. Please provide a 16-digit card number.");
            }
            if (expiry == null || !expiry.matches("(0[1-9]|1[0-2])/[0-9]{2}")) {
                throw new RuntimeException("Invalid expiration date. Use MM/YY format.");
            }
            if (cvv == null || cvv.trim().length() < 3 || cvv.trim().length() > 4) {
                throw new RuntimeException("Invalid CVV. Must be 3 or 4 digits.");
            }

            // Mask card number for security logs
            String cleanedCard = cardNumber.replaceAll("\\s+", "");
            String maskedCard = "****-****-****-" + cleanedCard.substring(cleanedCard.length() - 4);
            System.out.println("Processing payment of $" + amount + " via Card: " + maskedCard + " for user ID: " + userId);

            // Simulation of successful gateway response
            user.setIsPremium(true);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "message", "Payment of $" + amount + " successful! Premium unlocked.",
                "isPremium", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<?> status(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Not found"));

            int sessionsLeft = Boolean.TRUE.equals(user.getIsPremium())
                ? 999
                : Math.max(0, 3 - user.getSessionsUsed());

            return ResponseEntity.ok(Map.of(
                "userId",       user.getId(),
                "name",         user.getName(),
                "isPremium",    user.getIsPremium() != null ? user.getIsPremium() : false,
                "sessionsUsed", user.getSessionsUsed() != null ? user.getSessionsUsed() : 0,
                "sessionsLeft", sessionsLeft
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }
}
