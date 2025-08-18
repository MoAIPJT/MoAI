package com.foureyes.moai.backend.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryDto {
    @Schema(description = "요약된 문장", example = "이것은 요약된 문장입니다.")
    @JsonProperty("summary_sentence")
    private String summarySentence;

    @Schema(description = "원본 텍스트의 인용구", example = "이것이 원본 텍스트입니다.")
    @JsonProperty("original_quote")
    private String originalQuote;

    @Schema(description = "페이지 번호", example = "5")
    @JsonProperty("page_number")
    private String pageNumber;
}
