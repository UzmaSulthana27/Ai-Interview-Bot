package com.interviewbot.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.interviewbot.backend.model.QuestionAnswer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.interviewbot.backend.model.InterviewSession;
import com.interviewbot.backend.repository.SessionRepository;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private com.interviewbot.backend.repository.QARepository qaRepository;

    @GetMapping("/performance/{userId}")
    public ResponseEntity<?> getPerformanceMetrics(@PathVariable Long userId) {
        List<InterviewSession> sessions = sessionRepository.findByUserId(userId);
        
        if (sessions.isEmpty()) {
            return ResponseEntity.ok(createEmptyMetrics());
        }

        double overallAchieved = 0;
        int totalQuestionsAcrossSessions = 0;
        
        for (InterviewSession s : sessions) {
            List<QuestionAnswer> qas = qaRepository.findBySessionId(s.getId());
            totalQuestionsAcrossSessions += qas.size();
            overallAchieved += qas.stream().mapToInt(QuestionAnswer::getScore).sum();
        }
        
        double overallScore = (totalQuestionsAcrossSessions > 0) 
            ? (overallAchieved / (totalQuestionsAcrossSessions * 10.0)) * 100.0 
            : 0.0;

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
            double totalAchieved = 0;
            int totalQuestions = 0;
            for (InterviewSession s : entry.getValue()) {
                List<QuestionAnswer> qas = qaRepository.findBySessionId(s.getId());
                totalQuestions += qas.size();
                totalAchieved += qas.stream().mapToInt(QuestionAnswer::getScore).sum();
            }
            double avg = (totalQuestions > 0) ? (totalAchieved / (totalQuestions * 10.0)) * 100.0 : 0.0;
            
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
                    List<QuestionAnswer> qas = qaRepository.findBySessionId(s.getId());
                    double sScore = (qas.isEmpty()) ? 0.0 : (qas.stream().mapToInt(QuestionAnswer::getScore).sum() / (qas.size() * 10.0)) * 100.0;
                    session.put("score", Math.round(sScore));
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
