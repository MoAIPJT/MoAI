
package com.foureyes.moai.backend.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SummaryResponseDto {
    @Schema(description = "파일명", example = "example.pdf")
    @JsonProperty("file_name")
    private String fileName;

    @Schema(description = "요약 결과 리스트")
    private List<SummaryDto> summary;
}
