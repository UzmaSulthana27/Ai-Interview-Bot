package com.interviewbot.backend.controller;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.interviewbot.backend.model.InterviewSession;
import com.interviewbot.backend.model.QuestionAnswer;
import com.interviewbot.backend.model.User;
import com.interviewbot.backend.repository.QARepository;
import com.interviewbot.backend.repository.SessionRepository;
import com.interviewbot.backend.repository.UserRepository;
import com.interviewbot.backend.service.GroqService;
import com.interviewbot.backend.service.InterviewService;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {
	
	@Autowired
	private InterviewService interviewService;

	@Autowired private GroqService groqService;
	@Autowired private SessionRepository sessionRepository;
	@Autowired private QARepository qaRepository;
	@Autowired private UserRepository userRepository;
	@Autowired private com.interviewbot.backend.repository.ResumeAnalysisRepository resumeAnalysisRepository;
	    
	@DeleteMapping("/history/{sessionId}")
	public ResponseEntity<?> deleteSession(
	        @PathVariable Long sessionId,
	        @RequestParam Long userId) {
	    try {
	        String message = interviewService.deleteSession(sessionId, userId);
	        return ResponseEntity.ok(Map.of(
	            "message", message,
	            "deletedSessionId", sessionId
	        ));
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().body(Map.of(
	            "error", e.getMessage()
	        ));
	    }
	}

	@PostMapping("/start")
	public ResponseEntity<?> start(
	        @RequestParam String jobRole,
	        @RequestParam Long userId,
	        @RequestParam(defaultValue = "Medium") String difficulty,
	        @RequestParam(defaultValue = "QA") String format,
	        HttpServletRequest request) {

	    // ── STEP 1: Find user ──────────────────────────
	    User user = userRepository.findById(userId)
	        .orElseThrow(() -> new RuntimeException("User not found"));

	    // ── STEP 2: Check Cloudflare header ────────────
	    // Cloudflare sends real IP even behind proxy
	    // Log it for abuse detection
	    String userIp = request.getHeader("CF-Connecting-IP");
	    if (userIp == null) userIp = request.getRemoteAddr();
	    System.out.println("Request from IP: " + userIp);

	    // ── STEP 3: FREE TRIAL CHECK ───────────────────
	    // Block if user has used 3 or more sessions
	    // AND is not a premium user
	    if (!Boolean.TRUE.equals(user.getIsPremium())
	            && user.getSessionsUsed() >= 3) {

	        return ResponseEntity.status(403).body(Map.of(
	            "error",        "TRIAL_EXPIRED",
	            "message",      "You have used all 3 free sessions. Please upgrade to continue.",
	            "sessionsUsed", user.getSessionsUsed(),
	            "sessionsLeft", 0,
	            "isPremium",    false
	        ));
	    }
	    // ──────────────────────────────────────────────

	    // ── STEP 4: Increment session count ───────────
	    // Do this BEFORE calling Groq to prevent abuse
	    // Only increment for free users
	    if (!Boolean.TRUE.equals(user.getIsPremium())) {
	        user.setSessionsUsed(user.getSessionsUsed() + 1);
	        user.setLastSessionAt(LocalDateTime.now());
	        userRepository.save(user);
	    }

	    // ── STEP 5: Create session in DB ──────────────
	    InterviewSession session = new InterviewSession();
	    session.setUserId(userId);
	    session.setJobRole(jobRole);
	    session.setDifficulty(difficulty);
	    session.setFormat(format);
	    sessionRepository.save(session);

	    // ── STEP 6: Generate AI question ──────────────
	    String questionData;
	    if (format.equals("MCQ")) {
	        questionData = groqService.generateMCQQuestion(jobRole, difficulty);
	    } else {
	        questionData = groqService.generateQuestion(jobRole, difficulty);
	    }

	    // ── STEP 7: Return with session info ──────────
	    int sessionsLeft = Boolean.TRUE.equals(user.getIsPremium())
	        ? 999
	        : Math.max(0, 3 - user.getSessionsUsed());

	    return ResponseEntity.ok(Map.of(
	        "sessionId",    session.getId(),
	        "question",     questionData,
	        "format",       format,
	        "difficulty",   difficulty,
	        "sessionsUsed", user.getSessionsUsed(),
	        "sessionsLeft", sessionsLeft,
	        "isPremium",    user.getIsPremium()
	    ));
	}
	    
	@PostMapping("/answer")
	public ResponseEntity<?> answer(@RequestBody Map<String, Object> body) {
        try {
            Long sessionId  = Long.valueOf(body.get("sessionId").toString());
            String question = body.get("question").toString();
            String answer   = body.get("answer").toString();
            String format   = body.getOrDefault("format","QA").toString();
            String jobRole  = body.get("jobRole").toString();
            String difficulty = body.getOrDefault("difficulty","Medium").toString();
            String correctAnswer = body.getOrDefault("correctAnswer","").toString();

            // Get AI feedback based on format
            String feedback;
            if (format.equalsIgnoreCase("MCQ")) {
                feedback = groqService.evaluateMCQAnswer(question, correctAnswer, answer);
            } else {
                feedback = groqService.evaluateAnswer(question, answer);
            }

            // Save Q&A to DB
            QuestionAnswer qa = new QuestionAnswer();
            qa.setSessionId(sessionId);
            qa.setQuestion(question);
            qa.setUserAnswer(answer);
            qa.setAiFeedback(feedback);
            
            // Extract score from feedback (Format: Score: X/10)
            int score = 0;
            try {
                java.util.regex.Pattern p = java.util.regex.Pattern.compile("Score:\\s*(\\d+)");
                java.util.regex.Matcher m = p.matcher(feedback);
                if (m.find()) {
                    score = Integer.parseInt(m.group(1));
                } else if (format.equalsIgnoreCase("MCQ")) {
                    if (answer.trim().equalsIgnoreCase(correctAnswer.trim())) {
                        score = 10;
                    }
                }
            } catch (Exception e) {
                System.err.println("Error parsing score: " + e.getMessage());
            }
            qa.setScore(score);
            qaRepository.save(qa);

            // Update session overall score
            try {
                List<QuestionAnswer> allQa = qaRepository.findBySessionId(sessionId);
                double avgScore = allQa.stream()
                        .mapToInt(QuestionAnswer::getScore)
                        .average()
                        .orElse(0.0);
                
                InterviewSession session = sessionRepository.findById(sessionId).orElse(null);
                if (session != null) {
                    // Scale 0-10 to 0-100 for analytics
                    session.setScore(avgScore * 10.0);
                    sessionRepository.save(session);
                }
            } catch (Exception e) {
                System.err.println("Error updating session score: " + e.getMessage());
            }

            // Fetch previous questions for this session
            List<String> previousQuestions = qaRepository.findBySessionId(sessionId).stream()
                    .map(QuestionAnswer::getQuestion)
                    .collect(Collectors.toList());

            boolean useResume = (boolean) body.getOrDefault("useResume", false);
            String resumeProfile = null;
            if (useResume) {
                // Get userId from session
                InterviewSession s = sessionRepository.findById(sessionId).orElse(null);
                if (s != null) {
                    resumeProfile = resumeAnalysisRepository.findTopByUserIdOrderByCreatedAtDesc(s.getUserId())
                            .map(com.interviewbot.backend.model.ResumeAnalysis::getExperienceSummary)
                            .orElse(null);
                }
            }

            // Generate next question
            String nextQuestion;
            if (format.equalsIgnoreCase("MCQ")) {
                nextQuestion = groqService.generateMCQQuestion(jobRole, difficulty, previousQuestions, resumeProfile);
            } else {
                nextQuestion = groqService.generateQuestion(jobRole, difficulty, previousQuestions, resumeProfile);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("feedback", feedback);
            response.put("nextQuestion", nextQuestion);
            response.put("format", format);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to submit answer: " + e.getMessage()
            ));
        }
	}
	    
	@GetMapping("/history/{userId}")
	public ResponseEntity<?> history(@PathVariable Long userId) {
        try {
            List<InterviewSession> sessions = sessionRepository.findByUserId(userId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to fetch history: " + e.getMessage(),
                "userId", userId
            ));
        }
	}

	@GetMapping("/stats/{userId}")
	public ResponseEntity<?> stats(@PathVariable Long userId) {
        try {
            List<InterviewSession> sessions = sessionRepository.findByUserId(userId);
            int totalSessions = sessions.size();
            double avgScore = 0;
            long rolesPracticed = 0;
            
            if (totalSessions > 0) {
                avgScore = sessions.stream()
                    .mapToDouble(s -> s.getScore() != null ? s.getScore() : 0.0)
                    .average()
                    .orElse(0.0);
                rolesPracticed = sessions.stream().map(InterviewSession::getJobRole).distinct().count();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalSessions", totalSessions);
            response.put("avgScore", String.format("%.1f", avgScore));
            response.put("rolesPracticed", rolesPracticed);
            response.put("userId", userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to fetch stats: " + e.getMessage(),
                "userId", userId
            ));
        }
	}
}
