package com.demo.automationtestdeveloper.services.db;

import com.demo.automationtestdeveloper.exceptions.RequestException;
import com.demo.automationtestdeveloper.exceptions.ResponseProcessingException;
import com.demo.automationtestdeveloper.exceptions.UnmatchedStatusCodeException;
import com.demo.automationtestdeveloper.models.db.EnumValues;
import com.demo.automationtestdeveloper.models.db.TradeEventEnumValues;
import com.demo.automationtestdeveloper.models.db.YamlNodeFields;
import com.demo.automationtestdeveloper.models.dto.YamlNodeModelFieldDTO;
import com.demo.automationtestdeveloper.repositories.EnumValuesRepository;
import com.demo.automationtestdeveloper.repositories.TradeEventEnumValuesRepository;
import com.demo.automationtestdeveloper.repositories.YamlNodeFieldsRepository;
import com.demo.automationtestdeveloper.services.rest.MainRepoInteractionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DbService {

    @Autowired
    private MainRepoInteractionService mainRepoInteractionService;

    @Autowired
    private EnumValuesRepository enumValuesRepository;

    @Autowired
    private TradeEventEnumValuesRepository tradeEventEnumValuesRepository;

    @Autowired
    private YamlNodeFieldsRepository yamlNodeFieldsRepository;

    public void initEnumValuesInDb() throws UnmatchedStatusCodeException, RequestException, ResponseProcessingException {
        // Get all enum values
        Map<String, List<String>> allEnumValues = mainRepoInteractionService.getAllEnumValues();
        saveAllEnumValuesInDbTable(allEnumValues);

        // Get all enum values
        Map<String, List<String>> eventEnumValues = mainRepoInteractionService.getEventEnumValues();
        saveTradeEventEnumValuesInDbTable(allEnumValues);

        // Get all yaml node fields
        List<YamlNodeModelFieldDTO> yamlNodeModelFields = mainRepoInteractionService.getYamlNodeModelFields();
        saveYamlNodeModelFieldsInDbTable(yamlNodeModelFields);
    }

    public void saveAllEnumValuesInDbTable(Map<String, List<String>> allEnumValues) {
        log.debug("Saving field enum values to db...");
        for (String enumName : allEnumValues.keySet()) {
            allEnumValues.get(enumName).parallelStream()
                    .map(enumValue -> EnumValues.builder()
                            .enumName(enumName)
                            .enumValue(enumValue)
                            .build())
                    .forEach(enumValuesRepository::saveAndFlush);
        }
        log.debug("Saving field enum values to db complete!");
    }

    public void saveTradeEventEnumValuesInDbTable(Map<String, List<String>> eventEnumValues) {
        log.debug("Saving trade event enum values to db...");
        for (String sourceSystemEnum : eventEnumValues.keySet()) {
            eventEnumValues.get(sourceSystemEnum).parallelStream()
                    .map(event -> TradeEventEnumValues.builder()
                            .sourceSystemEnumName(sourceSystemEnum)
                            .eventName(event)
                            .build())
                    .forEach(tradeEventEnumValuesRepository::saveAndFlush);
        }
        log.debug("Saving trade event enum values to repository complete!");
    }

    private void saveYamlNodeModelFieldsInDbTable(List<YamlNodeModelFieldDTO> yamlNodeModelFields) {
        log.debug("Saving yaml node fields to db...");
        yamlNodeFieldsRepository.saveAllAndFlush(yamlNodeModelFields.parallelStream()
                .map(YamlNodeFields::transformToDbObject)
                .collect(Collectors.toList()));
        log.debug("Saving yaml node fields to db complete!");
    }

    public List<YamlNodeFields> getYamlNodeFields(String nodeType, String modelClassName) {
        return yamlNodeFieldsRepository.findByNodeTypeAndModelClassNameOrderById(nodeType, modelClassName);
    }
}
