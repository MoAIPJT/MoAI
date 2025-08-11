package com.foureyes.moai.backend.domain.schedule.dto.response;

import com.foureyes.moai.backend.domain.schedule.entity.Schedule;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "일정 요약 DTO(목록용)")
public class GetScheduleListDto {

    @Schema(description = "일정 ID", example = "1")
    private Long id;

    @Schema(description = "스터디 ID", example = "5")
    private Long studyId;

    @Schema(description = "작성자 사용자 ID", example = "3")
    private Long userId;

    @Schema(description = "시작 시간", example = "2025-12-08T09:00:00")
    private LocalDateTime startDatetime;

    @Schema(description = "종료 시간", example = "2025-12-08T10:00:00")
    private LocalDateTime endDatetime;

    @Schema(description = "제목", example = "주간 회의")
    private String title;

    public static GetScheduleListDto from(Schedule s) {
        return GetScheduleListDto.builder()
            .id(s.getId())
            .studyId((long) s.getStudyGroup().getId())
            .userId((long) s.getUser().getId())
            .startDatetime(s.getStartDatetime())
            .endDatetime(s.getEndDatetime())
            .title(s.getTitle())
            .build();
    }
}
