package com.interviewbot.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.interviewbot.backend.model.QuestionAnswer;

public interface QARepository extends JpaRepository<QuestionAnswer, Long> {

	List<QuestionAnswer> findBySessionId(Long sessionId);
	void deleteBySessionId(Long sessionId);
}
