// domain/study/session/dto/request/OpenSessionRequest.java
package com.foureyes.moai.backend.domain.study.session.dto.request;

import com.foureyes.moai.backend.domain.study.session.entity.StudySession;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "세션 열기 요청")
public class OpenSessionRequest {

    @Schema(description = "플랫폼 (LIVEKIT/OPENVIDU). 미지정 시 LIVEKIT", example = "LIVEKIT")
    private StudySession.Platform platform;

    public StudySession.Platform platformOrDefault() {
        return (platform == null) ? StudySession.Platform.LIVEKIT : platform;
    }
}
