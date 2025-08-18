package com.foureyes.moai.backend.domain.study.dto.response;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class StudyNoticeResponseDto {

    @Schema(description = "스터디 공지사항 본문", example = "이번 주 모임은 취소입니다.")
    private String notice;
}
