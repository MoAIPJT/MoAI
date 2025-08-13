package com.foureyes.moai.backend.domain.ai.internal;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class AiClientRouter {

    private final ModelResolver modelResolver;
    private final GeminiApiClient geminiApiClient;
    private final OpenAiApiClient openAiApiClient;

    /** requestedModelKey에 따라 적절한 백엔드 호출 */
    public Mono<String> generateJsonArray(String requestedModelKey, String prompt) {
        ModelOption option = modelResolver.resolveOption(requestedModelKey);

        if (option.getProvider() == AiProvider.GEMINI) {
            String url = modelResolver.buildGeminiApiUrl(option.getModelId());
            return geminiApiClient.generateContent(url, prompt);
        } else {
            String url = modelResolver.openAiCompletionsUrl();
            return openAiApiClient.chatCompletions(url, option.getModelId(), prompt);
        }
    }
}
