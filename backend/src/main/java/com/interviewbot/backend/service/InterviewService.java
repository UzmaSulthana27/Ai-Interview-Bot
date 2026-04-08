package com.interviewbot.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.interviewbot.backend.respository.QARepository;
import com.interviewbot.backend.respository.SessionRepository;

import jakarta.transaction.Transactional;

@Service
public class InterviewService {


    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private QARepository qaRepository;

    @Transactional  // ensures both deletes happen together or not at all
    public String deleteSession(Long sessionId, Long userId) {

        // Step 1 — Check if session exists AND belongs to this user
        var session = sessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new RuntimeException(
                "Session not found or you don't have permission to delete it."
            ));
        
        // Step 2 — Delete all Q&A rows for this session first
        // (must do this first because of foreign key constraint)
        qaRepository.deleteBySessionId(sessionId);

        // Step 3 — Now delete the session itself
        sessionRepository.delete(session);

        return "Session " + sessionId + " deleted successfully.";
    }
}
