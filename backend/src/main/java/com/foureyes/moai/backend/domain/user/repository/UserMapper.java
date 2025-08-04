package com.foureyes.moai.backend.domain.user.repository;

import com.foureyes.moai.backend.domain.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    int insertUser(User user);
    User findByEmail(String email);
    int updateRefreshToken(@Param("userId") int userId, @Param("refreshToken") String refreshToken);
    User findById(int id);
}
