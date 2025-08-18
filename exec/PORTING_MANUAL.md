# 포팅 매뉴얼 

## 1. Gitlab 소스 클론 이후 빌드 및 배포 가이드

### 1) 사용한 JVM, 웹서버, WAS 제품 등의 종류와 설정 값, 버전(IDE버전 포함)

-   **JVM/Java**: Eclipse Temurin **21**
    
-   **Spring Boot**: **3.5.4** (내장 **Tomcat**)
    
-   **Node / Vite / React**: **Node 20**, **Vite 7**, **React 19**
    
-   **DB**: **MySQL 8.0**, **MongoDB 8.0.9**, **Redis 7.4.4(alpine)**(OpenVidu용 포트 6378)
    
-   **오브젝트 스토리지**: **MinIO 2025.5.24**
    
-   **리버스 프록시**: **Nginx** (HTTPS, `/`→프론트, `/api/`→백엔드, `/caddy/`→OpenVidu 프록시)
    
-   **WebRTC**: **OpenVidu 3.3.0**(ingress/egress 포함), LiveKit 서버 포트 `7880`, RTC `7881/TCP`, `7900–7999/UDP`, TURN `3478/UDP`
    
-   **CI/CD**: **Jenkins LTS (JDK21)**
    
-   **IDE**: IntelliJ IDEA(자바 21 호환 버전)

-   **Docker Engine**: 24.x+

-   **Docker Compose**: v2.x+
    

### 2) 빌드 시 사용되는 환경 변수 등의 내용 상세

**Backend (`application.properties`)**

```
SERVER_PORT
SPRING_DATASOURCE_URL
DB_USERNAME
DB_PASSWORD
SPRING_REDIS_HOST
SPRING_REDIS_PORT
JWT_ISSUER
JWT_SECRET_KEY
JWT_ACCESS_TOKEN_EXPIRATION
JWT_REFRESH_TOKEN_EXPIRATION
SPRING_MAIL_HOST
SPRING_MAIL_PORT
SPRING_MAIL_USERNAME
SPRING_MAIL_PASSWORD
SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE
SPRING_MAIL_DEFAULT_ENCODING
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
API_GMS_KEY
BACKBLAZE_B2_BUCKET_NAME
BACKBLAZE_B2_BUCKET_DOCS_NAME
BACKBLAZE_B2_ACCESS_KEY
BACKBLAZE_B2_SECRET_KEY
BACKBLAZE_B2_REGION
BACKBLAZE_B2_ENDPOINT

```

**Frontend (`.env`)**

```
VITE_API_BASE_URL
VITE_API_URL
VITE_KAKAO_CLIENT_ID
VITE_GOOGLE_OAUTH_CLIENT_ID
VITE_BACKEND_URL
VITE_APP_NAME
NGINX_CONF
LETSENCRYPT

```

**OpenVidu / LiveKit (`openvidu/docker-compose.yml`, `livekit.yaml`, `ingress.yaml`, `egress.yaml`)**

```
LAN_DOMAIN
LAN_PRIVATE_IP
LAN_MODE
USE_HTTPS
CERTIFICATE_TYPE
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
DASHBOARD_ADMIN_USERNAME
DASHBOARD_ADMIN_PASSWORD
MINIO_ACCESS_KEY
MINIO_SECRET_KEY
MONGO_ADMIN_USERNAME
MONGO_ADMIN_PASSWORD
REDIS_PASSWORD
RUN_WITH_SCRIPT

```

### 3) 배포 시 특이사항

-   **공용 네트워크**: `shared-network` (external)
    
-   **기동 순서**: Backend → Frontend+Nginx → OpenVidu → (선택) Jenkins
    
