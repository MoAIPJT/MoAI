# 1. Node.js 공식 이미지 사용 (최신 LTS 권장)
FROM node:20

# 2. 작업 디렉터리 생성
WORKDIR /app

# 3. package.json과 lock 파일 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 나머지 소스코드 복사
COPY . .

# 6. 포트 오픈 (Vite 기본 포트: 5173)
EXPOSE 5173

# 7. 개발 서버 실행
CMD ["npm", "run", "dev"]

