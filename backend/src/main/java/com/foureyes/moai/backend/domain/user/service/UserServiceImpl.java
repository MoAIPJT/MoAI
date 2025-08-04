package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.domain.user.dto.request.UserLoginRequest;
import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequest;
import com.foureyes.moai.backend.domain.user.dto.response.UserLoginResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserProfileResponse;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import com.foureyes.moai.backend.domain.user.repository.UserMapper;
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
        try {
        // 이메일 중복 확인
            if (userMapper.findByEmail(request.getEmail()) != null) {
                throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
            }
            // TODO : 서버 에러 등 Exception 처리 필요

            // 비밀번호 암호화
            String encodedPw = passwordEncoder.encode(request.getPassword());

            // User 객체 생성 및 값 세팅
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(encodedPw);
            user.setName(request.getName());
            user.setProviderType("LOCAL");
            user.setRefreshToken(null);
            userMapper.insertUser(user);

            // DB 저장
            int result = userMapper.insertUser(user);
            if (result != 1) {
                throw new CustomException(ErrorCode.DATABASE_ERROR); // 예: insert 실패
            }

            return new UserSignupResponse();

        } catch (CustomException e) {
                throw e;
        } catch (Exception e) {
                throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    // 로그인
    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        try {


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
            int result = userMapper.updateRefreshToken(user.getId(), refreshToken);
            if (result != 1) {
                throw new CustomException(ErrorCode.DATABASE_ERROR); // DB update 실패
            }

            return new UserLoginResponse(accessToken, refreshToken);

        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    // 로그아웃
    @Override
    public void logout(String token) {
        try {
            if (!jwtTokenProvider.validateToken(token)) {
                throw new CustomException(ErrorCode.INVALID_TOKEN);
            }

            int userId = jwtTokenProvider.getUserId(token);

            int result = userMapper.updateRefreshToken(userId, null);
            if (result != 1) {
                throw new CustomException(ErrorCode.DATABASE_ERROR);
            }

        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    // 회원 정보 조회
    @Override
    public UserProfileResponse getProfile(int userId) {
        try {
            User user = userMapper.findById(userId);
            if (user == null) {
                throw new CustomException(ErrorCode.USER_NOT_FOUND);
            }

            return new UserProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getCreatedAt()
            );
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
