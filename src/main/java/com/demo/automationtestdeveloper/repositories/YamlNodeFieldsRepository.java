package com.demo.automationtestdeveloper.repositories;

import com.demo.automationtestdeveloper.models.db.YamlNodeFields;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YamlNodeFieldsRepository extends JpaRepository<YamlNodeFields, Long> {
}
