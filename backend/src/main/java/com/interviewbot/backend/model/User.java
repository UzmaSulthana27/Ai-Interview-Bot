package com.interviewbot.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data 
public class User {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    private String name;
	    private String email;
	    private String password;

	    @Column(length = 2000)
	    private String bio;

	    @Column(name = "sessions_used")
	    private Integer sessionsUsed = 0;

	    @Column(name = "is_premium")
	    private Boolean isPremium = false;

	    @Column(name = "last_session_at")
	    private LocalDateTime lastSessionAt;

	    public Integer getSessionsUsed() {
	        return sessionsUsed == null ? 0 : sessionsUsed;
	    }

	    public void setSessionsUsed(Integer sessionsUsed) {
	        this.sessionsUsed = sessionsUsed == null ? 0 : sessionsUsed;
	    }

	    public Boolean getIsPremium() {
	        return isPremium == null ? false : isPremium;
	    }

	    public void setIsPremium(Boolean isPremium) {
	        this.isPremium = isPremium == null ? false : isPremium;
	    }

	    public LocalDateTime getLastSessionAt() {
	        return lastSessionAt;
	    }

	    public void setLastSessionAt(LocalDateTime lastSessionAt) {
	        this.lastSessionAt = lastSessionAt;
	    }
}
