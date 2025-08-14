package com.foureyes.moai.backend.domain.session.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(description = "세션 종료 응답")
public class CloseSessionResponseDto {

    @Schema(description = "세션 ID", example = "101")
    private int id;

    @Schema(description = "스터디 hashId", example = "aB9xZK31")
    private String studyGroupHashId;

    @Schema(description = "룸 이름", example = "study-aB9xZK31")
    private String roomName;

    @Schema(description = "종료 여부(요청으로 인해 종료되었는지)", example = "true")
    private boolean closed;

    @Schema(description = "종료 시각")
    private LocalDateTime closedAt;
}
