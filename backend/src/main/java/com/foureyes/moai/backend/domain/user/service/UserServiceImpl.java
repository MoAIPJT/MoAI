package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import com.foureyes.moai.backend.commons.mail.EmailService;
import com.foureyes.moai.backend.commons.mail.EmailType;
import com.foureyes.moai.backend.commons.mail.EmailVerificationService;
import com.foureyes.moai.backend.domain.user.dto.request.PasswordChangeRequestDto;
import com.foureyes.moai.backend.domain.user.dto.request.UserLoginRequestDto;
import com.foureyes.moai.backend.domain.user.dto.request.UserProfileUpdateRequestDto;
import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequestDto;
import com.foureyes.moai.backend.domain.user.dto.response.UserLoginResponseDto;
import com.foureyes.moai.backend.domain.user.dto.response.UserProfileResponseDto;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponseDto;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    // SLF4J Logger (snippet: "log")
    private static final org.slf4j.Logger log =
        org.slf4j.LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;

    /**
     * 입력: UserSignupRequest request
     * 출력: UserSignupResponse
     * 기능: 회원가입 처리 후 이메일 인증 코드 생성 및 발송
     */
    @Override
    @Transactional
    public UserSignupResponseDto signup(UserSignupRequestDto request) {
    log.info("[signup] signup requested for email");
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("[signup] email already exists");
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        try {
            final String encodedPw = passwordEncoder.encode(request.getPassword());

            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(encodedPw);
            user.setName(request.getName());
            user.setProviderType("LOCAL");
            user.setVerified(false);
            user.setRefreshToken(null); // 초기에는 리프레시 토큰 없음
            userRepository.save(user);
            // 회원가입 성공 시 userId만 디버그로 남김
            log.debug("[signup] user persisted: id={}", user.getId());

            final String code = emailVerificationService.createVerificationCode(
                user.getEmail(), EmailType.VERIFY);
            emailService.sendVerificationEmail(user.getEmail(), EmailType.VERIFY, code);
            // 인증 메일 발송 성공만 남김
            log.info("[signup] verification mail sent");

            return new UserSignupResponseDto(HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("[signup] internal error", e);
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 입력: UserLoginRequest request
     * 출력: UserLoginResponse(accessToken, refreshToken)
     * 기능: 로그인 처리(비밀번호 검증, 이메일 인증 여부 확인, 토큰 발급/저장)
     */
    @Override
    public UserLoginResponseDto login(UserLoginRequestDto request) {
    log.info("[login] login requested");
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("[login] invalid password");
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        if (!user.isVerified()) {
            log.warn("[login] email not verified");
            throw new CustomException(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        final String accessToken = jwtTokenProvider.generateAccessToken(user);
        final String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        user.setRefreshToken(refreshToken);
        userRepository.save(user);
    // 토큰 발급 및 저장 성공만 남김
    log.info("[login] tokens issued and refresh saved");

        return new UserLoginResponseDto(accessToken, refreshToken);
    }

    /**
     * 입력: String refreshToken
     * 출력: UserLoginResponseDto
     * 기능: 유효한 Refresh Token으로 Access/Refresh Token을 재발급
     */
    @Override
    public UserLoginResponseDto refresh(String refreshToken) {
        log.info("[refresh] refresh token requested");
        // 1) 토큰 형식/서명/만료 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            log.warn("[refresh] invalid or expired refresh token");
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN); // 또는 EXPIRED 등 분리
        }

        // 2) 토큰에서 userId 추출
        int userId = jwtTokenProvider.getUserId(refreshToken);
        log.debug("[refresh] extracted userId from token: {}", userId);

        // 3) DB의 사용자 조회
        User user = userRepository.findById(userId)
            .orElseThrow(() -> {
                log.warn("[refresh] user not found: userId={}", userId);
                return new CustomException(ErrorCode.USER_NOT_FOUND);
            });

        // 4) DB에 저장된 refreshToken과 일치 여부 확인(로테이션/탈취 방지)
        if (user.getRefreshToken() == null || !user.getRefreshToken().equals(refreshToken)) {
            log.warn("[refresh] refresh token mismatch for userId={}", userId);
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        // 5) 새 토큰 발급 (로테이션 권장)
        String newAccess = jwtTokenProvider.generateAccessToken(user);
        String newRefresh = jwtTokenProvider.generateRefreshToken(user);

        // 6) DB에 새 refreshToken 저장
        user.setRefreshToken(newRefresh);
        userRepository.save(user);

        log.info("[refresh] tokens reissued for userId={}", userId);

        // 7) 응답
        return new UserLoginResponseDto(newAccess, newRefresh);
    }


    /**
     * 입력: Integer userId
     * 출력: void
     * 기능: 로그아웃 처리(Refresh Token 제거)
     */
    @Override
    public void logout(Integer userId) {
    log.info("[logout] logout requested: userId={}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("존재하지 않는 사용자 로그아웃 시도: userId={}", userId);
                    return new CustomException(ErrorCode.USER_NOT_FOUND);
                });

        user.setRefreshToken(null);
        userRepository.save(user);
    // 로그아웃 성공만 남김
    log.info("[logout] refresh token cleared");
    }

    /**
     * 입력: Integer userId
     * 출력: UserProfileResponse
     * 기능: 회원 정보 조회
     */
    @Override
    @Transactional
    public UserProfileResponseDto getProfile(Integer userId) {
        log.debug("[getProfile] fetch profile: userId={}", userId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return new UserProfileResponseDto(
            user.getName(),
            user.getEmail(),
            user.getProfileImageUrl(),
            user.getProviderType(),
            user.getCreatedAt()
        );
    }

    /**
     * 입력: String email
     * 출력: void
     * 기능: 이메일 인증 완료 처리(verified=true)
     */
    @Override
    public void markEmailAsVerified(String email) {
        log.info("[markEmailAsVerified] email={}", email);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        user.setVerified(true);
        userRepository.save(user);
        log.info("[markEmailAsVerified] verified set to true");
    }

    /**
     * 입력: String email
     * 출력: void
     * 기능: 비밀번호 재설정 요청(토큰 생성 후 이메일 발송)
     */
    @Override
    public void requestPasswordReset(String email) {
        log.info("[requestPasswordReset] email={}", email);
        userRepository.findByEmail(email)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        final String token = emailVerificationService.createVerificationCode(
            email, EmailType.PASSWORD_RESET);
        emailService.sendVerificationEmail(email, EmailType.PASSWORD_RESET, token);
        log.info("[requestPasswordReset] password reset mail sent");
    }

    /**
     * 입력: String email, String token
     * 출력: void
     * 기능: 비밀번호 재설정 토큰 검증(리셋 페이지 접근 판단)
     */
    @Override
    public void verifyPasswordResetToken(String email, String token) {
        log.debug("[verifyPasswordResetToken] email={}", email);
        userRepository.findByEmail(email)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        emailVerificationService.verifyCode(email, EmailType.PASSWORD_RESET, token);
        log.info("[verifyPasswordResetToken] token verified");
    }

    /**
     * 입력: String email, String token, String newPassword
     * 출력: void
     * 기능: 이메일 인증 후 비밀번호 재설정(토큰 1회성 사용 보장)
     */
    @Override
    @Transactional
    public void resetPassword(String email, String token, String newPassword) {
        log.info("[resetPassword] email={}", email);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 재검증(재사용/탈취 방지)
        emailVerificationService.verifyCode(email, EmailType.PASSWORD_RESET, token);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 토큰 1회성 보장
        emailVerificationService.removeCode(email, EmailType.PASSWORD_RESET);
        log.info("[resetPassword] password updated and token removed");
    }

    /**
     * 입력: Integer userId, UserProfileUpdateRequest request
     * 출력: UserProfileResponse
     * 기능: 회원 정보 수정(이름/프로필 이미지)
     */
    @Override
    @Transactional
    public UserProfileResponseDto updateUserProfile(Integer userId, UserProfileUpdateRequestDto request) {
        log.info("[updateUserProfile] userId={}", userId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // TODO : null 체크를 해야 하는가?
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getProfileImageUrl() != null && !request.getProfileImageUrl().isBlank()) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }

        userRepository.save(user);

        log.debug("[updateUserProfile] updated");
        return new UserProfileResponseDto(
            user.getName(),
            user.getEmail(),
            user.getProfileImageUrl(),
            user.getProviderType(),
            user.getCreatedAt()
        );
    }

    /**
     * 입력: Integer userId, PasswordChangeRequest request
     * 출력: UserLoginResponse(newAccess, newRefresh)
     * 기능: 로그인 상태에서 비밀번호 변경 및 토큰 재발급
     */
    @Override
    @Transactional
    public UserLoginResponseDto changePassword(Integer userId, PasswordChangeRequestDto request) {
    log.info("[changePassword] userId={}", userId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            log.warn("[changePassword] current password mismatch");
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            log.warn("[changePassword] new password confirm mismatch");
            throw new CustomException(ErrorCode.PASSWORD_CONFIRM_MISMATCH);
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            log.warn("[changePassword] new password is same as old");
            throw new CustomException(ErrorCode.PASSWORD_SAME_AS_OLD);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        final String newAccess = jwtTokenProvider.generateAccessToken(user);
        final String newRefresh = jwtTokenProvider.generateRefreshToken(user);
        user.setRefreshToken(newRefresh);
        userRepository.save(user);

        log.info("[changePassword] password changed and tokens reissued");
        return new UserLoginResponseDto(newAccess, newRefresh);
    }

    /**
     * 입력: Integer userId
     * 출력: void
     * 기능: 회원 탈퇴(물리 삭제)
     */
    @Override
    public void deleteUserById(Integer userId) {
    log.info("[deleteUserById] userId={}", userId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        userRepository.delete(user);
        log.info("[deleteUserById] user deleted");
    }
}
