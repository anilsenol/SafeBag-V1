package com.example.safebag.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// https://www.baeldung.com/java-global-exception-handler
// https://medium.com/@aedemirsen/spring-boot-global-exception-handler-842d7143cf2a
// https://stackoverflow.com/questions/77347532/globalexceptionhandler-with-exceptionhandler-or-responseentity-for-rest-answer

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity
                .badRequest()
                .body(ex.getMessage()); 
    }
}
