package com.foureyes.moai.backend.domain.ai.service;

import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class AiServiceImpl implements AiService {

    private final WebClient webClient;
    private final String geminiApiKey;
    private final ObjectMapper objectMapper;

    public AiServiceImpl(WebClient.Builder webClientBuilder,
                         @Value("${gemini.api.url}") String geminiApiUrl,
                         @Value("${gemini.api.key}") String geminiApiKey) {
        this.webClient = webClientBuilder.baseUrl(geminiApiUrl).build();
        this.geminiApiKey = geminiApiKey;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * PDF 파일을 받아 요약 결과를 반환하는 메인 로직 (AiService 인터페이스의 구현체)
     */
    @Override
    public List<SummaryDto> summarizePdf(MultipartFile pdfFile) throws IOException {
        String textForPrompt = extractTextFromPdf(pdfFile);
        String prompt = createPrompt(textForPrompt);

        // API 호출 및 파싱 과정에서 발생할 수 있는 다른 예외들을 처리합니다.
        try {
            String summaryJson = callGeminiApi(prompt).block();
            return parseSummaryResponse(summaryJson);
        } catch (Exception e) {
            // API 호출 실패 또는 다른 런타임 예외 발생 시 처리
            throw new RuntimeException("AI 요약 생성 중 오류가 발생했습니다.", e);
        }
    }


    public String extractTextFromPdf(MultipartFile file) throws IOException {
        StringBuilder fullText = new StringBuilder();
        // try-with-resources 구문은 IOException을 자동으로 처리해줍니다.
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            for (int pageNum = 1; pageNum <= document.getNumberOfPages(); pageNum++) {
                stripper.setStartPage(pageNum);
                stripper.setEndPage(pageNum);
                String pageText = stripper.getText(document);
                fullText.append("--- Page ").append(pageNum).append(" ---\n");
                fullText.append(pageText).append("\n");
            }
        }
        return fullText.toString();
    }

    public String createPrompt(String textToSummarize) {
        return String.format("""
            당신은 전문적인 문서 요약가입니다. 다음 텍스트를 핵심 문장을 중요 키워드와 함께 요약해 주세요.
            각 요약된 문장에 대해, 그 내용의 근거가 되는 원본 텍스트의 '정확한 구절'과 '페이지 번호'를 반드시 포함해야 합니다.

            출력 형식은 다음 JSON 리스트 형식과 정확히 일치해야 합니다:
            [
              {
                "summary_sentence": "요약된 문장입니다.",
                "original_quote": "요약의 근거가 되는 원본 텍스트의 구절입니다.",
                "page_number": 페이지 번호
              },
              ...
            ]

            다음은 페이지 번호와 내용으로 구성된 문서입니다:
            ---
            %s
            ---
            """, textToSummarize);
    }

    public Mono<String> callGeminiApi(String prompt) {
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        return webClient.post()
            .uri(uriBuilder -> uriBuilder.queryParam("key", geminiApiKey).build())
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(JsonNode.class)
            .map(this::extractTextFromGeminiResponse);
    }

    public String extractTextFromGeminiResponse(JsonNode response) {
        try {
            String rawText = response.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText();
            return rawText.trim().replace("```json", "").replace("```", "");
        } catch (Exception e) {
            return "[]";
        }
    }

    public List<SummaryDto> parseSummaryResponse(String jsonResponse) {
        try {
            return objectMapper.readValue(jsonResponse, new TypeReference<List<SummaryDto>>() {});
        } catch (JsonProcessingException e) {
            // JSON 파싱 실패는 심각한 문제일 수 있으므로 RuntimeException으로 처리
            throw new RuntimeException("AI 응답 파싱에 실패했습니다.", e);
        }
    }
}
