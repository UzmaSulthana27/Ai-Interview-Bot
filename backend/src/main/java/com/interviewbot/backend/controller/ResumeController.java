package com.interviewbot.backend.controller;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewbot.backend.model.ResumeAnalysis;
import com.interviewbot.backend.repository.ResumeAnalysisRepository;
import com.interviewbot.backend.service.GroqService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final GroqService groqService;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file, @RequestParam("userId") Long userId) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please upload a file"));
        }

        try {
            String extractedText = "";
            if (file.getContentType() != null && file.getContentType().equals("application/pdf")) {
                try (PDDocument document = Loader.loadPDF(file.getBytes())) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    extractedText = stripper.getText(document);
                }
            } else {
                // For non-PDF files, we might need other libraries like Apache POI
                // For now, let's just use a simple string if it's text, or error
                extractedText = new String(file.getBytes());
            }

            if (extractedText.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Could not extract text from the resume."));
            }

            // Analyze with Groq
            String analysisJson = groqService.analyzeResume(extractedText);
            
            // Parse JSON to save to DB
            JsonNode root = objectMapper.readTree(analysisJson);
            
            ResumeAnalysis analysis = new ResumeAnalysis();
            analysis.setUserId(userId);
            analysis.setRawJson(analysisJson);
            analysis.setSkills(root.path("skills").toString());
            analysis.setExperienceSummary(root.path("experienceSummary").asText());
            analysis.setSuggestedTopics(root.path("suggestedTopics").toString());
            
            resumeAnalysisRepository.save(analysis);

            return ResponseEntity.ok(root);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error processing file: " + e.getMessage()));
        }
    }

    @GetMapping("/latest/{userId}")
    public ResponseEntity<?> getLatestAnalysis(@PathVariable Long userId) {
        Optional<ResumeAnalysis> analysis = resumeAnalysisRepository.findTopByUserIdOrderByCreatedAtDesc(userId);
        if (analysis.isPresent()) {
            try {
                return ResponseEntity.ok(objectMapper.readTree(analysis.get().getRawJson()));
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
}
