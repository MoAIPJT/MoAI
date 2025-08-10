package com.foureyes.moai.backend.domain.document.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class EditCategoryRequest {
    @Schema(description = "카테고리 이름", example = "Spring Core", requiredMode = Schema.RequiredMode.REQUIRED)
    private String categoryName;
}
