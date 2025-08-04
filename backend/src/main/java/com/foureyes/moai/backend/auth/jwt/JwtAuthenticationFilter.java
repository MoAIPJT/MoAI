package com.foureyes.moai.backend.auth.jwt;

import com.foureyes.moai.backend.auth.jwt.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
        throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // 토큰이 없거나 Bearer로 시작하지 않으면 다음 필터로 넘어감
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        // 토큰 검증
        if (jwtTokenProvider.validateToken(token)) {
            int userId = jwtTokenProvider.getUserId(token); // subject에서 userId를 가져옴

            // Authentication 객체 생성
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                    userId, // principal로 userId를 넣음
                    null,
                    null // 권한 설정 필요시 SimpleGrantedAuthority 추가 가능
                );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            // IP 로깅 등에 활용, 보안, 확장성 고려한 Details 설정

            // SecurityContext에 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