-   **주요 포트**
    
    -   **Frontend/Nginx**: `80/tcp`, `443/tcp`

    -   **Frontend(dev)**: `5173/tcp`

    -   **Backend**: `8080/tcp`

    -   **DB/Cache**: `5050→3306/tcp(MySQL)`, `6379/tcp(Redis 앱)`

    -   **OpenVidu / LiveKit**

        -   **LiveKit API**: `7880` (내부 네트워크 전용, 외부 미노출 — `/caddy/` 경로로 443을 통해 접근)

        -   **RTC(TCP)**: `7881/tcp`

        -   **RTC(UDP 범위)**: `7900–7999/udp`

        -   **TURN**: `3478/udp`

        -   **Ingress**: `1935/tcp`(RTMP), `8085/tcp`(WHIP), `7895/udp`(RTC)

        -   **OV Redis**: `6378/tcp`

    -   **Jenkins(선택)**: `7070/tcp`(UI), `50000/tcp`(agent)
        
-   **리버스 프록시**
    
    -   `/` → `frontend:5173`
        
    -   `/api/` → `backend:8080` (OPTIONS 204 응답 처리)
        
    -   `/caddy/` → `caddy-proxy:7880`
        
    -   인증서 경로(예시): `/etc/letsencrypt/live/<도메인>/fullchain.pem`, `privkey.pem`
        
-   **컨테이너 파일 위치**
    
    -   Backend: `backend/Dockerfile`, `backend/compose.yaml`
        
    -   Frontend: `frontend/Dockerfile`, `frontend/compose.yaml`, `frontend/nginx.conf`
        
    -   OpenVidu: `openvidu/docker-compose.yml`, `openvidu/OpenVidu/{livekit.yaml, ingress.yaml, egress.yaml}`, `openvidu/nginx.conf`
        
    -   Jenkins: `jenkins/Dockerfile`, `jenkins/compose.yaml`
        

### 4) DB 접속 정보 등 프로젝트(ERD)에 활용되는 주요 계정 및 프로퍼티가 정의된 파일 목록

-   **접속/설정 파일**
    
    -   `backend/src/main/resources/application.properties` (datasource, hikari, jpa)
        
    -   `backend/sql-scripts/01_init.sql`
        
    -   `backend/mysql-utf8mb4.cnf`    

----------

## 2. 프로젝트에서 사용하는 외부 서비스 정보

-   **Google OAuth**
    
    -   프론트: `VITE_GOOGLE_OAUTH_CLIENT_ID`
        
    -   백엔드: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`
        
    -   리다이렉트 URI 예: `http://localhost:5173/auth/google/callback`
        
-   **SMTP 메일**
    
    -   `SPRING_MAIL_HOST`, `SPRING_MAIL_PORT`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD`
        
    -   `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH`, `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE`, `SPRING_MAIL_DEFAULT_ENCODING`
        
-   **Backblaze B2**
    
    -   `BACKBLAZE_B2_BUCKET_NAME`, `BACKBLAZE_B2_BUCKET_DOCS_NAME`, `BACKBLAZE_B2_ACCESS_KEY`, `BACKBLAZE_B2_SECRET_KEY`, `BACKBLAZE_B2_REGION`, `BACKBLAZE_B2_ENDPOINT`
        
-   **Redis**
    
    -   애플리케이션: `SPRING_REDIS_HOST`, `SPRING_REDIS_PORT`
        
    -   OpenVidu: `REDIS_PASSWORD` (포트 6378)
        
-   **OpenVidu / LiveKit**
    
    -   `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
        
    -   도메인/IP: `LAN_DOMAIN`, `LAN_PRIVATE_IP`, `LAN_MODE`, `USE_HTTPS`, `CERTIFICATE_TYPE`
        
    -   기록/저장: `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`
        
    -   분석 DB: `MONGO_ADMIN_USERNAME`, `MONGO_ADMIN_PASSWORD`
        
-   **인증서(Nginx/Let’s Encrypt)**
    
    -   `LETSENCRYPT`(볼륨 마운트), 인증서 경로는 서버 설정에 기재


---

# 빌드·배포 추가 준비 사항

## 1) `.env` 파일 배치

> 각 디렉터리의 `docker compose`는 **해당 디렉터리의 `.env`** 를 자동 로드함.

