package com.foureyes.moai.backend.domain.ai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor @Builder
@Schema(name = "DocsItem", description = "요약본에 연결된 문서")
public class DocsItem {
    @Schema(description = "docs ID", example = "10")
    private int docsId;
    @Schema(description = "Url", example = "example.com")
    private String url;
}
