package com.demo.automationtestdeveloper.services.db;

import com.demo.automationtestdeveloper.exceptions.RequestException;
import com.demo.automationtestdeveloper.exceptions.ResponseProcessingException;
import com.demo.automationtestdeveloper.exceptions.UnmatchedStatusCodeException;
import com.demo.automationtestdeveloper.models.db.EnumValues;
import com.demo.automationtestdeveloper.models.db.TradeEventEnumValues;
import com.demo.automationtestdeveloper.repositories.EnumValuesRepository;
import com.demo.automationtestdeveloper.repositories.TradeEventEnumValuesRepository;
import com.demo.automationtestdeveloper.services.rest.MainRepoInteractionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class DbService {

    @Autowired
    private MainRepoInteractionService mainRepoInteractionService;

    @Autowired
    private EnumValuesRepository enumValuesRepository;

    @Autowired
    private TradeEventEnumValuesRepository tradeEventEnumValuesRepository;

    public void initEnumValuesInDb() throws UnmatchedStatusCodeException, RequestException, ResponseProcessingException {
        // Get all enum values
        Map<String, List<String>> allEnumValues = mainRepoInteractionService.getAllEnumValues();
        saveAllEnumValuesInDbTable(allEnumValues);

        // Get all enum values
        Map<String, List<String>> eventEnumValues = mainRepoInteractionService.getEventEnumValues();
        saveTradeEventEnumValuesInDbTable(allEnumValues);
    }

    public void saveAllEnumValuesInDbTable(Map<String, List<String>> allEnumValues) {
        log.debug("Saving field enum values to db...");
        for (String enumName: allEnumValues.keySet()) {
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
        for (String sourceSystemEnum: eventEnumValues.keySet()) {
            eventEnumValues.get(sourceSystemEnum).parallelStream()
                    .map(event -> TradeEventEnumValues.builder()
                            .sourceSystemEnumName(sourceSystemEnum)
                            .eventName(event)
                            .build())
                    .forEach(tradeEventEnumValuesRepository::saveAndFlush);
        }
        log.debug("Saving trade event enum values to repository complete!");
    }
}
