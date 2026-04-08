package com.interviewbot.backend.controller;

import java.util.List;

import java.util.Map;

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

	    // 1. React calls this to start a new interview session
	    @PostMapping("/start")
	    public ResponseEntity<?> start(@RequestParam String jobRole,
	                                   @RequestParam Long userId) {
	        // Create a new session in DB
	        InterviewSession session = new InterviewSession();
	        session.setUserId(userId);
	        session.setJobRole(jobRole);
	        sessionRepository.save(session);

	        // Ask Groq for first question
	        String question = groqService.generateQuestion(jobRole);

	        return ResponseEntity.ok(Map.of(
	            "sessionId", session.getId(),
	            "question",  question
	        ));
	    }
	    
	    // 2. React calls this when user submits their answer
	    @PostMapping("/answer")
	    public ResponseEntity<?> answer(@RequestBody Map<String, Object> body) {
	        Long sessionId  = Long.valueOf(body.get("sessionId").toString());
	        String question = body.get("question").toString();
	        String answer   = body.get("answer").toString();

	        // Get AI feedback
	        String feedback =groqService.evaluateAnswer(question, answer);

	        // Save Q&A to database
	        QuestionAnswer qa = new QuestionAnswer();
	        qa.setSessionId(sessionId);
	        qa.setQuestion(question);
	        qa.setUserAnswer(answer);
	        qa.setAiFeedback(feedback);
	        qaRepository.save(qa);

	        // Get next question
	        InterviewSession session = sessionRepository.findById(sessionId).get();
	        String nextQuestion = groqService.generateQuestion(session.getJobRole());

	        return ResponseEntity.ok(Map.of(
	            "feedback",     feedback,
	            "nextQuestion", nextQuestion
	        ));
	    }
	    
	    // 3. React calls this to show past sessions
	    @GetMapping("/history/{userId}")
	    public ResponseEntity<?> history(@PathVariable Long userId) {
	        List<InterviewSession> sessions = sessionRepository.findByUserId(userId);
	        return ResponseEntity.ok(sessions);
	    }
}
