package com.foureyes.moai.backend.domain.document.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentResponseDto {

    @Schema(description = "문서 ID")
    private int id;

    @Schema(description = "스터디 ID")
    private int studyId;

    private String title;
    private String description;

    @Schema(description = "저장된 파일 키(S3/B2 경로 키)")
    private String fileKey;

    private List<Integer> categoryIds;

    private LocalDateTime createdAt;
}
