package com.foureyes.moai.backend.domain.study.dto.response;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Builder
@Setter
@AllArgsConstructor
public class StudyListResponseDto {

    @Schema(description = "스터디 이름", example = "Algo 스터디")
    private final String name;

    @Schema(description = "스터디 설명", example = "하루 한 문제 이상 풀이하는 스터디")
    private final String description;

    @Schema(description = "대표 이미지 URL", example = "https://cdn.example.com/images/study_101.png")
    private final String imageUrl;

    @Schema(description = "스터디장 이름", example = "홀길동")
    private final String creatorName;

    @Schema(description = "가입상태", example = "PENDING")
    private final String status;  // PENDING 또는 APPROVED

    @Schema(description = "스터디 아이디", example = "101")
    private final int studyId;

    @Schema(description = "스터디 해쉬 아이디", example = "ex531a")
    private final String hashId;

}
