
package com.interviewbot.backend.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.interviewbot.backend.respository.SessionRepository;
import com.interviewbot.backend.respository.UserRepository;

import java.util.Map;
import java.util.HashMap;



@RestController

@RequestMapping("/api")

public class HealthController {

	@Autowired
	private SessionRepository sessionRepository;
	
	@Autowired
	private UserRepository userRepository;

    @GetMapping("/health")

    public ResponseEntity<?> health() {

        return ResponseEntity.ok(Map.of(

            "status",  "UP",

            "message", "AI Interview Bot is running!"

        ));

    }

    @Autowired
    private com.interviewbot.backend.respository.QARepository qaRepository;

    @GetMapping("/admin/clear-db")
    public ResponseEntity<?> clearDb() {
        qaRepository.deleteAll();
        sessionRepository.deleteAll();
        userRepository.deleteAll();
        return ResponseEntity.ok("Database cleared!");
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            var user = userRepository.findByEmail(username);
            if (user.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "totalInterviews", 0,
                    "averageScore", 0,
                    "hoursSpent", 0,
                    "upcomingInterviews", new Object[0]
                ));
            }
            
            Long userId = user.get().getId();
            long totalInterviews = sessionRepository.findByUserId(userId).size();
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalInterviews", totalInterviews);
            response.put("averageScore", 0);
            response.put("hoursSpent", 0);
            response.put("upcomingInterviews", new Object[0]);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of(
                "totalInterviews", 0,
                "averageScore", 0,
                "hoursSpent", 0,
                "upcomingInterviews", new Object[0]
            ));
        }
    }

}

