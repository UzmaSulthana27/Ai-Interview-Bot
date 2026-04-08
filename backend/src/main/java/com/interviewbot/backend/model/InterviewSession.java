package com.interviewbot.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Generated;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private Long userId;
	    private String jobRole;
	    private Double score = 0.0;

	    private LocalDateTime startedAt = LocalDateTime.now();

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public Long getUserId() {
			return userId;
		}

		public void setUserId(Long userId) {
			this.userId = userId;
		}

		public String getJobRole() {
			return jobRole;
		}

		public void setJobRole(String jobRole) {
			this.jobRole = jobRole;
		}

		public Double getScore() {
			return score;
		}

		public void setScore(Double score) {
			this.score = score;
		}

		public LocalDateTime getStartedAt() {
			return startedAt;
		}

		public void setStartedAt(LocalDateTime startedAt) {
			this.startedAt = startedAt;
		}

	    
}
