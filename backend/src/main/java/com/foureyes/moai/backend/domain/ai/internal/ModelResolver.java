package com.foureyes.moai.backend.domain.ai.internal;

import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class ModelResolver {

    private static final String GMS_PROXY_BASE = "https://gms.ssafy.io/gmsapi/";
    private static final String GEMINI_HOST_PATH = "generativelanguage.googleapis.com/v1beta/models/";
    private static final String OPENAI_PATH = "api.openai.com/v1/chat/completions";

    /**
     * 프론트에서 넘어온 modelType이 없거나 잘못되면 즉시 400.
     * (기존처럼 기본값 사용하지 않음)
     */
    public ModelOption resolveOption(String requested) {
        if (requested == null || requested.isBlank()) {
            throw new CustomException(ErrorCode.INVALID_REQUEST); // 필요하면 INVALID_MODEL_TYPE로 분리
        }
        try {
            return ModelOption.fromKey(requested.trim()); // enum명 또는 실제 modelId 허용
        } catch (IllegalArgumentException ex) {
            // fromKey에서 못 찾으면 400
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }
    }

    // 제미니 generateContent (GMS 프록시 경유)
    public String buildGeminiApiUrl(String geminiModelId) {
        return GMS_PROXY_BASE + GEMINI_HOST_PATH + geminiModelId + ":generateContent";
    }

    // 오픈AI chat.completions (GMS 프록시 경유)
    public String openAiCompletionsUrl() {
        return GMS_PROXY_BASE + OPENAI_PATH;
    }
}
