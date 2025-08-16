package com.foureyes.moai.backend.domain.session.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Schema(description = "세션 참여자 정보")
public class ParticipantDto {
    @Schema(description = "이름(표시명)", example = "Hazel")
    private String name;

    @Schema(description = "프로필 이미지 URL", example = "https://.../avatar.png")
    private String profileImageUrl;
}
