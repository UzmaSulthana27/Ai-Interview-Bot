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

    // For Q/A format:
    public String generateQuestion(String jobRole, String difficulty, List<String> previousQuestions, String resumeProfile) {
        String avoidText = "";
        if (previousQuestions != null && !previousQuestions.isEmpty()) {
            avoidText = " To avoid repetition, DO NOT ask these questions: " + String.join(", ", previousQuestions);
        }

        String profileText = "";
        if (resumeProfile != null && !resumeProfile.isEmpty()) {
            profileText = " The candidate has the following resume profile: " + resumeProfile + ". Personalize the question based on their experience.";
        }

        String prompt = 
            "Generate exactly 1 technical interview question "
          + "for a " + jobRole + " role. "
          + "Difficulty level: " + difficulty + "."
          + profileText
          + avoidText
          + " Return ONLY the question. Nothing else.";
        return callGroq(prompt);
    }

    // For MCQ format:
    public String generateMCQQuestion(String jobRole, String difficulty, List<String> previousQuestions, String resumeProfile) {
        String avoidText = "";
        if (previousQuestions != null && !previousQuestions.isEmpty()) {
            avoidText = " To avoid repetition, DO NOT ask these questions: " + String.join(", ", previousQuestions);
        }

        String profileText = "";
        if (resumeProfile != null && !resumeProfile.isEmpty()) {
            profileText = " The candidate has the following resume profile: " + resumeProfile + ". Personalize the question based on their experience.";
        }

        String prompt = 
            "Generate exactly 1 multiple choice interview "
          + "question for a " + jobRole + " role. "
          + "Difficulty: " + difficulty + "."
          + profileText
          + avoidText
          + " Format your response EXACTLY like this:\n"
          + "QUESTION: [your question here]\n"
          + "A) [option A]\n"
          + "B) [option B]\n"
          + "C) [option C]\n"
          + "D) [option D]\n"
          + "ANSWER: [correct letter]\n"
          + "EXPLANATION: [brief explanation]\n"
          + "Return ONLY this format. Nothing else.";
        return callGroq(prompt);
    }

    // Evaluates user's answer and gives feedback for Q/A
    public String evaluateAnswer(String question, String answer) {
        String prompt = "Interview Question: " + question + "\n"
                      + "Candidate Answer: " + answer + "\n"
                      + "Give concise feedback in 3 lines "
                      + "and a score out of 10. "
                      + "Format: Feedback: ... Score: X/10";
        return callGroq(prompt);
    }

    // Analyzes resume text and returns structured data
    public String analyzeResume(String text) {
        String prompt = 
            "Analyze the following resume text and provide a structured JSON response with exactly these fields: "
          + "skills (a list of top 6 technical skills), "
          + "experienceSummary (a 2-3 sentence summary of experience), "
          + "suggestedTopics (a list of 4 specific technical interview topics based on their projects/experience). "
          + "Return ONLY the raw JSON. Nothing else.\n\n"
          + "Resume Text:\n" + text;
        return stripMarkdownCodeFence(callGroq(prompt));
    }

    /** LLMs often wrap JSON in ```json ... ```; Jackson needs bare JSON. */
    private String stripMarkdownCodeFence(String raw) {
        if (raw == null) {
            return "{}";
        }
        String t = raw.trim();
        if (t.startsWith("```")) {
            int firstNl = t.indexOf('\n');
            if (firstNl != -1) {
                t = t.substring(firstNl + 1);
            }
            int fence = t.lastIndexOf("```");
            if (fence != -1) {
                t = t.substring(0, fence).trim();
            }
        }
        return t;
    }

    public String evaluateMCQAnswer(String question, String correctAnswer, String userAnswer) {
        boolean isCorrect = userAnswer.trim().equalsIgnoreCase(correctAnswer.trim());
        String prompt =
            "Interview Question: " + question + "\n"
          + "Correct Answer: " + correctAnswer + "\n"
          + "User Selected: " + userAnswer + "\n"
          + "Give a brief explanation of why "
          + correctAnswer + " is correct in 2-3 lines. "
          + "Format: EXPLANATION: [your explanation]";
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
