package com.foureyes.moai.backend.domain.study.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class StudyMemberListResponseDto {

    @Schema(description = "유저이름", example = "홍길동")
    private final String member;
    @Schema(description = "권한", example = "Admin")
    private final String role;
}
