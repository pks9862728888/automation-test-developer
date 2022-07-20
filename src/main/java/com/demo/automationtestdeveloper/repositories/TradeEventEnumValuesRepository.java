package com.demo.automationtestdeveloper.repositories;

import com.demo.automationtestdeveloper.models.db.TradeEventEnumValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeEventEnumValuesRepository extends JpaRepository<TradeEventEnumValues, Long> {

    @Query("SELECT te.eventName FROM TradeEventEnumValues te WHERE te.sourceSystemEnumName = ?1 ORDER BY te.id")
    List<String> findEventNameBySourceSystemEnumName(String sourceSystemEnumName);

}
