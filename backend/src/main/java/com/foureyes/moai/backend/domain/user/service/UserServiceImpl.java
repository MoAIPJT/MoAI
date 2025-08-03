package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.domain.user.dto.request.LoginRequest;
import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequest;
import com.foureyes.moai.backend.domain.user.dto.response.LoginResponse;
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

//    @Override
//    public UserSignupResponse signup(UserSignupRequest request) {
//        if (userMapper.findByEmail(request.getEmail()) != null) {
//            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
//        }
//
//        String encodedPw = passwordEncoder.encode(request.getPassword());
//        User user = new User(request.getEmail(), encodedPw, request.getName());
//
//        userMapper.insertUser(user);
//
//        return new UserSignupResponse(user.getId(), "회원가입 성공! 이메일 인증을 완료해주세요.");
//    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userMapper.findByEmail(request.getEmail());
        if (user == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        // For now, returning a dummy token. I'll implement JWT later.
        return LoginResponse.builder()
                .id(user.getId())
                .accessToken("dummy-token")
                .build();
    }
}
