package com.foureyes.moai.backend.auth.oauth2;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoogleOAuthService {

    private static final Logger log = LoggerFactory.getLogger(GoogleOAuthService.class);
    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    @Value("${spring.security.oauth2.client.provider.google.token-uri}")
    private String tokenUri;

    @Value("${spring.security.oauth2.client.provider.google.user-info-uri}")
    private String userInfoUri;

    /**
     * 입력: authorization code
     * 출력: accessToken, refreshToken
     * 기능: 구글 로그인 전체 프로세스를 처리. code로 Access Token을 받고, 사용자 정보 조회 후 JWT 토큰 발급
     */
    public Map<String, String> processGoogleLogin(String code) {
        String accessToken = getAccessToken(code);
        Map<String, Object> userInfo = getUserInfo(accessToken);

        User user = saveOrUpdateUser(userInfo);

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user);

        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);
        tokens.put("refreshToken", newRefreshToken);

        return tokens;
    }

    /**
     * 입력: authorization code
     * 출력: Google Access Token
     * 기능: code를 사용하여 Google API로부터 Access Token을 받아옴
     */
    private String getAccessToken(String code) {
        Map<String, String> params = new HashMap<>();
        params.put("code", code);
        params.put("client_id", clientId);
        params.put("client_secret", clientSecret);
        params.put("redirect_uri", redirectUri);
        params.put("grant_type", "authorization_code");

        try {
            log.warn("sending redirect URI: {}", redirectUri);
            Map<String, Object> response = restTemplate.postForObject(tokenUri, params, Map.class);
            if (response == null || !response.containsKey("access_token")) {
                throw new CustomException(ErrorCode.OAUTH2_PROCESSING_ERROR);
            }
            return (String) response.get("access_token");
        } catch (HttpClientErrorException e) {
            log.error("Error while getting access token from Google: {}", e.getMessage());
            throw new CustomException(ErrorCode.OAUTH2_PROCESSING_ERROR);
        }
    }

    /**
     * 입력: Google Access Token
     * 출력: 사용자 정보(Map)
     * 기능: Access Token을 사용하여 Google API로부터 사용자 정보를 조회
     */
    private Map<String, Object> getUserInfo(String accessToken) {
        try {
            Map<String, Object> userInfo = restTemplate.getForObject(userInfoUri + "?access_token=" + accessToken, Map.class);
            if (userInfo == null) {
                throw new CustomException(ErrorCode.OAUTH2_PROCESSING_ERROR);
            }
            return userInfo;
        } catch (HttpClientErrorException e) {
            log.error("Error while getting user info from Google: {}", e.getMessage());
            throw new CustomException(ErrorCode.OAUTH2_PROCESSING_ERROR);
        }
    }

    /**
     * 입력: 사용자 정보(Map)
     * 출력: User 엔티티
     * 기능: DB에서 이메일로 사용자를 조회하고, 없으면 새로 생성하여 저장
     */
    private User saveOrUpdateUser(Map<String, Object> userInfo) {
        String email = (String) userInfo.get("email");
        if (email == null) {
            throw new CustomException(ErrorCode.OAUTH2_PROCESSING_ERROR);
        }
        Optional<User> userOptional = userRepository.findByEmail(email);

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update user info if needed
            user.setName((String) userInfo.get("name"));
        } else {
            user = new User();
            user.setEmail(email);
            user.setName((String) userInfo.get("name"));
            user.setProviderType("GOOGLE");
            user.setVerified(true); // Social login users are considered verified
        }
        return userRepository.save(user);
    }
}
