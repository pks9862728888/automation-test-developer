package com.demo.automationtestdeveloper.repositories;

import com.demo.automationtestdeveloper.models.db.YamlNodeFields;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YamlNodeFieldsRepository extends JpaRepository<YamlNodeFields, Long> {

    List<YamlNodeFields> findByNodeTypeAndModelClassNameOrderById(
            @NonNull String nodeType, @NonNull String modelClassName);

}
