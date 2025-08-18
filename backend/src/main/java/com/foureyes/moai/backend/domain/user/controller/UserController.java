package com.foureyes.moai.backend.domain.user.controller;

import com.foureyes.moai.backend.commons.mail.EmailType;
import com.foureyes.moai.backend.commons.mail.EmailVerificationService;
import com.foureyes.moai.backend.domain.user.dto.request.*;
import com.foureyes.moai.backend.domain.user.dto.response.UserLoginResponseDto;
import com.foureyes.moai.backend.domain.user.dto.response.UserProfileResponseDto;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponseDto;
import com.foureyes.moai.backend.domain.user.security.CustomUserDetails;
import com.foureyes.moai.backend.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * User API - 회원 관리 컨트롤러
 */
@RestController
@RequestMapping("/users")
@Tag(name = "User API", description = "회원 관리 API")
@RequiredArgsConstructor
public class UserController {

    // ===== SLF4J Logger =====
    private static final org.slf4j.Logger log =
        org.slf4j.LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;

    /**
     * 입력: UserSignupRequest
     * 출력: UserSignupResponse
     * 기능: 회원가입
     */
    @Operation(summary = "회원가입",
        description = "새로운 사용자를 회원가입 시킵니다.")
    @PostMapping("/signup")
    public ResponseEntity<UserSignupResponseDto>
    signup(@Valid @RequestBody UserSignupRequestDto request) {
        log.info("[POST] /users/signup 요청 - email={}", request.getEmail());
        UserSignupResponseDto response = userService.signup(request);
        log.info("회원가입 완료 - Status={}", response.getStatus());
        return ResponseEntity.ok(response);
    }

