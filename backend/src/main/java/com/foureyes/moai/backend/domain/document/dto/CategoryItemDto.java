package com.foureyes.moai.backend.domain.document.dto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data @AllArgsConstructor
@Schema(name = "CategoryItem", description = "커스텀 카테고리")
public class CategoryItemDto {
    @Schema(description = "카테고리 ID", example = "10")
    private int id;

    @Schema(description = "카테고리 이름", example = "JPA")
    private String name;

    @Schema(description = "생성 시각")
    private LocalDateTime createdAt;

    @Schema(description = "수정 시각")
    private LocalDateTime updatedAt;
}
