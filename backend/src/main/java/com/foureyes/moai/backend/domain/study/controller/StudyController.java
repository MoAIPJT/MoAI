package com.foureyes.moai.backend.domain.study.controller;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.domain.study.dto.request.CreateStudyRequest;
import com.foureyes.moai.backend.domain.study.dto.response.StudyResponseDto;
import com.foureyes.moai.backend.domain.study.service.StudyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Study API", description = "스터디 관리 기능")
@RestController
@RequestMapping("/study")
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;
    private final JwtTokenProvider jwtTokenProvider;

    @Operation(
        summary = "스터디 생성",
        description = "스터디 이름, 설명, 대표 이미지를 등록하여 새 스터디를 생성합니다",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudyResponseDto> createStudy(
        @Parameter(hidden = true) @RequestHeader("Authorization") String token,
        @ModelAttribute CreateStudyRequest request) {
        String pureToken = token.replace("Bearer ", "").trim();
        int userId = jwtTokenProvider.getUserId(pureToken);
        StudyResponseDto response = studyService.createStudy(userId, request);
        return ResponseEntity.status(201).body(response);
    }

    //TODO 리펙토링 필요
    @Operation(
        summary = "스터디 가입 요청 전송",
        description = "사용자가 특정 스터디에 가입 요청을 전송합니다. 관리자는 요청을 확인하여 승인할 수 있습니다",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/request")
    public ResponseEntity<Void> sendJoinRequest(
        @RequestHeader("Authorization") String bearerToken,
        @RequestParam("study_id") int studyId
    ) {
        String token = bearerToken.replaceFirst("^Bearer ", "").trim();
        int userId = jwtTokenProvider.getUserId(token);

        try {
            studyService.sendJoinRequest(userId, studyId);
        } catch (BadRequestException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok().build();
    }

}
