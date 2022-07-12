package com.demo.automationtestdeveloper.controllers;

import com.demo.automationtestdeveloper.models.dto.ErrorResponseDTO;
import com.demo.automationtestdeveloper.exceptions.CommandRunnerException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GenericExceptionHandlerController {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleCommandRunnerException(Exception exception) {
        return new ResponseEntity<>(ErrorResponseDTO.builder()
                .message(exception.getMessage())
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .exceptionType(exception.getClass().getSimpleName())
                .build(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
