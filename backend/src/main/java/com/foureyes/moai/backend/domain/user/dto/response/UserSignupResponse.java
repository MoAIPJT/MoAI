package com.foureyes.moai.backend.domain.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSignupResponse {

    @Schema(description = "회원 ID", example = "1")
    int id;

    @Schema(description = "응답 메시지", example = "회원가입 성공! 이메일 인증을 완료해주세요.")
    String message;
}
