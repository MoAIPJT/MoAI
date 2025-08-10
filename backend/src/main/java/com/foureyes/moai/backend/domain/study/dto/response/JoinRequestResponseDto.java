package com.foureyes.moai.backend.domain.study.dto.response;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JoinRequestResponseDto {
    private final int userID;
    private final String userEmail;
    private final String name;
    private final String imageUrl;
    private final String status;
}
