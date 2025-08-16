package com.foureyes.moai.backend.domain.session.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(description = "세션 참여자 목록 응답")
public class ParticipantsResponseDto {

    @Schema(description = "세션이 열려 있는지", example = "true")
    private boolean sessionOpen;

    @Schema(description = "현재 참가자 수", example = "3")
    private int count;

    @Schema(description = "참가자 목록")
    private List<ParticipantDto> participants;
}
