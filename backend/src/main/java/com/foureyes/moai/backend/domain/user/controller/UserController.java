package com.foureeyes.moai.backend.domain.user.controller;

import com.foureeyes.moai.backend.domain.user.dto.request.UserSignupRequestDto;
import com.foureeyes.moai.backend.domain.user.entity.User;
import com.foureeyes.moai.backend.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserSignupRequestDto dto) {
        userService.signup(dto);
        return ResponseEntity.ok("회원가입 완료!");
    }

    @GetMapping("/{email}")
    public ResponseEntity<User> getUser(@PathVariable String email) {
        return ResponseEntity.ok(userService.findByEmail(email));
    }
}
