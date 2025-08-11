package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.domain.user.dto.request.PasswordChangeRequest;
import com.foureyes.moai.backend.domain.user.dto.request.UserLoginRequest;
import com.foureyes.moai.backend.domain.user.dto.request.UserProfileUpdateRequest;
import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequest;
import com.foureyes.moai.backend.domain.user.dto.response.UserLoginResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserProfileResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponse;


public interface UserService {

    UserSignupResponse signup(UserSignupRequest request);
    UserLoginResponse login(UserLoginRequest request);
    void logout(Integer userId);
    UserProfileResponse getProfile(Integer userId);
    void markEmailAsVerified(String email);
    void requestPasswordReset(String email);
    void verifyPasswordResetToken(String email, String token);
    void resetPassword(String email, String token, String newPassword);
    UserLoginResponse changePassword(Integer userId, PasswordChangeRequest request);
    void deleteUserById(Integer userId);
    UserProfileResponse updateUserProfile(Integer userId, UserProfileUpdateRequest request);
}
