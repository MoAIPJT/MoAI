package com.foureyes.moai.backend.domain.study.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Schema(description = "스터디 상세 조회 응답")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class StudyDetailResponseDto {

    @Schema(description = "스터디 이름", example = "Spring Boot 스터디")
    private String name;

    @Schema(description = "대표 이미지 URL", example = "https://.../image.png")
    private String imageUrl;

    @Schema(
        description = "현재 사용자 가입 상태 (없으면 미포함)",
        allowableValues = {"PENDING","APPROVED","LEFT","REJECTED"},
        example = "APPROVED"
    )
    private String status;

    @Schema(
        description = "현재 사용자 역할(승인된 멤버일 때만 포함)",
        allowableValues = {"ADMIN","DELEGATE","MEMBER"},
        example = "MEMBER"
    )
    private String role;

    @Schema(description = "스터디 설명(승인된 멤버일 때만 포함)")
    private String description;

    @Schema(description = "승인된 스터디원 수(승인된 멤버일 때만 포함)", example = "4")
    private int userCount;
}
