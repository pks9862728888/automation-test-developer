package com.demo.automationtestdeveloper.repositories;

import com.demo.automationtestdeveloper.models.db.EnumValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnumValuesRepository extends JpaRepository<EnumValues, Long> {

    @Query("SELECT ev.enumValue FROM EnumValues ev WHERE ev.enumName = ?1 ORDER BY ev.id")
    List<String> findEnumValuesByEnumNameOrderById(String enumName);

}
