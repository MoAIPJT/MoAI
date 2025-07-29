package com.foureyes.moai.backend.domain.user.dto.request;

import com.foureyes.moai.backend.domain.user.entity.User;
import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSignupRequestDto {
    private String email;
    private String password;
    private String name;

    public User toEntity(){
        return User.builder()
            .email(email)
            .password(password)
            .name(name)
            .build();
    }
}
