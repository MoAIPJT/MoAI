package com.foureyes.moai.backend.domain.schedule.controller;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.domain.schedule.dto.request.CreateScheduleRequestDto;
import com.foureyes.moai.backend.domain.schedule.dto.request.EditScheduleRequestDto;
import com.foureyes.moai.backend.domain.schedule.dto.response.*;
import com.foureyes.moai.backend.domain.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "Schedule API", description = "일정 관리 기능")
@RestController
@RequiredArgsConstructor
@RequestMapping("/schedules")
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
        int userId = jwtTokenProvider.getUserId(accessToken.substring(7));
        CreateScheduleResponseDto response = scheduleService.registerSchedule(
            userId,
            request
        );
        log.info("일정 생성 완료: scheduleId={}, userId={}", response.getId(), userId);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "일정 수정",
        description = "기존 일정을 부분 수정합니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @PatchMapping("/edit/{id}")
    public ResponseEntity<EditScheduleResponseDto> editEvent(
        @RequestHeader("Authorization") String accessToken,
        @Parameter(name = "id", description = "수정할 일정 ID", in = ParameterIn.PATH)
        @PathVariable("id") int scheduleId,
        @Valid @RequestBody EditScheduleRequestDto request
    ) {
        int userId = jwtTokenProvider.getUserId(accessToken.substring(7));
        EditScheduleResponseDto response = scheduleService.editSchedule(userId, scheduleId, request);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "일정 단건 조회",
        description = "일정 ID로 단일 일정을 조회합니다. 스터디 멤버만 접근 가능합니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/{id}")
    public ResponseEntity<GetScheduleResponseDto> getSchedule(
        @RequestHeader("Authorization") String accessToken,
        @Parameter(name = "id", description = "조회할 일정 ID", in = ParameterIn.PATH)
        @PathVariable("id") int scheduleId
    ) {
        int userId = jwtTokenProvider.getUserId(accessToken.substring(7));
        log.info("일정 단건 조회 API 호출: scheduleId={}, userId={}", scheduleId, userId);

        GetScheduleResponseDto response = scheduleService.getSchedule(userId, scheduleId);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "일정 목록 조회(스터디 스크린)",
        description = "스터디 페이지에서 기간(from~to)에 겹치는 일정을 조회합니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/{studyId}/list")
    public ResponseEntity<List<GetScheduleListDto>> listByRange(
        @RequestHeader("Authorization") String accessToken,
        @PathVariable @NotNull int studyId,
        @RequestParam @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        int userId = jwtTokenProvider.getUserId(accessToken.substring(7));
        log.info("일정 목록 조회 API 호출: studyId={}, userId={}, from={}, to={}",
            studyId, userId, from, to);

        List<GetScheduleListDto> response = scheduleService.listByRange(userId, studyId, from, to);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "일정 목록 조회(마이페이지)",
        description = "해당 사용자가 가입 승인된 모든 스터디의 일정들을 from~to 기간으로 조회합니다.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/list")
    public ResponseEntity<List<MyScheduleListDto>> listMySchedule(
        @RequestHeader("Authorization") String accessToken,
        @RequestParam @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        int userId = jwtTokenProvider.getUserId(accessToken.substring(7));
        log.info("마이페이지 일정 목록 조회: userId={}, from={}, to={}", userId, from, to);
        return ResponseEntity.ok(scheduleService.listMySchedules(userId, from, to));
    }

    @Operation(
        summary = "일정 삭제",
        description = "일정을 삭제합니다. 스터디 관리자만 가능.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSchedule(
        @RequestHeader("Authorization") String accessToken,
        @Parameter(name = "id", description = "삭제할 일정 ID", in = ParameterIn.PATH)
        @PathVariable("id") int scheduleId
    ) {
        int userId = jwtTokenProvider.getUserId(accessToken.substring(7));
        log.info("일정 삭제 API 호출: scheduleId={}, userId={}", scheduleId, userId);

        scheduleService.deleteSchedule(userId, scheduleId);
        return ResponseEntity.noContent().build(); // 204
    }
}

