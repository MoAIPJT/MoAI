package com.foureyes.moai.backend.domain.ai.controller;

import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
import com.foureyes.moai.backend.domain.ai.dto.SummaryResponseDto;
import com.foureyes.moai.backend.domain.ai.service.AiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public class AiController {
    private final AiService summaryService;

    // 생성자를 통해 SummaryService를 주입받습니다 (의존성 주입).
    public AiController(AiService summaryService) {
        this.summaryService = summaryService;
    }

    @PostMapping("/summarize")
    public ResponseEntity<?> summarizeRoute(@RequestParam("files") MultipartFile file) {
        // 파일이 비어있는지 확인
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "No selected files"));
        }

        try {
            // 서비스 로직 호출
            List<SummaryDto> summaryPoints = summaryService.summarizePdf(file);

            // 성공 응답 생성
            SummaryResponseDto response = new SummaryResponseDto(file.getOriginalFilename(), summaryPoints);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // 그 외 모든 에러 (e.g., Gemini API 호출 실패)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }
}
