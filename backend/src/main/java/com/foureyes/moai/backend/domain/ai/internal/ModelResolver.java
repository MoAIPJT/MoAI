package com.foureyes.moai.backend.domain.ai.internal;

import org.springframework.stereotype.Component;

@Component
public class ModelResolver {

    private static final String DEFAULT_MODEL = "gemini-2.0-flash-lite";

    private static final String GMS_PROXY_BASE = "https://gms.ssafy.io/gmsapi/";
    // ✅ 프로토콜 제거한 "호스트/경로"만 유지
    private static final String GEMINI_HOST_PATH = "generativelanguage.googleapis.com/v1beta/models/";
    private static final String OPENAI_PATH = "api.openai.com/v1/chat/completions";

    public ModelOption resolveOption(String requested) {
        return (requested != null && !requested.isBlank())
                ? ModelOption.fromKey(requested.trim())
                : ModelOption.fromKey(DEFAULT_MODEL);
    }

    public String buildGeminiApiUrl(String geminiModelId) {
        // 결과: https://gms.ssafy.io/gmsapi/generativelanguage.googleapis.com/v1beta/models/<model>:generateContent
        return GMS_PROXY_BASE + GEMINI_HOST_PATH + geminiModelId + ":generateContent";
    }

    public String openAiCompletionsUrl() {
        // 결과: https://gms.ssafy.io/gmsapi/api.openai.com/v1/chat/completions
        return GMS_PROXY_BASE + OPENAI_PATH;
    }
}
