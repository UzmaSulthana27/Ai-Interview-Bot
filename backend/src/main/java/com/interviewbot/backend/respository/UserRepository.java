package com.interviewbot.backend.respository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.interviewbot.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	 Optional<User> findByEmail(String email); 

}
