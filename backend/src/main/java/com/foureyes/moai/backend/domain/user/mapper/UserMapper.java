package com.foureyes.moai.backend.domain.user.mapper;

import com.foureyes.moai.backend.domain.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    void insertUser(User user);
    User findByEmail(String email);
    void updateRefreshToken(@Param("userId") int userId, @Param("refreshToken") String refreshToken);
    User findById(int id);
}
