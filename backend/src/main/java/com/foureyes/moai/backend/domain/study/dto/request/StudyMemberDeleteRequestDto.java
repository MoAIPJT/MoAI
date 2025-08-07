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
public class StudyMemberDeleteRequestDto {
    @Schema(description = "스터디 ID", example = "101", required = true)
    private int studyId;

    @Schema(description = "삭제할 유저 ID", example = "5", required = true)
    private int userId;
}
