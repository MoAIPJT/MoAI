package com.foureyes.moai.backend.domain.ai.dto.request;

import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CreateAiSummaryRequest {

    @Schema(description = "제목", example = "네트워크 정리 요약")
    private String title;

    @Schema(description = "설명", example = "LLM을 이용한 자동 요약 결과")
    private String description;

    @Schema(description = "모델 유형", example = "gpt-4o-mini")
    private String modelType;

    @Schema(description = "프롬프트 유형", example = "study-summary")
    private String promptType;

    @Schema(description = "요약 JSON 결과(임의 구조)", example = "{\"bullets\":[\"...\",\"...\"]}")
    private JsonNode summaryJson;

    @Schema(description = "요약과 연결할 문서 ID 목록", example = "[101,102,103]", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<Integer> documentIds;
}
