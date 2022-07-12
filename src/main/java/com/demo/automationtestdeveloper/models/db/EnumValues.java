package com.demo.automationtestdeveloper.models.db;

import lombok.Builder;
import lombok.Data;
import lombok.experimental.Tolerate;

import javax.persistence.*;

@Entity
@Table(name = "enum_values")
@Data
@Builder
public class EnumValues {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String enumName;
    private String enumValue;

    @Tolerate
    public EnumValues() {
    }
}