    /**
     * 입력: email, code(query)
     * 출력: String(메시지)
     * 기능: 이메일 인증 완료 처리
     */
    @Operation(summary = "이메일 인증",
        description = "이메일로 받은 링크를 통해 인증을 완료합니다.")
    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String email,
                                              @RequestParam String code) {
        log.info("[GET] /users/verify-email - email={}", email);

        boolean verified = emailVerificationService.verifyCode(email, EmailType.VERIFY, code);
        if (!verified) {
            log.warn("이메일 인증 실패 - email={}, reason=invalid_or_expired_code", email);
            return ResponseEntity.badRequest().body("유효하지 않거나 만료된 인증 링크입니다.");
        }

        userService.markEmailAsVerified(email);
        emailVerificationService.removeCode(email, EmailType.VERIFY);
        log.info("이메일 인증 완료 - email={}", email);
        return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
    }

    /**
     * 입력: UserLoginRequest
     * 출력: UserLoginResponse(JWT 등)
     * 기능: 로그인
     */
    @Operation(summary = "로그인",
        description = "이메일과 비밀번호로 로그인합니다.")
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> login(@Valid @RequestBody UserLoginRequestDto request) {
        log.info("[POST] /users/login 요청 - email={}", request.getEmail());
        UserLoginResponseDto response = userService.login(request);
        log.info("로그인 성공");
        return ResponseEntity.ok(response);
    }

    /**
     * 입력: RefreshTokenRequestDto
     * 출력: UserLoginResponseDto
     * 기능: 유효한 Refresh Token으로 Access/Refresh Token을 재발급
     */
    @Operation(summary = "토큰 재발급",
        description = "유효한 Refresh Token으로 Access/Refresh Token을 재발급합니다.")
    @PostMapping("/refresh")
    public ResponseEntity<UserLoginResponseDto> refresh(
        @Valid @RequestBody RefreshTokenRequestDto request) {
        return ResponseEntity.ok(userService.refresh(request.getRefreshToken()));
    }

    /**
     * 입력: 인증 사용자(@AuthenticationPrincipal)
     * 출력: String(메시지)
     * 기능: 로그아웃
     */
    @Operation(
        summary = "로그아웃",
        description = "인증된 사용자 기준으로 로그아웃합니다.",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@AuthenticationPrincipal CustomUserDetails user) {
        if (user == null) {
            log.warn("[POST] /users/logout - 인증 정보 없음");
            return ResponseEntity.status(401).body("인증 정보가 없습니다.");
        }
        log.info("[POST] /users/logout - userId={}", user.getId());
        userService.logout(user.getId());
        return ResponseEntity.ok("로그아웃 성공");

    }

    /**
     * 입력: PasswordResetEmailRequest
     * 출력: String(메시지)
     * 기능: 비밀번호 재설정 메일 발송
     */
    @Operation(summary = "비밀번호 재설정 메일 요청",
        description = "가입된 이메일로 비밀번호 재설정 링크를 발송합니다.")
    @PostMapping("/reset-password/request")
    public ResponseEntity<String>
        requestPasswordReset(@Valid @RequestBody PasswordResetEmailRequestDto request) {
        log.info("[POST] /users/reset-password/request - email={}", request.getEmail());
        userService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok("비밀번호 재설정 메일을 전송했습니다.");
    }

    /**
     * 입력: email, code(query)
     * 출력: String(메시지)
     * 기능: 비밀번호 재설정 토큰(코드) 유효성 검증
     */
    @Operation(summary = "비밀번호 재설정 토큰 검증",
        description = "이메일 링크 클릭 시 토큰 유효성만 검증합니다.")
    @GetMapping("/reset-password/verify")
    public ResponseEntity<String> verifyResetToken(@RequestParam String email,
                                                   @RequestParam("code") String token) {
        log.info("[GET] /users/reset-password/verify - email={}", email);
        try {
            userService.verifyPasswordResetToken(email, token);
            return ResponseEntity.ok("유효한 링크입니다.");
        } catch (Exception e) {
            log.warn("비밀번호 재설정 토큰 검증 실패 - email={}, reason={}", email, e.getMessage());
            return ResponseEntity.badRequest().body("유효하지 않거나 만료된 링크입니다.");
        }
    }

    /**
     * 입력: PasswordResetRequest(email, token, newPassword)
     * 출력: String(메시지)
     * 기능: 비밀번호 재설정
     */
    @Operation(summary = "비밀번호 재설정",
        description = "이메일 링크를 통해 들어온 페이지에서 비밀번호를 변경합니다.")
    @PatchMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody PasswordResetRequestDto request) {
        log.info("[PATCH] /users/reset-password - email={}", request.getEmail());
        userService.resetPassword(request.getEmail(), request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
    }

    /**
     * 입력: 인증 사용자
     * 출력: UserProfileResponse
     * 기능: 내 프로필 조회
     */
    @Operation(
        summary = "회원 정보 조회",
        description = "로그인한 사용자의 프로필 정보를 조회합니다.",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDto>
        getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        if (user == null) {
            log.warn("[GET] /users/profile - 인증 정보 없음");
            return ResponseEntity.status(401).build();
        }
        log.info("[GET] /users/profile - userId={}", user.getId());
        return ResponseEntity.ok(userService.getProfile(user.getId()));
    }

    /**
     * 입력: 인증 사용자, UserProfileUpdateRequest
     * 출력: UserProfileResponse
     * 기능: 내 프로필 수정
     */
    @Operation(
        summary = "회원 정보 수정",
        description = "사용자 정보를 수정합니다.",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @PatchMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public ResponseEntity<UserProfileResponseDto> updateUserProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @ModelAttribute UserProfileUpdateRequestDto request) {
        if (user == null) {
            log.warn("[PATCH] /users/profile - 인증 정보 없음");
            return ResponseEntity.status(401).build();
        }
        log.info("[PATCH] /users/profile - userId={}", user.getId());
        UserProfileResponseDto response = userService.updateUserProfile(user.getId(), request);
        return ResponseEntity.ok(response);
    }

    /**
     * 입력: 인증 사용자, PasswordChangeRequest
     * 출력: UserLoginResponse(새 토큰)
     * 기능: 비밀번호 변경
     */
    @Operation(
        summary = "비밀번호 변경",
        description = "사용자 비밀번호를 수정합니다.",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @PatchMapping("/profile/change-password")
    public ResponseEntity<UserLoginResponseDto>
        changePassword(@AuthenticationPrincipal CustomUserDetails user,
                       @Valid @RequestBody PasswordChangeRequestDto request) {
        if (user == null) {
            log.warn("[PATCH] /users/profile/change-password - 인증 정보 없음");
            return ResponseEntity.status(401).build();
        }
        log.info("[PATCH] /users/profile/change-password - userId={}", user.getId());
        UserLoginResponseDto tokens = userService.changePassword(user.getId(), request);
        return ResponseEntity.ok(tokens);
    }

    /**
     * 입력: 인증 사용자
     * 출력: String(메시지)
     * 기능: 회원 탈퇴(논리/물리 삭제는 서비스 레이어 정책 따름)
     */
    @Operation(
        summary = "회원 탈퇴",
        description = "사용자 정보를 완전히 삭제합니다.",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    @DeleteMapping("/profile")
    public ResponseEntity<String> deleteUser(@AuthenticationPrincipal CustomUserDetails user) {
        if (user == null) {
            log.warn("[DELETE] /users/profile - 인증 정보 없음");
            return ResponseEntity.status(401).body("인증 정보가 없습니다.");
        }
        log.info("[DELETE] /users/profile - userId={}", user.getId());
        userService.deleteUserById(user.getId());
        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }
}
