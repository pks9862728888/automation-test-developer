package com.demo.automationtestdeveloper.repositories;

import com.demo.automationtestdeveloper.models.db.TradeEventEnumValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TradeEventEnumValuesRepository extends JpaRepository<TradeEventEnumValues, Long> {
}
