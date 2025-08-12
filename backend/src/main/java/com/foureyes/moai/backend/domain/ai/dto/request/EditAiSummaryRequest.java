package com.foureyes.moai.backend.domain.ai.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EditAiSummaryRequest {

    @Schema(description = "변경할 제목", example = "웹 요약")
    private String title;

    @Schema(description = "변경할 설명", example = "웹 전체 요약")
    private String description;
}
