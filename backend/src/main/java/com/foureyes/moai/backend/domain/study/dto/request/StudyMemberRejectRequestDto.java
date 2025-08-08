package com.foureyes.moai.backend.domain.study.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudyMemberRejectRequestDto  {

    @Schema(description = "스터디 ID", example = "101", required = true)
    private int studyId;

    @Schema(description = "거절할 userID", example = "12", required = true)
    private int userID;


}
