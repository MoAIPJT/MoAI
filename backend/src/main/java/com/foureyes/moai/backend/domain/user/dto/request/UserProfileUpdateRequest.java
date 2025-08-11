package com.foureyes.moai.backend.domain.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateRequest {

    @Schema(description = "변경할 사용자 닉네임", example = "모아이")
    private String name;

    @Schema(description = "변경할 프로필 이미지 URL", example = "https://cdn.moai.com/profiles/user123.png")
    private String profileImageUrl;
}
