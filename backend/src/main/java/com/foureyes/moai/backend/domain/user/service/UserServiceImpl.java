package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequest;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponse;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.exception.CustomException;
import com.foureyes.moai.backend.domain.user.exception.ErrorCode;
import com.foureyes.moai.backend.domain.user.mapper.UserMapper;
import org.jetbrains.annotations.NotNull;
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
        // 이메일 중복 확인
        if (userMapper.findByEmail(request.getEmail()) != null) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(request.getPassword());

        // User 객체 생성 및 값 세팅
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encodedPw);
        user.setName(request.getName());
        user.setProvider("LOCAL");
//        user.setIsVerified(false); // 처음 가입 시 인증 안됨
//        user.setIsDeleted(false);
        user.setRefreshToken("temp_refresh_token");
        userMapper.insertUser(user);

        return new UserSignupResponse(user.getId(), "회원가입 성공! 이메일 인증을 완료해주세요.");
    }
}
