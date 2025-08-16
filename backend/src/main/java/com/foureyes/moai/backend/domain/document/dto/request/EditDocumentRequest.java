package com.foureyes.moai.backend.domain.document.dto.request;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
public class EditDocumentRequest {
    @Schema(description = "변경 자료명(제목)", example = "Spring Boot Core Notes")
    private String title;

    @Schema(description = "카테고리 ID 리스트", example = "[1, 2, 3]")
    private List<Integer> categoryIdList;

    @Schema(description = "파일 설명", example = "섹션별 요약과 링크 정리")
    private String description;
}
