package com.demo.automationtestdeveloper.models.db;

import lombok.Builder;
import lombok.Data;
import lombok.experimental.Tolerate;

import javax.persistence.*;

@Entity
@Table(name = "trade_event_enum_values")
@Data
@Builder
public class TradeEventEnumValues {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String eventName;
    private String sourceSystemEnumName;

    @Tolerate
    public TradeEventEnumValues() {
    }
}
