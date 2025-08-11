package com.foureyes.moai.backend.domain.ai.controller;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.commons.util.StorageService;
import com.foureyes.moai.backend.domain.ai.dto.SummaryDto;
import com.foureyes.moai.backend.domain.ai.dto.request.CreateAiSummaryRequest;
import com.foureyes.moai.backend.domain.ai.dto.response.CreateAiSummaryResponse;
import com.foureyes.moai.backend.domain.ai.dto.response.DashboardSummariesResponse;
import com.foureyes.moai.backend.domain.ai.dto.response.SidebarSummariesResponse;
import com.foureyes.moai.backend.domain.ai.entity.AiSummaryDocument;
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
//    @GetMapping("/demo/{id}")
//    @Operation(summary = "AI 데모")
//    public ResponseEntity<List<SummaryDto>> demoAiSummary(
//        @Parameter(hidden = true) @RequestHeader("Authorization") String bearerToken,
//        @PathVariable("id") int summaryId){
//        log.info("AI 요약 수정 요청: id={}", summaryId);
//
//        int userId = extractUserIdFromToken(bearerToken);
//        String fileKey = documentService.getDocumentKeyIfAllowed(userId,summaryId);
//        try (var in = storageService.openDocumentStream(fileKey)) {
//            return ResponseEntity.ok(aiService.summarizePdf(in, "source.pdf"));
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }
    @Operation(
        summary = "AI 요약본 생성",
        description = """
            여러 문서 ID를 받아 요약본 레코드를 생성하고 문서와 연결합니다.
            모델/프롬프트 값은 그대로 저장되며, 실제 모델 호출은 추후 연결합니다.
            """
    )
    @PostMapping("/create")
    public ResponseEntity<CreateAiSummaryResponse> create(
        @Parameter(hidden = true) @RequestHeader("Authorization") String bearerToken,
        @RequestBody CreateAiSummaryRequest req
    ) {
        int ownerId = extractUserIdFromToken(bearerToken);
        var resp = aiService.createSummary(ownerId, req);
        return ResponseEntity.status(201).body(resp);
    }

    @Operation(summary = "내 요약본 목록(대시보드)")
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummariesResponse> dashboard(
        @Parameter(hidden = true) @RequestHeader("Authorization") String bearerToken
    ) {
        int ownerId = extractUserIdFromToken(bearerToken);
        return ResponseEntity.ok(aiService.getDashboardList(ownerId));
    }

    @Operation(summary = "내 요약본 목록(사이드바)")
    @GetMapping("/sidebar")
    public ResponseEntity<SidebarSummariesResponse> sidebar(
        @Parameter(hidden = true) @RequestHeader("Authorization") String bearerToken
    ) {
        int ownerId = extractUserIdFromToken(bearerToken);
        return ResponseEntity.ok(aiService.getSidebarList(ownerId));
    }

    @Operation(
        summary = "AI 요약본 삭제",
        description = "요약본의 소유자만 삭제할 수 있습니다. 성공 시 200을 반환합니다."
    )
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSummary(
        @Parameter(hidden = true) @RequestHeader("Authorization") String bearerToken,
        @Parameter(description = "요약본 ID", example = "123") @PathVariable int id
    ) {
        int ownerId = extractUserIdFromToken(bearerToken);
        aiService.deleteSummary(ownerId, id);
        return ResponseEntity.ok().build();
    }
}
