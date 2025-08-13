package com.foureyes.moai.backend.domain.schedule.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
public class CreateScheduleRequestDto {
    @Schema(description = "스터디 ID", example = "1")
    @NotNull(message = "스터디 ID는 필수입니다.")
    private int studyId;

    @Schema(description = "시작 시간", example = "2025-08-05T10:00:00")
    @NotNull(message = "시작 시간은 필수입니다.")
    @Future(message = "시작 시간은 현재 시간 이후여야 합니다.")
    private LocalDateTime startDatetime;

    @Schema(description = "종료 시간", example = "2025-08-05T12:00:00")
    @NotNull(message = "종료 시간은 필수입니다.")
    @Future(message = "종료 시간은 현재 시간 이후여야 합니다.")
    private LocalDateTime endDatetime;

    @Schema(description = "일정 제목", example = "주간 회의")
    @NotNull(message = "일정 제목은 필수입니다.")
    private String title;

    @Schema(description = "메모", example = "주간 진행 상황 공유")
    private String memo;
}
