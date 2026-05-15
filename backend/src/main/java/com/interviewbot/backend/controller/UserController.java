package com.interviewbot.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.interviewbot.backend.model.User;
import com.interviewbot.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private static final int MAX_BIO = 2000;

    private final UserRepository userRepository;

    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(this::toProfileResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        return userRepository.findById(userId)
                .map(user -> {
                    if (body != null && body.containsKey("bio")) {
                        String bio = body.get("bio");
                        if (bio == null) {
                            user.setBio(null);
                        } else if (bio.length() > MAX_BIO) {
                            user.setBio(bio.substring(0, MAX_BIO));
                        } else {
                            user.setBio(bio);
                        }
                    }
                    User saved = userRepository.save(user);
                    return ResponseEntity.ok(toProfileResponse(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toProfileResponse(User u) {
        return Map.of(
                "id", u.getId(),
                "fullName", u.getName() != null ? u.getName() : "",
                "email", u.getEmail() != null ? u.getEmail() : "",
                "bio", u.getBio() != null ? u.getBio() : "");
    }
}
