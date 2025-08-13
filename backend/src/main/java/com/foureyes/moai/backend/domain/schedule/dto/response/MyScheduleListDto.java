package com.foureyes.moai.backend.domain.schedule.dto.response;

import com.foureyes.moai.backend.domain.schedule.entity.Schedule;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "마이페이지 일정 목록 DTO")
public class MyScheduleListDto {

    @Schema(description = "일정 ID", example = "1")
    private int id;

    @Schema(description = "스터디 ID", example = "5")
    private int studyId;

    @Schema(description = "스터디 이름", example = "싸피 알고리즘")
    private String name;

    @Schema(description = "스터디 설명", example = "알고리즘 문제 풀이 스터디")
    private String description;

    @Schema(description = "스터디 대표 이미지 URL", example = "https://cdn.example.com/studies/5.png")
    private String image;

    @Schema(description = "시작 시간", example = "2025-12-08T09:00:00")
    private LocalDateTime startDatetime;

    @Schema(description = "종료 시간", example = "2025-12-08T10:00:00")
    private LocalDateTime endDatetime;

    @Schema(description = "제목", example = "주간 회의")
    private String title;

    @Schema(description = "메모", example = "주간 진행 상황 공유")
    private String memo;

    public static MyScheduleListDto from(Schedule s) {
        var g = s.getStudyGroup();
        return MyScheduleListDto.builder()
            .id(s.getId())
            .studyId(g.getId())
            .name(g.getName())
            .description(g.getDescription())
            .image(g.getImageUrl())
            .startDatetime(s.getStartDatetime())
            .endDatetime(s.getEndDatetime())
            .title(s.getTitle())
            .memo(s.getMemo())
            .build();
    }
}
