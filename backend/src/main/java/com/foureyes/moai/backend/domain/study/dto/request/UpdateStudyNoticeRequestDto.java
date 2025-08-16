package com.foureyes.moai.backend.domain.study.dto.request;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateStudyNoticeRequestDto {

    @Schema(description = "스터디 ID", example = "101", required = true)
    @NotNull
    private Integer studyId;

    @Schema(description = "수정할 공지사항 본문", example = "이번 주 모임은 취소입니다.")
    private String notice; // 비워서 보내면 공지 제거로 간주(정책에 따라)
}
