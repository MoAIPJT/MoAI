// domain/study/session/service/LiveKitAdminClient.java
package com.foureyes.moai.backend.domain.study.session.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

// (선택) LiveKit은 첫 참가 시 방 자동 생성이 가능하므로 이 클래스는 생략 가능.
// 필요 시 RoomServiceClient(gRPC)를 이용해 사전 생성할 수 있다.
@Component
@RequiredArgsConstructor
public class LiveKitAdminClient {

    @Value("${livekit.ws-url}") private String wsUrl;     // 필요 시 노출용
    @Value("${livekit.api.key}") private String apiKey;
    @Value("${livekit.api.secret}") private String apiSecret;

    public void ensureRoom(String roomName) {
        // 필요 시 RoomServiceClient 로 사전 생성 구현.
        // v0.9.0 서버 SDK 기준, gRPC 클라이언트 생성 → createRoom(roomName).
        // 현재는 생략(첫 참가 시 자동생성).
    }
}
