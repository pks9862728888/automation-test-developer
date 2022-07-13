package com.demo.automationtestdeveloper.models.db;

import com.demo.automationtestdeveloper.models.dto.YamlNodeModelFieldDTO;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import lombok.experimental.Tolerate;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "yaml_node_fields")
@Data
@Builder
public class YamlNodeFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String modelClassName;
    private String nodeType;
    private String fieldName;
    private String fieldType;
    private String fieldValidators;

    @Tolerate
    public YamlNodeFields() {
    }

    public void addFieldValidators(List<String> validators) {
        this.fieldValidators = String.join(",", validators);
    }

    public static YamlNodeFields transformToDbObject(@NonNull YamlNodeModelFieldDTO dto) {
        YamlNodeFields transformedDbObj = YamlNodeFields.builder()
                .modelClassName(dto.getModelClassName())
                .nodeType(dto.getNodeType())
                .fieldName(dto.getFieldName())
                .fieldType(dto.getFieldType())
                .build();
        transformedDbObj.addFieldValidators(dto.getFieldValidators());
        return transformedDbObj;
    }
}
