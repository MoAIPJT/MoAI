package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.domain.user.config.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.domain.user.dto.request.UserLoginRequest;
import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequest;
import com.foureyes.moai.backend.domain.user.dto.response.UserLoginResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserProfileResponse;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.exception.CustomException;
import com.foureyes.moai.backend.domain.user.exception.ErrorCode;
import com.foureyes.moai.backend.domain.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @Override
    public UserSignupResponse signup(UserSignupRequest request) {
        // 이메일 중복 확인
        if (userMapper.findByEmail(request.getEmail()) != null) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(request.getPassword());

        // User 객체 생성 및 값 세팅
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encodedPw);
        user.setName(request.getName());
        user.setProvider("LOCAL");
//        user.setIsVerified(false); // 처음 가입 시 인증 안됨
//        user.setIsDeleted(false);
        user.setRefreshToken("temp_refresh_token");
        userMapper.insertUser(user);

        return new UserSignupResponse(user.getId(), "회원가입 성공! 이메일 인증을 완료해주세요.");
    }

    // 로그인
    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        User user = userMapper.findByEmail(request.getEmail());

        if (user == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        // AccessToken, RefreshToken 발급
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        // RefreshToken DB에 저장
        userMapper.updateRefreshToken(user.getId(), refreshToken);

        return new UserLoginResponse(accessToken, refreshToken, "로그인 성공!");
    }

    // 로그아웃
    @Override
    public void logout(String token) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        int userId = jwtTokenProvider.getUserId(token);
        userMapper.updateRefreshToken(userId, null);
    }

    // 회원 정보 조회
    @Override
    public UserProfileResponse getProfile(int userId) {
        User user = userMapper.findById(userId);

        if (user == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        return new UserProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getCreatedAt()
        );
    }
}
