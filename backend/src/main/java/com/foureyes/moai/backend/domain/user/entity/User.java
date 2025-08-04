package com.foureyes.moai.backend.domain.user.entity;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private int id;
    private String email;
    private String password;
    private String name;
    private String providerType;
    private LocalDateTime createdAt;
    private String profileImageUrl;
    private String refreshToken;
}
