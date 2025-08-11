package com.foureyes.moai.backend.domain.ai.controller;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.commons.util.StorageService;
import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
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
