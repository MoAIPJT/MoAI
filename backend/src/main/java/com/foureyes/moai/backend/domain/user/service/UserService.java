package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.domain.user.dto.request.LoginRequest;
import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequest;
import com.foureyes.moai.backend.domain.user.dto.response.LoginResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponse;

public interface UserService {
//    UserSignupResponse signup(UserSignupRequest request);
    LoginResponse login(LoginRequest request);
}
