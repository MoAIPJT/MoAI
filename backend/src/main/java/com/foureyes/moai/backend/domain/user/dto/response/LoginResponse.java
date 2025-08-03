package com.foureyes.moai.backend.domain.user.dto.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LoginResponse {
    @ApiModelProperty(value = "사용자 ID")
    private int id;

    @ApiModelProperty(value = "액세스 토큰")
    private String accessToken;
}
