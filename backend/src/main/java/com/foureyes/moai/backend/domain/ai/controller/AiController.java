package com.foureyes.moai.backend.domain.ai.controller;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.commons.util.StorageService;
import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
import com.foureyes.moai.backend.domain.ai.dto.request.AiCreateRequestDto;
import com.foureyes.moai.backend.domain.ai.dto.request.AiUpdateRequestDto;
import com.foureyes.moai.backend.domain.ai.dto.response.AiCreateResponseDto;
import com.foureyes.moai.backend.domain.ai.service.AiService;
import com.foureyes.moai.backend.domain.document.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ai")
public class AiController {

    private static final Logger log = LoggerFactory.getLogger(AiController.class);
    private final AiService aiService;
    private final JwtTokenProvider jwtTokenProvider;
    private final StorageService storageService;
    private final DocumentService documentService;

    private int extractUserIdFromToken(String bearerToken) {
        String token = bearerToken.replaceFirst("^Bearer ", "").trim();
        return jwtTokenProvider.getUserId(token);
    }
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
    public ResponseEntity<Void> deleteSummary(@PathVariable("id") int summaryId) {
        log.info("AI 요약 삭제 요청: id={}", summaryId);
        aiService.deleteSummary(summaryId);
        log.info("AI 요약 삭제 완료: id={}", summaryId);
        return ResponseEntity.ok().build();
    }

    /**
     * 입력: 요약본 ID, 변경된 요약본 타이틀, 요약본 설명
     * 출력: 변경된 AI 요약 정보(AiCreateResponseDto)
     * 기능: AI 요약 수정을 위한 PATCH 요청을 처리한다.
     */
    @PatchMapping("/edit/{id}")
    @Operation(summary = "AI 요약 수정", description = "AI 요약 수정 API 입니다.")
    public ResponseEntity<AiCreateResponseDto> updateSummary(
        @PathVariable("id") int summaryId,
        @RequestBody AiUpdateRequestDto requestDto) {
        log.info("AI 요약 수정 요청: id={}", summaryId);
        requestDto.setId(summaryId);
        AiCreateResponseDto responseDto = aiService.updateSummary(requestDto);
        log.info("AI 요약 수정 완료: id={}", responseDto.getSummaryId());
        return ResponseEntity.ok(responseDto);
    }


    /*test api*/
    /**
     * 입력: 요약본
     * 출력: 요약된 문서
     * 기능: 데모 버전 실행
     */
    @GetMapping("/demo/{id}")
    @Operation(summary = "AI 데모")
    public ResponseEntity<List<SummaryDto>> demoAiSummary(
        @Parameter(hidden = true) @RequestHeader("Authorization") String bearerToken,
        @PathVariable("id") int summaryId){
        log.info("AI 요약 수정 요청: id={}", summaryId);

        int userId = extractUserIdFromToken(bearerToken);
        String fileKey = documentService.getDocumentKeyIfAllowed(userId,summaryId);
        try (var in = storageService.openDocumentStream(fileKey)) {
            return ResponseEntity.ok(aiService.summarizePdf(in, "source.pdf"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
