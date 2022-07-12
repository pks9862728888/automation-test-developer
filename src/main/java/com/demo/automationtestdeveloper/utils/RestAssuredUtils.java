package com.demo.automationtestdeveloper.utils;

import com.demo.automationtestdeveloper.exceptions.RequestException;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import static io.restassured.RestAssured.given;

@Component
@Slf4j
public class RestAssuredUtils {

    public RequestSpecification getLocalRequestSpecification() {
        return given()
                .auth()
                .none()
                .relaxedHTTPSValidation();
    }

    public Response makeLocalGetRequest(@NonNull String url) throws RequestException {
        RequestSpecification requestSpecification = getLocalRequestSpecification();
        try {
            return requestSpecification
                    .contentType(ContentType.JSON)
                    .get(url);
        } catch (Exception e) {
            String msg = String.format("Exception occurred while making request to url: %s Exception: %s",
                    url, e.getMessage());
            log.error(msg);
            throw new RequestException(msg);
        }
    }
}
