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
    private String provider;
    private String providerId;
    private String profileImage;
    private Boolean isVerified;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String profileImageUrl;  // 필드명 수정
}
