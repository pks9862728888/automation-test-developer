package com.demo.automationtestdeveloper.services.rest;

import com.demo.automationtestdeveloper.exceptions.RequestException;
import com.demo.automationtestdeveloper.exceptions.ResponseProcessingException;
import com.demo.automationtestdeveloper.exceptions.UnmatchedStatusCodeException;
import com.demo.automationtestdeveloper.utils.RestAssuredUtils;
import io.restassured.response.Response;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class MainRepoInteractionService extends AbstractResponseHandler {

    @Value("${main-repo.api.get-enum-values}")
    private String getEnumValuesApiUrl;

    @Value("${main-repo.api.get-trade-events}")
    private String getTradeEventsApiUrl;

    @Autowired
    private RestAssuredUtils restAssuredUtils;

    public Map<String, List<String>> getAllEnumValues() throws RequestException, UnmatchedStatusCodeException, ResponseProcessingException {
        String url = getEnumValuesApiUrl;
        log.debug("Loading all enum values from url: {}", url);

        // Make get request
        Response response = restAssuredUtils.makeLocalGetRequest(url);

        // Validate response status code
        verifyResponseCode(response, HttpStatus.OK, url, HttpMethod.GET);

        // Convert to map
        return convertResponseBodyToMap(response);
    }

    public Map<String, List<String>> getEventEnumValues() throws RequestException, UnmatchedStatusCodeException, ResponseProcessingException {
        String url = getTradeEventsApiUrl;
        log.debug("Loading event enum values from url: {}", url);

        // Make get request
        Response response = restAssuredUtils.makeLocalGetRequest(url);

        // Validate response status code
        verifyResponseCode(response, HttpStatus.OK, url, HttpMethod.GET);

        // Convert to map
        return convertResponseBodyToMap(response);
    }
}
