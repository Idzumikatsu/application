package com.crm.system.exception;

import com.crm.system.dto.ErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponseDto> handleRuntimeException(RuntimeException ex) {
        ErrorResponseDto error = new ErrorResponseDto(ex.getMessage(), 400, LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNotFoundException(NotFoundException ex) {
        ErrorResponseDto error = new ErrorResponseDto(ex.getMessage(), 404, LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationException(ValidationException ex) {
        ErrorResponseDto error = new ErrorResponseDto(ex.getMessage(), 400, LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponseDto> handleAuthException(AuthException ex) {
        ErrorResponseDto error = new ErrorResponseDto(ex.getMessage(), 401, LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder message = new StringBuilder("Validation failed: ");
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        for (FieldError error : fieldErrors) {
            message.append(error.getField()).append(" - ").append(error.getDefaultMessage()).append("; ");
        }
        ErrorResponseDto error = new ErrorResponseDto(message.toString(), 400, LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}