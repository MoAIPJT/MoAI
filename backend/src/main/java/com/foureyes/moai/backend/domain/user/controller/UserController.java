package com.foureyes.moai.backend.domain.user.controller;

import com.foureyes.moai.backend.domain.user.dto.request.LoginRequest;
import com.foureyes.moai.backend.domain.user.dto.request.UserSignupRequest;
import com.foureyes.moai.backend.domain.user.dto.response.LoginResponse;
import com.foureyes.moai.backend.domain.user.dto.response.UserSignupResponse;
import com.foureyes.moai.backend.domain.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

//    @PostMapping("/signup")
//    public ResponseEntity<UserSignupResponse> signup(@Valid @RequestBody UserSignupRequest request) {
//        return ResponseEntity.ok(userService.signup(request));
//    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }
}

