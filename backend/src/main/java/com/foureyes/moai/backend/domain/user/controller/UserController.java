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
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@Tag(name = "User API", description = "회원 관리 API") // Swagger Test용 Annotation
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "회원가입", description = "새로운 사용자를 회원가입 시킵니다.")
    @PostMapping("/signup")
    public ResponseEntity<UserSignupResponse> signup(@Valid @RequestBody UserSignupRequest request) {
        return ResponseEntity.ok(userService.signup(request));
    }

    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@Valid @RequestBody UserLoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @Operation(summary = "로그아웃",
        description = "Access Token을 기반으로 로그아웃합니다.",
        security = { @SecurityRequirement(name = "bearerAuth") })
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        userService.logout(token);
        return ResponseEntity.ok("로그아웃 성공!");
    }

    @Operation(summary = "프로필 조회",
        description = "로그인한 사용자의 프로필 정보를 조회합니다.",
        security = { @SecurityRequirement(name = "bearerAuth") })
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int userId = (int) auth.getPrincipal();

        return ResponseEntity.ok(userService.getProfile(userId));
    }


    @Operation(summary = "Swagger 테스트용 API", description = "Swagger가 정상 동작하는지 확인용 API")
    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Swagger 테스트 성공!");
    }
}

