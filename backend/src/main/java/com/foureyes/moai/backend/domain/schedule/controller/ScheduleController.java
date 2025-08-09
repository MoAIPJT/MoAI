package com.foureyes.moai.backend.domain.schedule.controller;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.domain.schedule.dto.request.CreateScheduleRequestDto;
import com.foureyes.moai.backend.domain.schedule.dto.response.CreateScheduleResponseDto;
import com.foureyes.moai.backend.domain.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Schedule API", description = "일정 관리 기능")
@RestController
@RequiredArgsConstructor
@RequestMapping("/schedule")
public class ScheduleController {

    private static final Logger log = LoggerFactory.getLogger(ScheduleController.class);
    private final ScheduleService scheduleService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 입력: CreateScheduleRequestDto (일정 생성 정보)
     * 출력: CreateScheduleResponseDto (생성된 일정 정보)
     * 기능: 새로운 일정을 생성
     */
    @Operation(
        summary = "일정 생성",
        description = "새로운 일정을 생성합니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @PostMapping("/register")
    public ResponseEntity<CreateScheduleResponseDto> registerEvent(
            @RequestHeader("Authorization") String accessToken,
            @Valid @RequestBody CreateScheduleRequestDto request) {
        log.info("일정 생성 API 호출: studyId={}", request.getStudyId());
        Long userId = Long.valueOf(jwtTokenProvider.getUserId(accessToken.substring(7)));
        CreateScheduleResponseDto response = scheduleService.registerSchedule(
            userId,
            request
        );
        log.info("일정 생성 완료: scheduleId={}, userId={}", response.getId(), userId);
        return ResponseEntity.ok(response);
    }
}

