package com.foureyes.moai.backend.domain.user.config.jwt;

import com.foureyes.moai.backend.domain.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

    // SecretKey 생성 (HMAC-SHA256)
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes(StandardCharsets.UTF_8));
    }

//    public String generateToken(User user, Duration expiredAt) {
//        Date now = new Date();
//        return makeToken(new Date(now.getTime() + expiredAt.toMillis()), user);
//    }

    // AccessToken 발급 (60분)
    public String generateAccessToken(User user) {
        return generateToken(user, Duration.ofMinutes(60));
    }

    // RefreshToken 발급 (14일)
    public String generateRefreshToken(User user) {
        return generateToken(user, Duration.ofDays(14));
    }

    // JWT 토큰 생성 메서드
    private String generateToken(User user, Duration expiredAt) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiredAt.toMillis());

        return Jwts.builder()
            .header().type("JWT").and()  // header typ 설정
            .issuer(jwtProperties.getIssuer())  // 발급자
            .issuedAt(now)                     // 발급 시간
            .expiration(expiry)                // 만료 시간
            .subject(String.valueOf(user.getId()))  // subject에 userId 저장
            .claim("email", user.getEmail())    // email은 claim으로
            .signWith(getSigningKey())              // 서명
            .compact();
    }

    // JWT 토큰 유효성 검증 메서드
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey()) // 서명 키 설정
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
    public Authentication getAuthentication(String token) {
        Claims claims = getClaims(token);
        Set<SimpleGrantedAuthority> authorities = Collections.singleton(
            new SimpleGrantedAuthority("ROLE_USER")
        );

        // Spring Security의 UserDetails 객체 생성
        org.springframework.security.core.userdetails.User principal =
            new org.springframework.security.core.userdetails.User(
                claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    // 토큰 기반으로 유저 ID를 가져오는 메서드
    public int getUserId(String token) {
        return Integer.parseInt(getClaims(token).getSubject());
    }

    private Claims getClaims(String token) {

        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
