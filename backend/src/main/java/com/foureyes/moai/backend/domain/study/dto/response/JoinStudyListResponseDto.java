package com.foureyes.moai.backend.domain.study.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinStudyListResponseDto {

    @Schema(description = "스터디 이름", example = "Spring Boot 스터디")
    private String name;

    @Schema(description = "대표 이미지 URL", example = "https://.../image.png")
    private String imageUrl;

    @Schema(description = "스터디 ID", example = "101")
    private int studyId;

    @Schema(description = "공유/라우팅용 HashId", example = "jR4kd8Lz")
    private String hashId;
}
