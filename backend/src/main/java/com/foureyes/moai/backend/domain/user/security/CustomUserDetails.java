package com.foureyes.moai.backend.domain.user.security;

import com.foureyes.moai.backend.domain.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;

import java.util.Collection;
import java.util.Collections;

/**
 * Spring Security 인증 객체로 사용할 CustomUserDetails.
 * User 엔티티를 감싸서 인증 후 사용자 정보를 쉽게 꺼낼 수 있도록 한다.
 */
@Getter
public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    public int getId() {
        return user.getId();
    }

    public String getEmail() {
        return user.getEmail();
    }

    public String getName() {
        return user.getName();
    }

    public String getProviderType() {
        return user.getProviderType();
    }

    public String getProfileImageUrl() {
        return user.getProfileImageUrl();
    }

    public boolean isVerified() {
        return user.isVerified();
    }

    public LocalDateTime getCreatedAt() {
        return user.getCreatedAt();
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(() -> "ROLE_USER");
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

