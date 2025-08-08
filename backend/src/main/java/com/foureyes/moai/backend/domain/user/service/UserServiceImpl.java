package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.domain.user.dto.request.UserLoginRequest;
import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequest;
import com.foureyes.moai.backend.domain.user.dto.response.UserLoginResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserProfileResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponse;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import com.foureyes.moai.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 입력: UserSignupRequest (이메일, 비밀번호, 이름)
     * 출력: UserSignupResponse (회원가입 결과)
     * 기능: 새로운 사용자를 등록하고 비밀번호를 암호화하여 저장
     **/
    @Override
    public UserSignupResponse signup(UserSignupRequest request) {
        log.info("회원가입 시도: email={}", request.getEmail());
        
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("이미 존재하는 이메일로 회원가입 시도: {}", request.getEmail());
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        String encodedPw = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPw)
                .name(request.getName())
                .providerType("LOCAL")
                .build();

        userRepository.save(user);
        log.info("회원가입 완료: email={}", request.getEmail());

        return new UserSignupResponse();
    }

    /**
     * 입력: UserLoginRequest (이메일, 비밀번호)
     * 출력: UserLoginResponse (Access Token, Refresh Token)
     * 기능: 사용자 인증 후 JWT 토큰을 생성하여 반환
     **/
    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        log.info("로그인 시도: email={}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("존재하지 않는 사용자 로그인 시도: {}", request.getEmail());
                    return new CustomException(ErrorCode.USER_NOT_FOUND);
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("잘못된 비밀번호로 로그인 시도: email={}", request.getEmail());
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        user.setRefreshToken(refreshToken);
        userRepository.save(user);
        
        log.info("로그인 성공: email={}, userId={}", request.getEmail(), user.getId());

        return new UserLoginResponse(accessToken, refreshToken);
    }

    /**
     * 입력: String token (JWT Access Token)
     * 출력: void
     * 기능: 사용자를 로그아웃하고 Refresh Token을 무효화
     **/
    @Override
    public void logout(String token) {
        log.info("로그아웃 시도");
        
        if (!jwtTokenProvider.validateToken(token)) {
            log.warn("유효하지 않은 토큰으로 로그아웃 시도");
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        int userId = jwtTokenProvider.getUserId(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("존재하지 않는 사용자 로그아웃 시도: userId={}", userId);
                    return new CustomException(ErrorCode.USER_NOT_FOUND);
                });

        user.setRefreshToken(null);
        userRepository.save(user);
        
        log.info("로그아웃 완료: userId={}", userId);
    }

    /**
     * 입력: int userId (사용자 ID)
     * 출력: UserProfileResponse (사용자 프로필 정보)
     * 기능: 사용자 ID로 프로필 정보를 조회하여 반환
     **/
    @Override
    public UserProfileResponse getProfile(int userId) {
        log.info("프로필 조회 시도: userId={}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("존재하지 않는 사용자 프로필 조회 시도: userId={}", userId);
                    return new CustomException(ErrorCode.USER_NOT_FOUND);
                });

        log.info("프로필 조회 완료: userId={}, email={}", userId, user.getEmail());
        
        return new UserProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}
