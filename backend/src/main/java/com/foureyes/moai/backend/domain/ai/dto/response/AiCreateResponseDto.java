package com.foureyes.moai.backend.domain.ai.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiCreateResponseDto {
    @Schema(description = "생성된 요약 ID", example = "101")
    @JsonProperty("summary_id")
    private int summaryId;

    @Schema(description = "요약 제목", example = "AI 모델에 대한 보고서 요약")
    private String title;

    @Schema(description = "요약 설명", example = "최신 AI 모델에 대한 기술 보고서를 요약합니다.")
    private String description;

    @Schema(description = "사용한 AI 모델 타입", example = "gemini-pro")
    @JsonProperty("model_type")
    private String modelType;

    @Schema(description = "사용한 프롬프트 타입", example = "report-summary")
    @JsonProperty("prompt_type")
    private String promptType;
}
