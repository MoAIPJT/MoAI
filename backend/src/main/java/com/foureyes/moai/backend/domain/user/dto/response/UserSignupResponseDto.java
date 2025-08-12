package com.foureyes.moai.backend.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class UserSignupResponseDto {
    private HttpStatus status;
}
