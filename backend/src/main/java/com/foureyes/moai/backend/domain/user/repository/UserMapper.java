package com.foureyes.moai.backend.domain.user.repository;

import com.foureyes.moai.backend.domain.user.entity.User;

public interface UserMapper {
    User selectByEmail(String email);
    void insertUser(User user);
}
