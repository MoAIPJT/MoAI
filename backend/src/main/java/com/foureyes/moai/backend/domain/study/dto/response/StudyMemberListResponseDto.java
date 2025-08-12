package com.foureyes.moai.backend.domain.study.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class StudyMemberListResponseDto {

    @Schema(description = "유저ID", example = "10")
    private final int userId;
    @Schema(description = "유저이름", example = "홍길동")
    private final String member;
    @Schema(description = "권한", example = "Admin")
    private final String role;
    @Schema(description = "맴버 프로필", example = "https://cdn.example.com/images/user_101.png")
    private final String imageUrl;
    @Schema(description = "맴버 이메일", example = "gildo@example.com")
    private final String email;

}
