# 프론트엔드 회원가입/로그인 테스트 서버

이 서버는 프론트엔드의 회원가입과 로그인 기능을 테스트하기 위한 간단한 Express.js 서버입니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 서버 실행
npm start
```

서버는 `http://localhost:3001`에서 실행됩니다.

## API 엔드포인트

### 회원가입
- **POST** `/register`
- **요청 본문:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123",
    "name": "홍길동",
    "passwordConfirm": "password123"
  }
  ```
- **응답:**
  ```json
  {
    "email": "test@example.com",
    "name": "홍길동",
    "password": "password123",
    "passwordConfirm": "password123"
  }
  ```

### 로그인
- **POST** `/login`
- **요청 본문:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **응답:**
  ```json
  {
    "email": "test@example.com",
    "name": "홍길동",
    "profile_image_url": "https://via.placeholder.com/150",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 토큰 갱신
- **POST** `/auth/refresh`
- **요청 본문:**
  ```json
  {
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **응답:**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 로그아웃
- **POST** `/auth/logout`
- **응답:**
  ```json
  {
    "success": true,
    "message": "로그아웃이 완료되었습니다."
  }
  ```

### 사용자 정보 조회
- **GET** `/api/auth/me`
- **헤더:** `Authorization: Bearer <access_token>`
- **응답:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "email": "test@example.com",
        "name": "홍길동"
      }
    }
  }
  ```

### 사용자 목록 조회 (테스트용)
- **GET** `/api/users`
- **응답:**
  ```json
  {
    "success": true,
    "data": {
      "users": [
        {
          "id": 1,
          "email": "test@example.com",
          "name": "홍길동",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "count": 1
    }
  }
  ```

### 서버 상태 확인
- **GET** `/api/health`
- **응답:**
  ```json
  {
    "success": true,
    "message": "서버가 정상적으로 실행 중입니다.",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

## 특징

- **메모리 기반 저장소**: 서버 재시작 시 데이터가 초기화됩니다.
- **JWT 토큰**: 액세스 토큰(24시간)과 리프레시 토큰(7일)을 제공합니다.
- **비밀번호 해시화**: bcrypt를 사용하여 비밀번호를 안전하게 저장합니다.
- **CORS 지원**: 프론트엔드에서 API 호출이 가능합니다.
- **기존 프론트엔드 호환**: 기존 authService와 호환되는 응답 형식을 제공합니다.

## 테스트 방법

1. 서버를 실행합니다: `npm start`
2. 프론트엔드에서 회원가입/로그인 기능을 테스트합니다.
3. 브라우저 개발자 도구의 Network 탭에서 API 요청/응답을 확인할 수 있습니다.

## 주의사항

- 이 서버는 테스트용이므로 프로덕션 환경에서는 사용하지 마세요.
- 실제 프로덕션에서는 데이터베이스 연결, 보안 강화, 에러 처리 등을 추가해야 합니다. 