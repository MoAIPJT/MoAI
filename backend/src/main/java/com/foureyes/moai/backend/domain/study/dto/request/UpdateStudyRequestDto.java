package com.foureyes.moai.backend.domain.study.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStudyRequestDto {

    @Schema(description = "스터디 이름", example = "AI 스터디", required = false)
    private String name;

    @Schema(description = "스터디 설명", example = "LLM 요약을 위한 학습 스터디", required = false)
    private String description;

    @Schema(description = "스터디 대표 이미지 파일", type = "string", format = "binary", required = false)
    private MultipartFile image;       // 멀티파트로만 수신 가능

    @Max(value = 8, message = "최대 수용 인원은 8명을 초과할 수 없습니다")
    @Schema(description = "최대 수용 인원", example = "8", required = false)
    private int maxCapacity;
}
