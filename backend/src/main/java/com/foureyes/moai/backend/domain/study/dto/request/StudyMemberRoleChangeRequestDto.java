package com.foureyes.moai.backend.domain.study.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class StudyMemberRoleChangeRequestDto {
    @Schema(description = "스터디 ID", example = "101", required = true)
    private int studyId;

    @Schema(description = "권한을 변경할 유저 ID", example = "5", required = true)
    private int userId;

    @Schema(description = "변경할 역할 (ADMIN, DELEGATE, MEMBER)", example = "ADMIN", required = true)
    private String role;
}
