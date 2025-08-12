package com.foureyes.moai.backend.domain.ai.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(name = "CreateAiSummaryResponse", description = "AI 요약본 생성 응답")
public class CreateAiSummaryResponse {

    @Schema(description = "요약본 ID", example = "1")
    private int summary_id;

    @Schema(description = "요약본 이름", example = "네트워크 총정리")
    private String title;

    @Schema(description = "요약본 설명", example = "주요 개념 요약 및 근거 페이지 포함")
    private String description;

    @Schema(description = "모델 이름", example = "gpt-4o-mini")
    private String model_type;

    @Schema(description = "프롬프트", example = "study-summary.v1")
    private String prompt_type;
}
