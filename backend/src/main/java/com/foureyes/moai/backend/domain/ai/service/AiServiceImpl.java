package com.foureyes.moai.backend.domain.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
import com.foureyes.moai.backend.domain.ai.dto.request.AiCreateRequestDto;
import com.foureyes.moai.backend.domain.ai.dto.response.AiCreateResponseDto;
import com.foureyes.moai.backend.domain.ai.entity.Summary;
import com.foureyes.moai.backend.domain.ai.repository.SummaryRepository;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.repository.UserRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
public class AiServiceImpl implements AiService {

    private static final Logger log = LoggerFactory.getLogger(AiServiceImpl.class);
    private final WebClient webClient;
    private final String geminiApiKey;
    private final ObjectMapper objectMapper;
    private final SummaryRepository summaryRepository;
    private final UserRepository userRepository;

    public AiServiceImpl(WebClient.Builder webClientBuilder,
                         @Value("${gemini.api.url}") String geminiApiUrl,
                         @Value("${gemini.api.key}") String geminiApiKey,
                         SummaryRepository summaryRepository,
                         UserRepository userRepository) {
        this.webClient = webClientBuilder.baseUrl(geminiApiUrl).build();
        this.geminiApiKey = geminiApiKey;
        this.objectMapper = new ObjectMapper();
        this.summaryRepository = summaryRepository;
        this.userRepository = userRepository;
    }


    /**  Demo 시연시 사용한 코드 변환 Start **/


    /**
     * 입력: pdfFile
     * 출력: List<SummaryDto>
     * 기능: PDF 파일을 받아 텍스트 추출, 프롬프트 생성, Gemini API 호출, 응답 파싱을 통해 요약 결과를 반환한다.
     */
    @Override
    public List<SummaryDto> summarizePdf(InputStream pdfInputStream, String fileName) throws IOException {
        log.info("PDF 요약 시작: {}", fileName);
        String textForPrompt = extractTextFromPdf(pdfInputStream, fileName);
        String prompt = createPrompt(textForPrompt);

        try {
            String summaryJson = callGeminiApi(prompt).block();
            List<SummaryDto> summary = parseSummaryResponse(summaryJson);
            log.info("PDF 요약 완료: {}", fileName);
            return summary;
        } catch (Exception e) {
            log.error("AI 요약 생성 중 오류 발생", e);
            throw new RuntimeException("AI 요약 생성 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 입력: file
     * 출력: String
     * 기능: PDF 파일에서 페이지 번호와 함께 텍스트를 추출한다.
     */

    public String extractTextFromPdf(InputStream inputStream, String fileName) throws IOException {
        log.info("PDF 텍스트 추출 시작: {}", fileName);
        StringBuilder fullText = new StringBuilder();

        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            for (int pageNum = 1; pageNum <= document.getNumberOfPages(); pageNum++) {
                stripper.setStartPage(pageNum);
                stripper.setEndPage(pageNum);
                String pageText = stripper.getText(document);
                fullText.append("--- Page ").append(pageNum).append(" --- ");
                fullText.append(pageText).append(" ");
            }
        }

        log.info("PDF 텍스트 추출 완료: {}", fileName);
        return fullText.toString();
    }

    /**
     * 입력: textToSummarize
     * 출력: String
     * 기능: Gemini API에 전달할 프롬프트를 생성한다. JSON 출력 형식을 지정한다.
     */
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

    /**
     * 입력: prompt
     * 출력: Mono<String>
     * 기능: WebClient를 사용하여 Gemini API를 비동기적으로 호출하고, 응답을 Mono<String>으로 반환한다.
     */
    public Mono<String> callGeminiApi(String prompt) {
        log.info("Gemini API 호출");
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

    /**
     * 입력: response
     * 출력: String
     * 기능: Gemini API의 JSON 응답에서 요약 텍스트 부분을 추출한다.
     */
    public String extractTextFromGeminiResponse(JsonNode response) {
        try {
            String rawText = response.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText();
            return rawText.trim().replace("```json", "").replace("```", "");
        } catch (Exception e) {
            return "[]";
        }
    }

    /**
     * 입력: jsonResponse
     * 출력: List<SummaryDto>
     * 기능: JSON 형식의 요약 응답 문자열을 List<SummaryDto> 객체로 파싱한다.
     */
    public List<SummaryDto> parseSummaryResponse(String jsonResponse) {
        try {
            log.info("AI 응답 파싱 시작");
            List<SummaryDto> result = objectMapper.readValue(jsonResponse, new TypeReference<List<SummaryDto>>() {});
            log.info("AI 응답 파싱 완료");
            return result;
        } catch (JsonProcessingException e) {
            log.error("AI 응답 파싱 실패: {}", jsonResponse, e);
            throw new RuntimeException("AI 응답 파싱에 실패했습니다.", e);
        }
    }



    /**    데모 END    */
    /**
     * 입력: requestDto
     * 출력: AiCreateResponseDto
     * 기능: 요약 요청 정보를 받아 DB에 저장하고, 생성된 요약 정보 DTO를 반환한다.
     */
    @Override
    public AiCreateResponseDto createSummary(AiCreateRequestDto requestDto) {
        log.info("요약 정보 저장 시작: {}", requestDto.getTitle());
        User user = userRepository.findById(requestDto.getId().intValue())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Summary summary = Summary.builder()
                .user(user)
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .modelType(requestDto.getModelType())
                .promptType(requestDto.getPromptType())
                .build();

        Summary savedSummary = summaryRepository.save(summary);
        log.info("요약 정보 저장 완료: id={}", savedSummary.getId());

        return AiCreateResponseDto.builder()
                .summaryId(savedSummary.getId())
                .title(savedSummary.getTitle())
                .description(savedSummary.getDescription())
                .modelType(savedSummary.getModelType())
                .promptType(savedSummary.getPromptType())
                .build();
    }
}
