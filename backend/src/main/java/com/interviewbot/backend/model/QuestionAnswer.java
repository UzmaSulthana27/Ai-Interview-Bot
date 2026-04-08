package com.interviewbot.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "question_answers")
public class QuestionAnswer {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private Long sessionId;

	    @Column(columnDefinition = "TEXT")
	    private String question;

	    @Column(columnDefinition = "TEXT")
	    private String userAnswer;

	    @Column(columnDefinition = "TEXT")
	    private String aiFeedback;

	    private Integer score = 0;

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public Long getSessionId() {
			return sessionId;
		}

		public void setSessionId(Long sessionId) {
			this.sessionId = sessionId;
		}

		public String getQuestion() {
			return question;
		}

		public void setQuestion(String question) {
			this.question = question;
		}

		public String getUserAnswer() {
			return userAnswer;
		}

		public void setUserAnswer(String userAnswer) {
			this.userAnswer = userAnswer;
		}

		public String getAiFeedback() {
			return aiFeedback;
		}

		public void setAiFeedback(String aiFeedback) {
			this.aiFeedback = aiFeedback;
		}

		public Integer getScore() {
			return score;
		}

		public void setScore(Integer score) {
			this.score = score;
		}
	    
	    
}
