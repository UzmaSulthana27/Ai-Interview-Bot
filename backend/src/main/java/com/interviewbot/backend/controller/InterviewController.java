package com.interviewbot.backend.controller;

import java.util.List;

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
import com.interviewbot.backend.respository.QARepository;
import com.interviewbot.backend.respository.SessionRepository;
import com.interviewbot.backend.service.GroqService;
import com.interviewbot.backend.service.InterviewService;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {
	
	@Autowired
	private InterviewService interviewService;

	   @Autowired private GroqService groqService;
	    @Autowired private SessionRepository sessionRepository;
	    @Autowired private QARepository qaRepository;
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
	            @RequestParam(defaultValue = "false") boolean useResume) {

	        // Save session
	        InterviewSession session = new InterviewSession();
	        session.setUserId(userId);
	        session.setJobRole(jobRole);
	        session.setDifficulty(difficulty);
	        session.setFormat(format);
	        sessionRepository.save(session);

	        String resumeProfile = null;
	        if (useResume) {
	            resumeProfile = resumeAnalysisRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
	                    .map(com.interviewbot.backend.model.ResumeAnalysis::getExperienceSummary)
	                    .orElse(null);
	        }

	        // Generate question based on format
	        String questionData;
	        if (format.equals("MCQ")) {
	            questionData = groqService.generateMCQQuestion(jobRole, difficulty, List.of(), resumeProfile);
	        } else {
	            questionData = groqService.generateQuestion(jobRole, difficulty, List.of(), resumeProfile);
	        }

	        return ResponseEntity.ok(Map.of(
	            "sessionId",    session.getId(),
	            "question",     questionData,
	            "format",       format,
	            "difficulty",   difficulty
	        ));
	    }
	    
	    @PostMapping("/answer")
	    public ResponseEntity<?> answer(@RequestBody Map<String, Object> body) {
	        Long sessionId  = Long.valueOf(body.get("sessionId").toString());
	        String question = body.get("question").toString();
	        String answer   = body.get("answer").toString();
	        String format   = body.getOrDefault("format","QA").toString();
	        String jobRole  = body.get("jobRole").toString();
	        String difficulty = body.getOrDefault("difficulty","Medium").toString();
	        String correctAnswer = body.getOrDefault("correctAnswer","").toString();

	        // Get AI feedback based on format
	        String feedback;
	        if (format.equals("MCQ")) {
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
	        qaRepository.save(qa);

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
	        if (format.equals("MCQ")) {
	            nextQuestion = groqService.generateMCQQuestion(jobRole, difficulty, previousQuestions, resumeProfile);
	        } else {
	            nextQuestion = groqService.generateQuestion(jobRole, difficulty, previousQuestions, resumeProfile);
	        }

	        return ResponseEntity.ok(Map.of(
	            "feedback",     feedback,
	            "nextQuestion", nextQuestion,
	            "format",       format
	        ));
	    }
	    
	    // 3. React calls this to show past sessions
	    @GetMapping("/history/{userId}")
	    public ResponseEntity<?> history(@PathVariable Long userId) {
	        List<InterviewSession> sessions = sessionRepository.findByUserId(userId);
	        return ResponseEntity.ok(sessions);
	    }

	    @GetMapping("/stats/{userId}")
	    public ResponseEntity<?> stats(@PathVariable Long userId) {
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
	        
	        return ResponseEntity.ok(Map.of(
	            "totalSessions", totalSessions,
	            "avgScore", String.format("%.1f", avgScore),
	            "rolesPracticed", rolesPracticed
	        ));
	    }
}
