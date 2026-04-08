package com.interviewbot.backend.service;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GroqService {


    @Value("${groq.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // Generates an interview question based on job role
    public String generateQuestion(String jobRole) {
        String prompt = "Generate exactly 1 technical interview question "
                      + "for a " + jobRole + " developer role. "
                      + "Return only the question, nothing else.";
        return callGroq(prompt);
    }
    
    // Evaluates user's answer and gives feedback
    public String evaluateAnswer(String question, String answer) {
        String prompt = "Interview Question: " + question + "\n"
                      + "Candidate Answer: " + answer + "\n"
                      + "Give concise feedback in 3 lines "
                      + "and a score out of 10. "
                      + "Format: Feedback: ... Score: X/10";
        return callGroq(prompt);
    }

    // Core method that calls Groq API
    private String callGroq(String prompt) {

        String url = "https://api.groq.com/openai/v1/chat/completions";

        // Set headers — Authorization with your key
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        // Build request body
        Map<String, Object> message = Map.of(
            "role",    "user",
            "content", prompt
        );

        Map<String, Object> body = Map.of(
            "model",    "llama-3.3-70b-versatile",
            "messages", List.of(message)
        );

        // Send request
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        // Extract text from response
        var choices = (List<?>) response.getBody().get("choices");
        var first   = (Map<?, ?>) choices.get(0);
        var msg     = (Map<?, ?>) first.get("message");

        return msg.get("content").toString();
    }

}
