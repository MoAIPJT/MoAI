const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key';

// 미들웨어
app.use(cors());
app.use(express.json());

// 메모리 기반 사용자 저장소 (실제 프로덕션에서는 데이터베이스 사용)
const users = [];

// 회원가입 API
app.post('/register', async (req, res) => {
  try {
    const { email, password, name, passwordConfirm } = req.body;

    // 필수 필드 검증
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: '이메일, 비밀번호, 이름은 필수입니다.'
      });
    }

    // 비밀번호 확인 검증
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: '비밀번호가 일치하지 않습니다.'
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다.'
      });
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 최소 6자 이상이어야 합니다.'
      });
    }

    // 중복 이메일 확인
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '이미 존재하는 이메일입니다.'
      });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // JWT 토큰 생성
    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 기존 프론트엔드 형식에 맞춘 응답
    res.status(201).json({
      email: newUser.email,
      name: newUser.name,
      password: password,
      passwordConfirm: passwordConfirm
    });

  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 로그인 API
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 필수 필드 검증
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '이메일과 비밀번호는 필수입니다.'
      });
    }

    // 사용자 찾기
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // JWT 토큰 생성
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 기존 프론트엔드 형식에 맞춘 응답
    res.json({
      email: user.email,
      name: user.name,
      profile_image_url: 'https://via.placeholder.com/150',
      access_token: accessToken,
      refresh_token: refreshToken
    });

  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 사용자 정보 조회 API (토큰 검증)
app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '토큰이 필요합니다.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    });

  } catch (error) {
    console.error('토큰 검증 에러:', error);
    res.status(401).json({
      success: false,
      message: '유효하지 않은 토큰입니다.'
    });
  }
});

// 토큰 갱신 API
app.post('/auth/refresh', (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: '리프레시 토큰이 필요합니다.'
      });
    }

    const decoded = jwt.verify(refresh_token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    // 새로운 액세스 토큰 생성
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      access_token: newAccessToken
    });

  } catch (error) {
    console.error('토큰 갱신 에러:', error);
    res.status(401).json({
      success: false,
      message: '유효하지 않은 리프레시 토큰입니다.'
    });
  }
});

// 로그아웃 API
app.post('/auth/logout', (req, res) => {
  // 실제로는 토큰을 블랙리스트에 추가하는 로직이 필요하지만,
  // 테스트용이므로 단순히 성공 응답만 반환
  res.json({
    success: true,
    message: '로그아웃이 완료되었습니다.'
  });
});

// 테스트용 사용자 목록 조회 API
app.get('/api/users', (req, res) => {
  const userList = users.map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  }));

  res.json({
    success: true,
    data: {
      users: userList,
      count: userList.length
    }
  });
});

// 서버 상태 확인 API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '서버가 정상적으로 실행 중입니다.',
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 테스트 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`📝 API 엔드포인트:`);
  console.log(`   POST /register - 회원가입`);
  console.log(`   POST /login - 로그인`);
  console.log(`   POST /auth/refresh - 토큰 갱신`);
  console.log(`   POST /auth/logout - 로그아웃`);
  console.log(`   GET  /api/auth/me - 사용자 정보 조회`);
  console.log(`   GET  /api/users - 사용자 목록 조회`);
  console.log(`   GET  /api/health - 서버 상태 확인`);
}); 