package com.foureyes.moai.backend.domain.ai.internal;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ModelResolver {

    private static final String DEFAULT_MODEL = "gemini-1.5-flash";
    private static final String GEMINI_HOST = "https://generativelanguage.googleapis.com/v1beta/models/";

    @Value("${GEMINI_API_URL:}")
    private String geminiApiUrlFromEnv;

    public String resolveModel(String requested) {
        if (requested != null && !requested.isBlank()) return requested.trim();
        String fromEnv = extractModelFromEnvUrl(geminiApiUrlFromEnv);
        return (fromEnv != null) ? fromEnv : DEFAULT_MODEL;
    }

    public String buildApiUrl(String model) {
        return GEMINI_HOST + model + ":generateContent";
    }

    /** .env의 GEMINI_API_URL에서 모델명 추출 (없으면 null) */
    private String extractModelFromEnvUrl(String envUrl) {
        if (envUrl == null || envUrl.isBlank()) return null;
        int idx = envUrl.indexOf("/models/");
        if (idx < 0) return null;
        String tail = envUrl.substring(idx + "/models/".length());
        int colon = tail.indexOf(':');
        return (colon >= 0) ? tail.substring(0, colon) : tail;
    }
}
