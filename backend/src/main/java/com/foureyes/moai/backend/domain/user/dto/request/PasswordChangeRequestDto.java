package com.foureyes.moai.backend.domain.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordChangeRequestDto {
    @Schema(description = "현재 비밀번호", example = "oldPassword123!")
    @NotBlank String currentPassword;

    @Schema(description = "새 비밀번호", example = "newPassword123!")
    @NotBlank @Size(min = 8, max = 64) String newPassword;

    @Schema(description = "새 비밀번호 확인", example = "newPassword123!")
    @NotBlank String confirmNewPassword;
}
