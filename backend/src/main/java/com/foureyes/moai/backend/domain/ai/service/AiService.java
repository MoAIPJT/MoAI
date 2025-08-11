package com.foureyes.moai.backend.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
import com.foureyes.moai.backend.domain.ai.dto.request.AiUpdateRequestDto;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import com.foureyes.moai.backend.domain.ai.dto.request.AiCreateRequestDto;
import com.foureyes.moai.backend.domain.ai.dto.response.AiCreateResponseDto;

public interface AiService {
    /**
     * 입력: MultipartFile
     * 출력: List<SummaryDto>
     * 기능: PDF 파일을 요약한다.
     */
    List<SummaryDto> summarizePdf(InputStream pdfInputStream, String fileName) throws IOException;

    /**
     * 입력: MultipartFile
     * 출력: String
     * 기능: PDF 파일에서 텍스트를 추출한다.
     */
    public String extractTextFromPdf(InputStream inputStream, String fileName) throws IOException;


    /**
     * 입력: String
     * 출력: String
     * 기능: 요약할 텍스트로 프롬프트를 생성한다.
     */
    String createPrompt(String textToSummarize);

    /**
     * 입력: String
     * 출력: Mono<String>
     * 기능: Gemini API를 호출한다.
     */
    Mono<String> callGeminiApi(String prompt);

    /**
     * 입력: JsonNode
     * 출력: String
     * 기능: Gemini API 응답에서 텍스트를 추출한다.
     */
    String extractTextFromGeminiResponse(JsonNode response);

    /**
     * 입력: String
     * 출력: List<SummaryDto>
     * 기능: 요약 응답을 파싱한다.
     */
    List<SummaryDto> parseSummaryResponse(String jsonResponse);

    /**
     * 입력: AiCreateRequestDto
     * 출력: AiCreateResponseDto
     * 기능: AI 요약 정보를 생성하고 저장한다.
     */
    AiCreateResponseDto createSummary(AiCreateRequestDto requestDto);

    /**
     * 입력: int
     * 출력: void
     * 기능: AI 요약 정보를 삭제한다.
     */
    void deleteSummary(int summaryId);

    /**
     * 입력: AiUpdateRequestDto
     * 출력: AiCreateResponseDto
     * 기능: AI 요약 정보를 업데이트한다.
     */
    AiCreateResponseDto updateSummary(AiUpdateRequestDto requestDto);
}
