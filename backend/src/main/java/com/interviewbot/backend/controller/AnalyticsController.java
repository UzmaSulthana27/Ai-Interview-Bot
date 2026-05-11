package com.interviewbot.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.interviewbot.backend.model.InterviewSession;
import com.interviewbot.backend.respository.SessionRepository;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private SessionRepository sessionRepository;

    @GetMapping("/performance/{userId}")
    public ResponseEntity<?> getPerformanceMetrics(@PathVariable Long userId) {
        List<InterviewSession> sessions = sessionRepository.findByUserId(userId);
        
        if (sessions.isEmpty()) {
            return ResponseEntity.ok(createEmptyMetrics());
        }

        double overallScore = sessions.stream()
                .mapToDouble(s -> s.getScore() != null ? s.getScore() : 0.0)
                .average()
                .orElse(0.0);

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("overallScore", Math.round(overallScore));
        metrics.put("totalInterviews", sessions.size());
        
        // Skill scores (mocking for now based on job roles)
        List<Map<String, Object>> skillScores = new ArrayList<>();
        skillScores.add(Map.of("name", "Technical Knowledge", "score", Math.round(overallScore * 0.9)));
        skillScores.add(Map.of("name", "Communication", "score", Math.round(overallScore * 0.85)));
        skillScores.add(Map.of("name", "Problem Solving", "score", Math.round(overallScore * 0.8)));
        metrics.put("skillScores", skillScores);

        // Interview types
        Map<String, List<InterviewSession>> byRole = new HashMap<>();
        for (InterviewSession s : sessions) {
            byRole.computeIfAbsent(s.getJobRole(), k -> new ArrayList<>()).add(s);
        }

        List<Map<String, Object>> interviewTypes = new ArrayList<>();
        for (Map.Entry<String, List<InterviewSession>> entry : byRole.entrySet()) {
            double avg = entry.getValue().stream()
                    .mapToDouble(s -> s.getScore() != null ? s.getScore() : 0.0)
                    .average()
                    .orElse(0.0);
            
            Map<String, Object> type = new HashMap<>();
            type.put("name", entry.getKey());
            type.put("count", entry.getValue().size());
            type.put("avgScore", Math.round(avg));
            type.put("icon", getIconForRole(entry.getKey()));
            interviewTypes.add(type);
        }
        metrics.put("interviewTypes", interviewTypes);

        // Recent sessions
        List<Map<String, Object>> recentSessions = new ArrayList<>();
        sessions.stream()
                .sorted((s1, s2) -> s2.getId().compareTo(s1.getId())) // assuming higher ID is newer
                .limit(5)
                .forEach(s -> {
                    Map<String, Object> session = new HashMap<>();
                    session.put("title", s.getJobRole());
                    session.put("date", "Recent"); // In a real app, use a date field
                    session.put("score", s.getScore() != null ? Math.round(s.getScore()) : 0);
                    session.put("duration", "15 mins");
                    session.put("icon", getIconForRole(s.getJobRole()));
                    recentSessions.add(session);
                });
        metrics.put("recentSessions", recentSessions);

        return ResponseEntity.ok(metrics);
    }

    private Map<String, Object> createEmptyMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("overallScore", 0);
        metrics.put("totalInterviews", 0);
        metrics.put("skillScores", List.of());
        metrics.put("interviewTypes", List.of());
        metrics.put("recentSessions", List.of());
        return metrics;
    }

    private String getIconForRole(String role) {
        String r = role.toLowerCase();
        if (r.contains("java")) return "coffee";
        if (r.contains("react")) return "javascript";
        if (r.contains("python")) return "terminal";
        return "code";
    }
}
