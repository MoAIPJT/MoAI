package com.foureyes.moai.backend.domain.user.service;

import com.foureyes.moai.backend.domain.user.dto.request.PasswordChangeRequestDto;
import com.foureyes.moai.backend.domain.user.dto.request.UserLoginRequestDto;
import com.foureyes.moai.backend.domain.user.dto.request.UserProfileUpdateRequestDto;
import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequestDto;
import com.foureyes.moai.backend.domain.user.dto.response.UserLoginResponseDto;
import com.foureyes.moai.backend.domain.user.dto.response.UserProfileResponseDto;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponseDto;


public interface UserService {

    UserSignupResponseDto signup(UserSignupRequestDto request);
    UserLoginResponseDto login(UserLoginRequestDto request);
    void logout(Integer userId);
    UserProfileResponseDto getProfile(Integer userId);
    void markEmailAsVerified(String email);
    void requestPasswordReset(String email);
    void verifyPasswordResetToken(String email, String token);
    void resetPassword(String email, String token, String newPassword);
    UserLoginResponseDto changePassword(Integer userId, PasswordChangeRequestDto request);
    void deleteUserById(Integer userId);
    UserProfileResponseDto updateUserProfile(Integer userId, UserProfileUpdateRequestDto request);
    UserLoginResponseDto refresh(String refreshToken);
}
