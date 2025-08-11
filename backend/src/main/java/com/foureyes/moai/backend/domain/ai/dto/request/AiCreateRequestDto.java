package com.foureyes.moai.backend.domain.ai.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiCreateRequestDto {
    @Schema(description = "사용자 ID", example = "1")
    private int id;

    @Schema(description = "파일 ID 리스트", example = "[1, 2, 3]")
    private List<Integer> fileId;

    @Schema(description = "요약 제목", example = "AI 모델에 대한 보고서 요약")
    private String title;

    @Schema(description = "요약 설명", example = "최신 AI 모델에 대한 기술 보고서를 요약합니다.")
    private String description;

    @Schema(description = "사용한 AI 모델 타입", example = "gemini-pro")
    private String modelType;

    @Schema(description = "사용한 프롬프트 타입", example = "report-summary")
    private String promptType;
}
