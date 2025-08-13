package com.foureyes.moai.backend.domain.study.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class CreateStudyRequest {

    @NotBlank(message = "스터디 이름은 필수입니다")
    @Schema(description = "스터디 이름", example = "AI 스터디", required = true)
    private String name;

    @Schema(description = "스터디 설명", example = "LLM 요약을 위한 학습 스터디", required = false)
    private String description;

    @Schema(description = "스터디 대표 이미지 파일", type = "string", format = "binary", required = false)
    private MultipartFile image;

    @Min(value = 2, message = "최대 수용 인원은 최소 2명 이상이어야 합니다")
    @Max(value = 8, message = "최대 수용 인원은 8명을 초과할 수 없습니다")
    @Schema(description = "최대 수용 인원", example = "8", required = true)
    private int maxCapacity;
}
