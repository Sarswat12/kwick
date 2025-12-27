package com.kwick.backend.exception;

import com.kwick.backend.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex) {
        ApiResponse<Object> resp = new ApiResponse<>();
        resp.setOk(false);
        resp.setBody(null);
        resp.setError(ex.getMessage());
        return ResponseEntity.badRequest().body(resp);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        ApiResponse<Object> resp = new ApiResponse<>();
        resp.setOk(false);
        resp.setBody(null);
        resp.setError("Validation failed: " + errors);
        return ResponseEntity.badRequest().body(resp);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex) {
        ApiResponse<Object> resp = new ApiResponse<>();
        resp.setOk(false);
        resp.setBody(null);
        resp.setError(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<ApiResponse<Object>> handleUnauthorized(UnauthorizedException ex) {
        ApiResponse<Object> resp = new ApiResponse<>();
        resp.setOk(false);
        resp.setBody(null);
        resp.setError(ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<ApiResponse<Object>> handleForbidden(ForbiddenException ex) {
        ApiResponse<Object> resp = new ApiResponse<>();
        resp.setOk(false);
        resp.setBody(null);
        resp.setError(ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(resp);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponse<Object>> handleGeneral(Exception ex) {
        ApiResponse<Object> resp = new ApiResponse<>();
        resp.setOk(false);
        resp.setBody(null);
        resp.setError("Internal server error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resp);
    }
}
