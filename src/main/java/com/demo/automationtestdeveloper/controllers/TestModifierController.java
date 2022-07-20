package com.demo.automationtestdeveloper.controllers;

import com.demo.automationtestdeveloper.models.db.YamlNodeFields;
import com.demo.automationtestdeveloper.services.db.DbService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping(path = "/app/v1/test", consumes = "application/json")
@Slf4j
public class TestModifierController extends GenericExceptionHandlerController {

    @Autowired
    private DbService dbService;

    @GetMapping("/getNodeFields/{nodeType}/{modelClassName}")
    public ResponseEntity<List<YamlNodeFields>> getNodeFieldsOfType(@PathVariable("nodeType") String nodeType,
                                                                    @PathVariable("modelClassName") String modelClassName) {
        return new ResponseEntity<>(dbService.getYamlNodeFields(nodeType, modelClassName),
                HttpStatus.OK);
    }

    @GetMapping("/getEnumValues/{enumName}")
    public ResponseEntity<List<String>> getEnumValues(@PathVariable("enumName") String enumName) {
        log.debug("/getEnumValues called...");
        return new ResponseEntity<>(dbService.getEnumValues(enumName), HttpStatus.OK);
    }

    @GetMapping("/getTradeEventEnumValues/{sourceSystemEnumName}")
    public ResponseEntity<List<String>> getTradeEventEnumValues(
            @PathVariable("sourceSystemEnumName") String sourceSystemEnumName) {
        log.debug("/getTradeEventEnumValues called...");
        return new ResponseEntity<>(dbService.getTradeEventEnumValues(sourceSystemEnumName), HttpStatus.OK);
    }

}
