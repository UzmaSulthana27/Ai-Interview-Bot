package com.interviewbot.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.interviewbot.backend.model.User;
import com.interviewbot.backend.respository.UserRepository;

@Service
public class AuthService {
	  @Autowired
	    private UserRepository userRepository;

	    @Autowired
	    private BCryptPasswordEncoder passwordEncoder;

	    public User register(String name, String email, String password) {

	        // Check if email already exists
	        Optional<User> existing = userRepository.findByEmail(email);
	        if (existing.isPresent()) {
	            throw new RuntimeException("Email already registered!");
	        }
	        User user = new User();
	        user.setName(name);
	        user.setEmail(email);
	        user.setPassword(passwordEncoder.encode(password)); // encrypts password
	        return userRepository.save(user);
	    }

	    public User login(String email, String password) {
	    	
	    	 // Debug prints — check Eclipse console
	        System.out.println("=== LOGIN ATTEMPT ===");
	        System.out.println("Email: " + email);

	        // Find user by email
	        User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("No account found with this email!"));

	        System.out.println("User found: " + user.getName());
	        System.out.println("Stored hash: " + user.getPassword());

	        // Compare entered password with stored encrypted password
	        boolean matches = passwordEncoder.matches(password, user.getPassword());
	        System.out.println("Password matches: " + matches);

	        if (!matches) {
	            throw new RuntimeException("Incorrect password!");
	        }

	        return user;
	    }
	    
}
