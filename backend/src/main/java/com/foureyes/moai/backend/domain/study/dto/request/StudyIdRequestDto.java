package com.foureyes.moai.backend.domain.study.dto.request;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudyIdRequestDto {
    @Schema(description = "스터디 그룹 id", example = "1", required = true)
    private int studyGroupId;
}
