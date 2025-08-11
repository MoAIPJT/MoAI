package com.foureyes.moai.backend.auth.oauth2;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/google")
public class GoogleOAuthController {

    private final GoogleOAuthService googleOAuthService;

    /**
     * 입력: Google API로부터 받은 authorization code
     * 출력: accessToken, refreshToken
     * 기능: authorization code를 사용하여 구글 로그인을 처리하고, JWT 토큰을 발급
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> googleLogin(@RequestBody Map<String, String> requestBody) {
        String code = requestBody.get("code");
        Map<String, String> tokens = googleOAuthService.processGoogleLogin(code);
        return ResponseEntity.ok(tokens);
    }
}