* `exec/backend.env` → **`backend/.env`**
* `exec/frontend.env` → **`frontend/.env`**
* `exec/openvidu.env` → **`openvidu/.env`**
* (선택) Jenkins를 쓴다면 jenkins/.env 에 필요한 값 추가

> 필요 키는 이미 정리한 환경변수 인벤토리를 참고. 값에 공백/특수문자가 있으면 `"값"` 형태로 감싸기.

---

## 2) 인증서·프록시 파일 위치

### A. 프론트엔드 Nginx (메인 리버스 프록시)

* `frontend/.env` 에 **두 변수**가 있어야 함:

  ```env
  NGINX_CONF=./nginx/nginx.local.conf:/etc/nginx/conf.d/default.conf
  LETSENCRYPT=/etc/letsencrypt:/etc/letsencrypt
  ```


### B. OpenVidu 측

* 현재 스택은 `openvidu/docker-compose.yml` 내 **`caddy-proxy`** 가 프록시 역할을 함.
* HTTPS를 사용할 경우 `openvidu/.env` 에 아래 값들을 채움:

  ```env
  USE_HTTPS=true
  CERTIFICATE_TYPE=letsencrypt   # 또는 selfsigned / none
  LAN_DOMAIN=<도메인>
  LAN_PRIVATE_IP=<서버내부IP>    # 필요 시
  LIVEKIT_API_KEY=<키>
  LIVEKIT_API_SECRET=<시크릿>
  ```
* 별도의 `openvidu/nginx.conf` 를 사용할 때는 해당 Nginx 컨테이너에
  **호스트의 `/etc/letsencrypt`** 를 **컨테이너 `/etc/letsencrypt`** 로 마운트하고,
  conf 안의 인증서 경로(`/etc/letsencrypt/live/<도메인>/...`)가 실제 파일과 일치해야 함.

---

## 3) Docker 네트워크 준비

모든 compose 가 같은 브리지 네트워크를 쓰므로 최초 1회만 생성.

```bash
docker network create shared-network || true
```

---

## 4) 실행 순서 (빌드 + 기동)

```bash
# 0) 네트워크
docker network create shared-network || true

# 1) Backend
cd backend
cp ../exec/backend.env ./.env            # 이미 복사했다면 생략
docker compose up -d --build             # mysql, redis 포함 기동
cd ..

# 2) Frontend + Nginx
cd frontend
cp ../exec/frontend.env ./.env           # 이미 복사했다면 생략
docker compose up -d --build
cd ..

# 3) OpenVidu / LiveKit
cd openvidu
cp ../exec/openvidu.env ./.env           # 이미 복사했다면 생략
docker compose up -d --build
cd ..

# 4) (선택) Jenkins
cd jenkins
docker compose up -d --build
cd ..
```

---

## 5) 포트 개방(요약)

-   **웹 진입점**: `80/tcp`, `443/tcp`

-   **프런트 개발 서버**: `5173/tcp`

-   **백엔드 API**: `8080/tcp`

-   **DB/캐시**: `5050→3306/tcp`, `6379/tcp`

-   **OpenVidu/LiveKit**

    -   `7881/tcp` (RTC)

    -   `7900–7999/udp` (RTC용 UDP 범위)

    -   `3478/udp` (TURN)

    -   `1935/tcp`, `8085/tcp`, `7895/udp` (Ingress)

    -   `6378/tcp` (OV Redis)

-   Jenkins(선택): `7070/tcp`, `50000/tcp`

> 참고: 7880(LiveKit API)은 외부로 포워딩되지 않고 내부에서만 사용됩니다.

---

## 6) 빠른 확인

```bash
# 컨테이너 상태
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 프런트 페이지
curl -kI https://<도메인>/

# 백엔드 프록시 경로
curl -kI https://<도메인>/api/
```

> 위 순서대로 `.env` 복사 → 인증서/프록시 마운트 경로 확인 → 네트워크 생성 → compose up 을 실행하면 빌드·배포가 완료됨.
