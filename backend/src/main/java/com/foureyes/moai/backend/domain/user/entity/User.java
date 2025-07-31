package com.foureyes.moai.backend.domain.user.entity;

import java.time.LocalDateTime;

public class User {
    private int id;
    private String email;
    private String password;
    private String name;
    private String provider;
    private String providerId;
    private String profileImage;
    private Boolean isVerified;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String profileImageUrl;  // 필드명 수정


    public User() {} // MyBatis 매핑용 기본 생성자

    public User(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.provider = "LOCAL";
        this.isVerified = false;
        this.isDeleted = false;
    }

    // Getter (setter는 필요한 경우만 추가)
    public int getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public String getProvider() { return provider; }
    public String getProviderId() { return providerId; }
    public String getProfileImage() { return profileImage; }
    public Boolean getIsVerified() { return isVerified; }
    public Boolean getIsDeleted() { return isDeleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(int id) { this.id = id; }
}
