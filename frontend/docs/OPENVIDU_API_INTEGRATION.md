# OpenVidu 온라인 스터디 API 통합 가이드

## 개요
이 문서는 OpenVidu를 사용한 온라인 스터디 기능의 백엔드 API 통합 방법을 설명합니다.

## 필요한 백엔드 API 엔드포인트

### 1. 온라인 스터디 세션 생성
```
POST /api/openvidu/sessions/create
```

**Request Body:**
```json
{
  "studyId": 123,
  "sessionName": "study-123-1234567890",
  "maxParticipants": 20
}
```

**Response:**
```json
{
  "sessionId": "session_abc123",
  "token": "wss://openvidu-server:4443?sessionId=session_abc123&token=token_xyz789"
}
```

### 2. 기존 세션 참여
```
POST /api/openvidu/sessions/{sessionId}/join
```

**Request Body:**
```json
{
  "studyId": 123
}
```

**Response:**
```json
{
  "token": "wss://openvidu-server:4443?sessionId=session_abc123&token=token_xyz789"
}
```

### 3. 온라인 스터디 상태 확인
```
GET /api/study/{studyId}/online-status
```

**Response:**
```json
{
  "isActive": true,
  "sessionId": "session_abc123",
  "participants": [
    {
      "id": "user_123",
      "name": "홍길동",
      "avatar": "👤",
      "isPublisher": true
    },
    {
      "id": "user_456",
      "name": "김철수",
      "avatar": "👤",
      "isPublisher": false
    }
  ]
}
```

### 4. 세션 종료 (관리자/대리자만)
```
DELETE /api/openvidu/sessions/{sessionId}/end
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

### 5. 세션 떠나기
```
POST /api/openvidu/sessions/{sessionId}/leave
```

**Request Body:**
```json
{
  "studyId": 123
}
```

## WebSocket 연결

### 참여자 실시간 업데이트
```
WebSocket: ws://localhost:8080/ws/study/{studyId}/participants
```

**메시지 타입:**

1. **참여자 입장:**
```json
{
  "type": "PARTICIPANT_JOINED",
  "participant": {
    "id": "user_123",
    "name": "홍길동",
    "avatar": "👤"
  }
}
```

2. **참여자 퇴장:**
```json
{
  "type": "PARTICIPANT_LEFT",
  "participantId": "user_123"
}
```

3. **세션 종료:**
```json
{
  "type": "SESSION_ENDED",
  "sessionId": "session_abc123"
}
```

## 프론트엔드 구현 단계

### 1단계: 기본 UI 구현 ✅
- [x] 온라인 스터디 카드 UI
- [x] 참여자 목록 표시
- [x] 역할별 버튼 표시

### 2단계: OpenVidu 라이브러리 설치
```bash
npm install openvidu-browser
```

### 3단계: 커스텀 훅 구현
- [x] `useOpenViduSession` 훅 생성 (주석 처리됨)
- [ ] 실제 OpenVidu 로직 구현
- [ ] 백엔드 API 연동

### 4단계: 실시간 참여자 관리
- [ ] WebSocket 연결
- [ ] 참여자 입장/퇴장 처리
- [ ] 세션 상태 동기화

### 5단계: 화상회의 UI
- [ ] 비디오/오디오 스트림 표시
- [ ] 화면 공유 기능
- [ ] 채팅 기능

## 보안 고려사항

1. **인증**: 모든 API 요청에 JWT 토큰 필요
2. **권한**: 세션 생성/종료는 ADMIN/DELEGATE만 가능
3. **세션 관리**: 스터디 멤버만 참여 가능
4. **토큰 관리**: OpenVidu 토큰은 일회성 사용

## 에러 처리

### 일반적인 에러 상황
1. **세션 생성 실패**: 권한 부족, 서버 오류
2. **연결 실패**: 네트워크 오류, 토큰 만료
3. **참여 실패**: 세션 만료, 인원 초과
4. **권한 오류**: 역할 부족, 멤버가 아닌 사용자

### 에러 응답 형식
```json
{
  "code": "SESSION_CREATION_FAILED",
  "message": "세션 생성에 실패했습니다.",
  "details": "권한이 부족합니다."
}
```

## 테스트 방법

### 1. 로컬 테스트
```bash
# OpenVidu 서버 실행 (Docker)
docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-server:2.28.0

# 백엔드 서버 실행
./mvnw spring-boot:run

# 프론트엔드 실행
npm run dev
```

### 2. 테스트 시나리오
1. 스터디 생성 및 멤버 초대
2. ADMIN으로 온라인 스터디 시작
3. 다른 멤버로 참여
4. 화상회의 기능 테스트
5. 세션 종료 및 정리

## 참고 자료

- [OpenVidu 공식 문서](https://docs.openvidu.io/)
- [OpenVidu Browser API](https://docs.openvidu.io/en/2.28.0/api/openvidu-browser/)
- [WebRTC 표준](https://webrtc.org/)
- [Spring WebSocket 가이드](https://spring.io/guides/gs/messaging-stomp-websocket/)
