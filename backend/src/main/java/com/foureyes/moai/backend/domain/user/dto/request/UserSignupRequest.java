package com.foureyes.moai.backend.domain.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserSignupRequest(
    @Email @NotBlank String email,
    @NotBlank String password,
    @NotBlank String name
) {}
