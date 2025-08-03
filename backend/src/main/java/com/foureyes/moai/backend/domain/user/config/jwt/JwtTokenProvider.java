package com.foureyes.moai.backend.domain.user.config.jwt;

import com.foureyes.moai.backend.domain.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    public String generateToken(User user, Duration expiredAt) {
        Date now = new Date();
        return makeToken(new Date(now.getTime() + expiredAt.toMillis()), user);
    }

    // JWT 토큰 생성 메서드
    private String makeToken(Date expiry, User user){
        Date now = new Date();

        // SecretKey 생성 (HMAC-SHA256)
        SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
            .header().type("JWT").and()  // header typ 설정
            .issuer(jwtProperties.getIssuer())  // 발급자
            .issuedAt(now)                     // 발급 시간
            .expiration(expiry)                // 만료 시간
            .subject(user.getEmail())          // sub에 이메일 저장
            .claim("userId", user.getId())     // 커스텀 claim 추가 가능
            .signWith(key)                     // 서명
            .compact();
    }

    // JWT 토큰 유효성 검증 메서드
    public boolean validateToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes(StandardCharsets.UTF_8));
        try {
            Jwts.parser()
                .verifyWith(key) // 서명 키 설정
                .build()
                .parseSignedClaims(token); // JWT를 파싱 및 검증
            return true; // 검증 성공
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            System.out.println("JWT 토큰이 만료됨");
        } catch (io.jsonwebtoken.security.SignatureException e) {
            System.out.println("JWT 서명 검증 실패");
        } catch (Exception e) {
            System.out.println("JWT 검증 실패");
        }
        return false;
    }

    // 토큰 기반으로 인증 정보를 가져오는 메서드
//    public Authentication getAuthentication(String token) {
//        Claims claims = getClaims(token);
//        Set<SimpleGrantedAuthority> authorities = Collections.singleton(
//            new SimpleGrantedAuthority("ROLE_USER")
//        );
//
//        // Spring Security의 UserDetails 객체 생성
//        org.springframework.security.core.userdetails.User principal =
//            new org.springframework.security.core.userdetails.User(
//                claims.getSubject(), "", authorities);
//
//        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
//    }

    // 토큰 기반으로 유저 ID를 가져오는 메서드
    public int getUserId(string Token) {
        Claims claims = getClaims(token);
        return claims.get("id", Integer.class);
    }

//    private Claims getClaims(string token) {
//        SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes(StandardCharsets.UTF_8));
//
//        return Jwts.parser()
//            .verifyWith(key)   // 새로운 방식
//            .build()
//            .parseSignedClaims(token)
//            .getPayload(); // getBody() 대신 getPayload() 사용
//    }
}
