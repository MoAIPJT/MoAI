package com.foureyes.moai.backend.domain.study.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class CreateStudyRequest {

    @Schema(description = "스터디 이름", example = "AI 스터디", required = true)
    private String name;

    @Schema(description = "스터디 설명", example = "LLM 요약을 위한 학습 스터디", required = false)
    private String description;

    @Schema(description = "스터디 대표 이미지 파일", type = "string", format = "binary", required = true)
    private MultipartFile image;

    @Schema(description="최대 수용 인원", example="8", required=true)
    private int maxCapacity;
}
