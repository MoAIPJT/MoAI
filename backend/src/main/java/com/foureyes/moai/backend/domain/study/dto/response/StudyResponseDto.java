package com.foureyes.moai.backend.domain.study.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyResponseDto {

    @Schema(description = "스터디 ID", example = "101")
    private int id;

    @Schema(description = "스터디 이름", example = "AI 스터디")
    private String name;

    @Schema(description = "스터디 설명", example = "요약 학습 스터디")
    private String description;

    @Schema(description = "대표 이미지 URL", example = "https://cdn.example.com/images/study_101.png")
    private String imageUrl;

    @Schema(description = "생성한 유저 ID", example = "5")
    private int createdBy;

    @Schema(description = "생성 시각", example = "2025-08-05T10:00:00")
    private LocalDateTime createdAt;


}
