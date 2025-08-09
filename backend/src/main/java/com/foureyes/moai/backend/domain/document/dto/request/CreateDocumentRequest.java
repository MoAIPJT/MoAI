package com.foureyes.moai.backend.domain.document.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDocumentRequest {

    @Schema(description = "카테고리 ID", example = "101", requiredMode = Schema.RequiredMode.REQUIRED)
    private int categoryId;

    @Schema(description = "파일 표시 이름(제목)", example = "네트워크 정리.pdf", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "자료 설명", example = "OSI 7계층 정리본")
    private String description;

    @Schema(description = "업로드 파일", requiredMode = Schema.RequiredMode.REQUIRED)
    private MultipartFile file;
}
