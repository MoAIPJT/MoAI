package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequest;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponse;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.exception.CustomException;
import com.foureyes.moai.backend.domain.user.exception.ErrorCode;
import com.foureyes.moai.backend.domain.user.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserSignupResponse signup(UserSignupRequest request) {
        if (userMapper.findByEmail(request.email()) != null) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        String encodedPw = passwordEncoder.encode(request.password());
        User user = new User(request.email(), encodedPw, request.name());

        userMapper.insertUser(user);

        return new UserSignupResponse(user.getId(), "회원가입 성공! 이메일 인증을 완료해주세요.");
    }
}
