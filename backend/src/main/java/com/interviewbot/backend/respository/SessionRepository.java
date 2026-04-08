package com.interviewbot.backend.respository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.interviewbot.backend.model.InterviewSession;

public interface SessionRepository extends JpaRepository<InterviewSession, Long> {

	 List<InterviewSession> findByUserId(Long userId);
	 Optional<InterviewSession> findByIdAndUserId(Long id, Long userId);
}
