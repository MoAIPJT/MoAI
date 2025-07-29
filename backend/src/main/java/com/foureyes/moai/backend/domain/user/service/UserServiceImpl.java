package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequestDto;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.repository.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserMapper userMapper;

    @Override
    public void signup(UserSignupRequestDto dto) {
        // 이메일 중복 체크
        if (userMapper.selectByEmail(dto.getEmail()) != null) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }
        userMapper.insertUser(dto.toEntity());
    }

    @Override
    public User findByEmail(String email) {
        return userMapper.selectByEmail(email);
    }
}
