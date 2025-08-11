package com.foureyes.moai.backend.domain.ai.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiUpdateRequestDto {
    @Schema(description = "요약본 ID", example = "1")
    private Long id;

    @Schema(description = "변경될 요약본 타이틀", example = "새로운 AI 모델 보고서 요약")
    private String title;

    @Schema(description = "변경될 요약본 설명", example = "업데이트된 최신 AI 모델에 대한 기술 보고서 요약입니다.")
    private String description;
}
