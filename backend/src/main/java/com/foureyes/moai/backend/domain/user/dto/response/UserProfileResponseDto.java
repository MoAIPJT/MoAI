package com.foureyes.moai.backend.domain.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserProfileResponseDto {

    @Schema(description = "이름", example = "홍길동")
    private String name;

    @Schema(description = "이메일", example = "test@email.com")
    private String email;

    @Schema(description = "변경할 프로필 이미지 URL", example = "https://cdn.moai.com/profiles/user123.png")
    private String profileImageUrl;

    @Schema(description = "로그인 타입", example = "GOOGLE/KAKAO/LOCAL")
    private String providerType;

    @Schema(description = "가입일", example = "2024-08-04T12:34:56")
    private LocalDateTime createdAt;
}
