package com.foureyes.moai.backend.domain.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginRequest {
    @Schema(description = "사용자 이메일", example = "test@email.com")
    private String email;

    @Schema(description = "비밀번호", example = "password123")
    private String password;
}
