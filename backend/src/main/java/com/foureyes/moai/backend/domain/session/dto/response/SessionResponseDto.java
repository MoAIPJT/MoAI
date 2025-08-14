// domain/study/session/dto/response/SessionResponse.java
package com.foureyes.moai.backend.domain.session.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "세션 메타 정보 응답")
public class SessionResponseDto {

    @Schema(description = "세션 ID", example = "101")
    private int id;

    @Schema(description = "스터디 그룹 ID(내부용)", example = "42", deprecated = true)
    private int studyGroupId;

    @Schema(description = "스터디 그룹 Hash ID(외부 노출용)", example = "aB9xZK31")
    private String studyGroupHashId;

    @Schema(description = "룸 이름", example = "study-42")
    private String roomName;

    @Schema(description = "새로 생성되었는지 여부", example = "true")
    private boolean created;
}
