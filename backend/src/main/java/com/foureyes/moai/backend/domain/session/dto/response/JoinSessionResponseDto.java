package com.foureyes.moai.backend.domain.session.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(description = "세션 참가(토큰) 응답")
public class JoinSessionResponseDto {
    @Schema(description = "룸 이름", example = "study-aB9xZK31")
    private String roomName;
    @Schema(description = "LiveKit WebSocket URL", example = "wss://livekit.example")
    private String wsUrl;
    @Schema(description = "참여자 이름", example = "홍길동")
    private String displayName;
    @Schema(description = "접속 토큰(JWT)")
    private String token;
}
