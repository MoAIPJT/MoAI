// domain/study/session/controller/StudySessionController.java
package com.foureyes.moai.backend.domain.study.session.controller;

import com.foureyes.moai.backend.domain.study.session.dto.request.OpenSessionRequest;
import com.foureyes.moai.backend.domain.study.session.dto.response.SessionResponse;
import com.foureyes.moai.backend.domain.study.session.service.StudySessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Study Session", description = "스터디 세션 생성/조회 API")
@RestController
@RequestMapping("/api/studies/{studyId}/session")
@RequiredArgsConstructor
public class StudySessionController {

    private final StudySessionService service;

    // 프로젝트의 실제 Principal 타입으로 교체하세요 (예: CustomUserDetails)
    public interface AuthUser {
        Long getId();
    }

    @Operation(
        summary = "세션 열기(없으면 생성, 있으면 반환)",
        description = "ADMIN/DELEGATE만 호출 가능. 플랫폼 미지정 시 LIVEKIT",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @PostMapping("/open")
    public ResponseEntity<SessionResponse> open(
        @PathVariable Long studyId,
        @AuthenticationPrincipal AuthUser me,
        @RequestBody(required = false) OpenSessionRequest req
    ) {
        SessionResponse res = service.openOrGet(studyId, me.getId(), req);
        HttpStatus status = res.isCreated() ? HttpStatus.CREATED : HttpStatus.OK;
        return new ResponseEntity<>(res, status);
    }
}
