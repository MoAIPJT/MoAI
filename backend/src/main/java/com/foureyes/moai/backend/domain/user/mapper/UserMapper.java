package com.foureyes.moai.backend.domain.user.mapper;

import com.foureyes.moai.backend.domain.user.entity.User;

public interface UserMapper {
    void insertUser(User user);
    User findByEmail(String email);
}
