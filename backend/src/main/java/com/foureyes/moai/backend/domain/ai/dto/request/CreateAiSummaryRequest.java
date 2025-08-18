package com.foureyes.moai.backend.domain.ai.dto.request;

import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CreateAiSummaryRequest {

    @Schema(description = "요약할 파일 ID 목록", example = "[101,102,103]", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<Integer> fileId;

    @Schema(description = "요약본 제목", example = "네트워크 총정리")
    private String title;

    @Schema(description = "요약본 설명", example = "주요 개념 요약 및 근거 페이지 포함")
    private String description;

    @Schema(description = "모델 이름", example = "gpt-4o-mini")
    private String modelType;

    @Schema(description = "프롬프트 유형/내용", example = "study-summary.v1")
    private String promptType;
}
