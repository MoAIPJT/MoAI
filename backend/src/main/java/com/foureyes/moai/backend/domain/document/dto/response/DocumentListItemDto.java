package com.foureyes.moai.backend.domain.document.dto.response;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class DocumentListItemDto {

    @Schema(description = "파일 아이디", example = "123")
    private int fileId;

    @Schema(description = "파일 이름(제목)", example = "Spring Boot Core Notes")
    private String title;

    @Schema(description = "파일 설명", example = "섹션별 요약과 참고 링크 정리")
    private String description;

    @ArraySchema(arraySchema = @Schema(description = "카테고리 이름 리스트"),
        schema = @Schema(example = "JPA"))
    private List<String> categories;

    @Schema(description = "업로더 프로필 이미지 URL", example = "https://cdn.example.com/u/1.png")
    private String profileImageUrl;

    @Schema(description = "업로더 이름", example = "Alice")
    private String name;

    @Schema(description = "업데이트 시각 (updated_at)", example = "2025-08-10T12:34:56")
    private LocalDateTime updateDate;

    @Schema(description = "업로드 시각 (created_at)", example = "2025-08-09T09:00:00")
    private LocalDateTime uploadDate;
}
