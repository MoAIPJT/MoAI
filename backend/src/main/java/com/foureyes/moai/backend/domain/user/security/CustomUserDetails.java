package com.foureyes.moai.backend.domain.user.security;

import com.foureyes.moai.backend.domain.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override // 권한 반환
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한이 따로 없으면 ROLE_USER 기본 제공
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override // 사용자의 패스워드 반환
    public String getPassword() {
        return user.getPassword();
    }

    @Override  // 사용자의 이메일 반환
    public String getUsername() {
        return user.getEmail(); // 로그인 시 email을 username으로 사용
    }

    @Override // 계정 만료 여부 반환
    public boolean isAccountNonExpired() {
        return true; // 계정 만료 여부 (true = 만료되지 않음)
    }

    @Override // 패스워드의 만료 여부 반환
    public boolean isCredentialsNonExpired() {
        // 패스워드가 만료되었는지 확인하는 로직
        return true; // 비밀번호 만료 여부
    }

}
