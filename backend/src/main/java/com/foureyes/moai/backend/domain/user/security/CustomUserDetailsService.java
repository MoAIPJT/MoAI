package com.foureyes.moai.backend.domain.user.security;

import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * 입력: String email
     * 출력: UserDetails
     * 기능: 이메일로 사용자 정보를 조회하여 UserDetails 반환
     **/
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("해당 이메일로 등록된 유저가 없습니다: " + email));

        return new CustomUserDetails(user);
    }

    /**
     * 입력: int id
     * 출력: UserDetails
     * 기능: ID로 사용자 정보를 조회하여 UserDetails 반환
     **/
    public UserDetails loadUserById(int id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("해당 ID의 유저가 없습니다: " + id));
        return new CustomUserDetails(user);
    }
}
