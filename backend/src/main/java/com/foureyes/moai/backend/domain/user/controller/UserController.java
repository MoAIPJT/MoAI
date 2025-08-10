package com.foureyes.moai.backend.domain.user.controller;

import com.foureyes.moai.backend.domain.user.dto.request.UserLoginRequest;
import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequest;
import com.foureyes.moai.backend.domain.user.dto.response.UserLoginResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserProfileResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponse;
import com.foureyes.moai.backend.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "User API", description = "회원 관리 API")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    /**
     * 입력: UserSignupRequest (회원가입 요청 정보)
     * 출력: UserSignupResponse (회원가입 결과)
     * 기능: 새로운 사용자를 회원가입 처리
     **/
    @Operation(summary = "회원가입", description = "새로운 사용자를 회원가입 시킵니다.")
    @PostMapping("/signup")
    public ResponseEntity<UserSignupResponse> signup(@Valid @RequestBody UserSignupRequest request) {
        log.info("회원가입 API 호출: email={}", request.getEmail());
        UserSignupResponse response = userService.signup(request);
        log.info("회원가입 API 응답 완료");
        return ResponseEntity.ok(response);
    }

    /**
     * 입력: UserLoginRequest (로그인 요청 정보)
     * 출력: UserLoginResponse (JWT 토큰 정보)
     * 기능: 사용자 로그인 처리 및 JWT 토큰 발급
     **/
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@Valid @RequestBody UserLoginRequest request) {
        log.info("로그인 API 호출: email={}", request.getEmail());
        UserLoginResponse response = userService.login(request);
        log.info("로그인 API 응답 완료");
        return ResponseEntity.ok(response);
    }

    /**
     * 입력: Authorization Header (Bearer Token)
     * 출력: String (로그아웃 성공 메시지)
     * 기능: 사용자 로그아웃 처리 및 Refresh Token 무효화
     **/
    @Operation(summary = "로그아웃",
        description = "Access Token을 기반으로 로그아웃합니다.",
        security = { @SecurityRequirement(name = "bearerAuth") })
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        log.info("로그아웃 API 호출");
        String token = authHeader.replace("Bearer ", "");
        userService.logout(token);
        log.info("로그아웃 API 응답 완료");
        return ResponseEntity.ok("로그아웃 성공");
    }

    /**
     * 입력: Authentication (인증된 사용자 정보)
     * 출력: UserProfileResponse (사용자 프로필 정보)
     * 기능: 로그인한 사용자의 프로필 정보 조회
     **/
    @Operation(summary = "프로필 조회",
        description = "로그인한 사용자의 프로필 정보를 조회합니다.",
        security = { @SecurityRequirement(name = "bearerAuth") })
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int userId = (int) auth.getPrincipal();
        
        log.info("프로필 조회 API 호출: userId={}", userId);
        UserProfileResponse response = userService.getProfile(userId);
        log.info("프로필 조회 API 응답 완료");

        return ResponseEntity.ok(response);
    }

    /**
     * 입력: 없음
     * 출력: String (테스트 메시지)
     * 기능: Swagger API 테스트용 엔드포인트
     **/
    @Operation(summary = "Swagger 테스트용 API",
        description = "Swagger가 정상 동작하는지 확인용 API")
    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        log.info("Swagger 테스트 API 호출");
        return ResponseEntity.ok("Swagger 테스트 성공");
    }
}

