package com.foureyes.moai.backend.domain.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordResetRequest {
    @Schema(description = "사용자 이메일", example = "user@example.com")
    @Email(message = "유효한 이메일 형식이 아닙니다.")
    @NotBlank
    private String email;

    @Schema(description = "비밀번호 재설정 토큰", example = "abcdef123456")
    @NotBlank
    private String token;

    @Schema(description = "새 비밀번호", example = "newPassword123!")
    @NotBlank
    @Size(min = 8, max = 20, message = "비밀번호는 8~20자 사이여야 합니다.")
    private String newPassword;
}
