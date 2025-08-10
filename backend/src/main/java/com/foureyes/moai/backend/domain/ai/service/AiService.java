package com.foureyes.moai.backend.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.List;

public interface AiService {
    List<SummaryDto> summarizePdf(MultipartFile pdfFile) throws IOException;
    String extractTextFromPdf(MultipartFile file) throws IOException;
    String createPrompt(String textToSummarize);
    Mono<String> callGeminiApi(String prompt);
    String extractTextFromGeminiResponse(JsonNode response);
    List<SummaryDto> parseSummaryResponse(String jsonResponse);
}
