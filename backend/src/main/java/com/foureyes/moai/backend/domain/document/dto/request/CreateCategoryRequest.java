package com.foureyes.moai.backend.domain.document.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class CreateCategoryRequest {
    @Schema(description = "스터디 ID", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer studyId;

    @Schema(description = "카테고리 이름", example = "JPA", requiredMode = Schema.RequiredMode.REQUIRED)
    private String categoryName;
}
