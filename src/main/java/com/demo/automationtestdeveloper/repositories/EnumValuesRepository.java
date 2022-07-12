package com.demo.automationtestdeveloper.repositories;

import com.demo.automationtestdeveloper.models.db.EnumValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnumValuesRepository extends JpaRepository<EnumValues, Long> {
}
