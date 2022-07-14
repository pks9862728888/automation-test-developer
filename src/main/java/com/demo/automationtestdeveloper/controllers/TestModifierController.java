package com.demo.automationtestdeveloper.controllers;

import com.demo.automationtestdeveloper.models.db.YamlNodeFields;
import com.demo.automationtestdeveloper.services.db.DbService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping(path = "/app/v1/test", consumes = "application/json")
public class TestModifierController extends GenericExceptionHandlerController {

    @Autowired
    private DbService dbService;

    @GetMapping("/getNodeFields/{nodeType}/{modelClassName}")
    public ResponseEntity<List<YamlNodeFields>> getNodeFieldsOfType(@NonNull @PathVariable("nodeType") String nodeType,
                                                                    @NonNull @PathVariable("modelClassName") String modelClassName) {
        return new ResponseEntity<>(dbService.getYamlNodeFields(nodeType, modelClassName),
                HttpStatus.OK);
    }

}
