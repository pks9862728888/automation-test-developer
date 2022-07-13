package com.demo.automationtestdeveloper.models.dto;

import lombok.Data;

import java.util.List;

@Data
public class YamlNodeModelFieldDTO {

    private String modelClassName;
    private String nodeType;
    private String fieldName;
    private String fieldType; // Indicates the data type name of the field
    private List<String> fieldValidators;

}
