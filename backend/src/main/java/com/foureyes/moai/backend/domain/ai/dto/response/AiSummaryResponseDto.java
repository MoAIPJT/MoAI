package com.foureyes.moai.backend.domain.ai.dto.response;


import com.fasterxml.jackson.databind.JsonNode;
import com.foureyes.moai.backend.domain.ai.dto.DocsItem;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "AiSummaryResponse")
public class AiSummaryResponseDto {

    @Schema(description = "요약본 JSON")
    private JsonNode summaryJson;

    @Schema(description = "DocsItem")
    private List<DocsItem> docses;

}
