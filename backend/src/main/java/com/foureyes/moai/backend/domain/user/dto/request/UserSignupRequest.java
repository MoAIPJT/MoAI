package com.foureyes.moai.backend.domain.user.dto.request;


import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSignupRequest {
    String email;
    String password;
    String name;
}
