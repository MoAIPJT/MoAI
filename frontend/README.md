# MoAI Frontend

자료 공유 및 AI 요약이 가능한 화상 스터디 서비스 MoAI의 프론트엔드입니다.

## 기술 스택

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **UI Components**: Radix UI
- **Video Conference**: OpenVidu

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수들을 설정하세요:

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080/api

# Backend URL for OAuth redirects
VITE_BACKEND_URL=http://localhost:8080

# OpenVidu Server Configuration
VITE_OPENVIDU_SERVER_URL=https://localhost:4443
VITE_OPENVIDU_SECRET=MY_SECRET

# Social Login Client IDs
VITE_KAKAO_CLIENT_ID=your_kakao_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트 검사
npm run lint
```

## 프로젝트 구조

```
src/
├── components/          # Atomic Design 기반 컴포넌트
│   ├── atoms/          # 기본 UI 요소
│   ├── molecules/      # 복합 UI 요소
│   ├── organisms/      # 독립적인 기능 단위
│   └── templates/      # 페이지 레이아웃
├── pages/              # 페이지 컴포넌트
├── hooks/              # 커스텀 훅
├── services/           # API 서비스
├── store/              # 상태 관리
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── router/             # 라우팅 설정
```

## 주요 기능

- 사용자 인증 (로그인/회원가입)
- 소셜 로그인 (카카오, 구글)
- 화상 회의 (OpenVidu 기반)
- AI 요약 서비스
- 스터디 그룹 관리
- 파일 공유 및 관리

## 개발 가이드

### 컴포넌트 작성 원칙

- Atomic Design 패턴을 따릅니다
- 페이지는 템플릿을 import하여 렌더링합니다
- 재사용 가능한 컴포넌트는 organisms 레이어에 배치합니다

### API 호출

- 모든 API 호출은 `services` 폴더의 서비스 함수를 통해 수행합니다
- 토큰 갱신은 자동으로 처리됩니다
- 에러 처리는 `utils/errorHandler.ts`를 사용합니다

## 문제 해결

### 토큰 관련 문제

- `localStorage`에 `accessToken`과 `refreshToken`이 올바르게 저장되어 있는지 확인
- 백엔드 서버가 실행 중인지 확인
- 환경 변수가 올바르게 설정되어 있는지 확인
