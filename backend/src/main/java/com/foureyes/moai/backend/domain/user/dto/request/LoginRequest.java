package com.foureyes.moai.backend.domain.user.dto.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @ApiModelProperty(value = "사용자 이메일", required = true)
    private String email;

    @ApiModelProperty(value = "사용자 비밀번호", required = true)
    private String password;
}
