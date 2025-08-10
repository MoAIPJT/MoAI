package com.foureyes.moai.backend.domain.ai.controller;

import com.foureyes.moai.backend.domain.ai.dto.request.AiCreateRequestDto;
import com.foureyes.moai.backend.domain.ai.dto.response.AiCreateResponseDto;
import com.foureyes.moai.backend.domain.ai.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ai")
public class AiController {

    private static final Logger log = LoggerFactory.getLogger(AiController.class);
    private final AiService aiService;

    /**
     * 입력: 클라이언트로부터 받은 AI 요약 생성 요청(AiCreateRequestDto)
     * 출력: 생성된 AI 요약 정보(AiCreateResponseDto)
     * 기능: AI 요약 생성을 위한 POST 요청을 처리한다.
     */
    @PostMapping("/create")
    @Operation(summary = "AI 요약 생성", description = "AI 요약 생성 API 입니다.")
    public ResponseEntity<AiCreateResponseDto> createSummary(
        @RequestBody AiCreateRequestDto requestDto) {
        log.info("AI 요약 생성 요청: {}", requestDto.getTitle());
        AiCreateResponseDto responseDto = aiService.createSummary(requestDto);
        log.info("AI 요약 생성 완료: {}", responseDto.getTitle());
        return ResponseEntity.ok(responseDto);
    }

    /**
     * 입력: 요약본 ID
     * 출력: 없음
     * 기능: AI 요약 삭제를 위한 DELETE 요청을 처리한다.
     */
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "AI 요약 삭제", description = "AI 요약 삭제 API 입니다.")
    public ResponseEntity<Void> deleteSummary(@PathVariable("id") Long summaryId) {
        log.info("AI 요약 삭제 요청: id={}", summaryId);
        aiService.deleteSummary(summaryId);
        log.info("AI 요약 삭제 완료: id={}", summaryId);
        return ResponseEntity.ok().build();
    }
}
