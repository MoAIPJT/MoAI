// domain/study/session/service/OpenViduAdminClient.java
package com.foureyes.moai.backend.domain.study.session.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class OpenViduAdminClient {

    @Value("${openvidu.url}")     private String baseUrl;   // e.g. https://openvidu.example
    @Value("${openvidu.secret}")  private String secret;

    private RestClient client() {
        return RestClient.builder()
            .baseUrl(baseUrl)
            .defaultHeader(HttpHeaders.AUTHORIZATION, basicAuth("OPENVIDUAPP", secret))
            .build();
    }

    public void createSessionIfAbsent(String customSessionId) {
        // 같은 customSessionId로 여러 번 호출해도 동일 세션 재사용됨(idempotent)
        client().post()
            .uri("/openvidu/api/sessions")
            .contentType(MediaType.APPLICATION_JSON)
            .body(Map.of("customSessionId", customSessionId))
            .retrieve()
            .toBodilessEntity();
    }

    private String basicAuth(String user, String pass) {
        return "Basic " + java.util.Base64.getEncoder().encodeToString((user + ":" + pass).getBytes());
    }
}
