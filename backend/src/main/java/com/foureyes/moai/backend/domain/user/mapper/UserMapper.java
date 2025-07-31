package com.foureyes.moai.backend.domain.user.mapper;

import com.foureyes.moai.backend.domain.user.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    void insertUser(User user);
    User findByEmail(String email);
}
