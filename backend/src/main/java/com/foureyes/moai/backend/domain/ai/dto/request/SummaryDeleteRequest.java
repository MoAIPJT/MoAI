package com.foureyes.moai.backend.domain.ai.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
@Schema(description = "요약본 삭제 요청")
public class SummaryDeleteRequest {
    @Schema(description = "요약본 ID", example = "1")
    private Long id;
}
