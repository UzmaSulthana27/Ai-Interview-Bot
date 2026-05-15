package com.interviewbot.backend.config;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().body(Map.of(
            "error", "Internal Server Error",
            "message", e.getMessage() != null ? e.getMessage() : "Unknown error",
            "type", e.getClass().getName()
        ));
    }
}
