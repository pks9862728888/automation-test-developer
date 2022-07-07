package com.demo.automationtestdeveloper.dto;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class ErrorResponseDTO implements Serializable {

    public int statusCode;
    public String message;

}
