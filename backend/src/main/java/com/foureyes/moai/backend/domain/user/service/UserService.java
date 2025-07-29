package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequestDto;
import com.foureyes.moai.backend.domain.user.entity.User;

public interface UserService {
    void signup(UserSignupRequestDto dto);
    User findByEmail(String email);
}
