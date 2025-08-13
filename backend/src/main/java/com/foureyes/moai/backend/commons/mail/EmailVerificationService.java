package com.foureyes.moai.backend.commons.mail;

import com.foureyes.moai.backend.commons.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import com.foureyes.moai.backend.commons.exception.ErrorCode;

import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final StringRedisTemplate redisTemplate;

    private static final Duration SIGNUP_EXPIRATION = Duration.ofHours(24); // 24시간
    private static final Duration PASSWORD_RESET_EXPIRATION = Duration.ofMinutes(30); // 30분

    /**
     * 입력: String email, EmailType type
     * 출력: String (생성된 인증 코드)
     * 기능: UUID 인증 코드 생성 및 Redis에 저장
     **/
    public String createVerificationCode(String email, EmailType type) {
        String code = UUID.randomUUID().toString();
        String key = buildKey(email, type);

        Duration expiration = switch (type) {
            case VERIFY -> SIGNUP_EXPIRATION;
            case PASSWORD_RESET -> PASSWORD_RESET_EXPIRATION;
            default -> throw new IllegalArgumentException("지원하지 않는 EmailType입니다.");
        };

        redisTemplate.opsForValue().set(key, code, expiration);
        return code;
    }

    /**
     * 입력: String email, EmailType type, String inputCode
     * 출력: boolean (검증 성공 여부)
     * 기능: 사용자가 입력한 인증 코드와 Redis에 저장된 코드 비교 및 검증
     **/
    public boolean verifyCode(String email, EmailType type, String inputCode) {
        String storedCode = redisTemplate.opsForValue().get(buildKey(email, type));

        if (storedCode == null || !storedCode.equals(inputCode)) {
            throw new CustomException(ErrorCode.EMAIL_VERIFICATION_FAILED);
        }

        return true;
    }

    /**
     * 입력: String email, EmailType type
     * 출력: void
     * 기능: 인증 완료 후 Redis에서 인증 코드 삭제
     **/
    public void removeCode(String email, EmailType type) {
        redisTemplate.delete(buildKey(email, type));
    }

    /**
     * 입력: String email, EmailType type
     * 출력: String (Redis key)
     * 기능: 이메일과 타입을 기반으로 Redis key 생성
     **/
    private String buildKey(String email, EmailType type) {
        return "email-verification:" + type.name().toLowerCase() + ":" + email;
    }
}
