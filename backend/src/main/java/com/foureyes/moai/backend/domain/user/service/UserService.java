package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.domain.user.dto.request.UserLoginRequest;
import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequest;
import com.foureyes.moai.backend.domain.user.dto.response.UserLoginResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserProfileResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponse;


public interface UserService {
    UserSignupResponse signup(UserSignupRequest request);
    UserLoginResponse login(UserLoginRequest request);
    void logout(String token);
    UserProfileResponse getProfile(int userId);

}
