// domain/study/session/dto/response/SessionResponse.java
package com.foureyes.moai.backend.domain.study.session.dto.response;

import com.foureyes.moai.backend.domain.study.session.entity.StudySession;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "세션 메타 정보 응답")
public class SessionResponse {

    @Schema(description = "세션 ID", example = "101")
    private Long id;

    @Schema(description = "스터디 그룹 ID", example = "42")
    private Long studyGroupId;

    @Schema(description = "플랫폼", example = "LIVEKIT")
    private StudySession.Platform platform;

    @Schema(description = "룸 이름", example = "study-42")
    private String roomName;

    @Schema(description = "새로 생성되었는지 여부", example = "true")
    private boolean created;
}
