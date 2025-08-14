// domain/study/session/controller/StudySessionController.java
package com.foureyes.moai.backend.domain.session.controller;

import com.foureyes.moai.backend.domain.session.dto.response.SessionResponseDto;
import com.foureyes.moai.backend.domain.session.service.StudySessionService;
import com.foureyes.moai.backend.domain.user.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Study Session", description = "스터디 세션 생성/조회 API")
@RestController
@RequestMapping("/study")
@RequiredArgsConstructor
public class StudySessionController {

    private final StudySessionService service;

    @Operation(
        summary = "세션 열기(없으면 생성, 있으면 반환) - hashId",
        description = "ADMIN/DELEGATE만 호출 가능. URL은 hashId 사용",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @PostMapping("/{hashId}/session/open")
    public ResponseEntity<SessionResponseDto> open(
        @PathVariable String hashId,
        @AuthenticationPrincipal CustomUserDetails user
    ) {
        SessionResponseDto response = service.openOrGetByHashId(hashId, user.getId());
        HttpStatus status = response.isCreated() ? HttpStatus.CREATED : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }
}
