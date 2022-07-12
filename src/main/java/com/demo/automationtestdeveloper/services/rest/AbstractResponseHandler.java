package com.demo.automationtestdeveloper.services.rest;

import com.demo.automationtestdeveloper.exceptions.RequestException;
import com.demo.automationtestdeveloper.exceptions.ResponseProcessingException;
import com.demo.automationtestdeveloper.exceptions.UnmatchedStatusCodeException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.response.Response;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@Slf4j
public abstract class AbstractResponseHandler {

    protected void verifyResponseCode(@NonNull Response response, @NonNull HttpStatus expectedHttpStatus,
                                      @NonNull String url, @NonNull HttpMethod httpMethod) throws UnmatchedStatusCodeException {
        if (response.getStatusCode() != expectedHttpStatus.value()) {
            String msg = String.format("%s request to url: %s returned status code: %s but expected status code was: %s Response data: %s",
                    httpMethod.name(), url, response.getStatusCode(), expectedHttpStatus, response.getBody());
            log.error(msg);
            throw new UnmatchedStatusCodeException(msg);
        }
    }

    protected Map<String, List<String>> convertResponseBodyToMap(@NonNull Response response) throws ResponseProcessingException {
        String responseBody = response.getBody().asString();

        try {
            return new ObjectMapper().readValue(responseBody, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            String msg = String.format("Exception occurred while processing response body: %s to map, Exception: %s",
                    response.getBody(), e.getMessage());
            log.error(msg);
            throw new ResponseProcessingException(msg);
        }
    }

}
