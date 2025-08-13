package com.foureyes.moai.backend.domain.schedule.dto.response;

import com.foureyes.moai.backend.domain.schedule.entity.Schedule;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "일정 생성 응답 DTO")
public class CreateScheduleResponseDto {
    @Schema(description = "일정 ID", example = "1")
    private int id;

    @Schema(description = "스터디 ID", example = "1")
    private Long studyId;

    @Schema(description = "사용자 ID", example = "1")
    private Long userId;

    @Schema(description = "시작 시간", example = "2025-08-05T10:00:00")
    private LocalDateTime startDatetime;

    @Schema(description = "종료 시간", example = "2025-08-05T12:00:00")
    private LocalDateTime endDatetime;

    @Schema(description = "일정 제목", example = "주간 회의")
    private String title;

    @Schema(description = "메모", example = "주간 진행 상황 공유")
    private String memo;

    public static CreateScheduleResponseDto from(Schedule schedule) {
        return CreateScheduleResponseDto.builder()
                .id(schedule.getId())
                .studyId((long) schedule.getStudyGroup().getId())
                .userId((long) schedule.getUser().getId())
                .startDatetime(schedule.getStartDatetime())
                .endDatetime(schedule.getEndDatetime())
                .title(schedule.getTitle())
                .memo(schedule.getMemo())
                .build();
    }
}

