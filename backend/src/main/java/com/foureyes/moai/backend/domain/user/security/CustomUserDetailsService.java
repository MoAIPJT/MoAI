package com.foureyes.moai.backend.domain.user.security;

import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = Optional.ofNullable(userMapper.findByEmail(email))
            .orElseThrow(() -> new UsernameNotFoundException("해당 이메일로 등록된 유저가 없습니다: " + email));

        return new CustomUserDetails(user);
    }
}
