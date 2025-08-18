package com.foureyes.moai.backend.domain.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class UserProfileUpdateRequestDto {


    @Schema(description = "변경할 사용자 닉네임", example = "모아이")
    private String name;

    @Schema(description = "유저 프로필 이미지")
    private MultipartFile image;

}
