package com.foureyes.moai.backend.domain.schedule.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EditScheduleRequestDto {
    @Schema(description = "스터디 ID", example = "1", required = true)
    @NotNull(message = "스터디 ID는 필수입니다.")
    private Long studyId;

    @Schema(description = "시작 시간(선택)", example = "2025-08-05T10:00:00")
    @Future(message = "시작 시간은 현재 시간 이후여야 합니다.")
    private LocalDateTime startDatetime;

    @Schema(description = "종료 시간(선택)", example = "2025-08-05T12:00:00")
    @Future(message = "종료 시간은 현재 시간 이후여야 합니다.")
    private LocalDateTime endDatetime;

    @Schema(description = "일정 제목(선택)", example = "주간 회의")
    private String title;

    @Schema(description = "메모(선택)", example = "주간 진행 상황 공유")
    private String memo;

    public boolean hasNoChanges() {
        return startDatetime == null && endDatetime == null && title == null && memo == null;
    }
}
