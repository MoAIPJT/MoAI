package com.foureyes.moai.backend.domain.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordResetEmailRequest {
    @Schema(description = "사용자 이메일", example = "user@example.com")
    @Email(message = "유효한 이메일 형식이 아닙니다.")
    @NotBlank
    private String email;
}
