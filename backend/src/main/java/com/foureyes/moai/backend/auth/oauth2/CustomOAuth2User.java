package com.foureyes.moai.backend.auth.oauth2;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.Collection;
import java.util.Map;

@Getter
public class CustomOAuth2User extends DefaultOAuth2User {

    private int id;

    /**
     * 입력: authorities, attributes, nameAttributeKey, id
     * 출력: CustomOAuth2User 인스턴스
     * 기능: CustomOAuth2User 객체를 생성
     */
    public CustomOAuth2User(Collection<? extends GrantedAuthority> authorities,
                            Map<String, Object> attributes,
                            String nameAttributeKey,
                            int id) {
        super(authorities, attributes, nameAttributeKey);
        this.id = id;
    }

    public static CustomOAuth2UserBuilder builder() {
        return new CustomOAuth2UserBuilder();
    }

    public static class CustomOAuth2UserBuilder {
        private Collection<? extends GrantedAuthority> authorities;
        private Map<String, Object> attributes;
        private String nameAttributeKey;
        private int id;

        CustomOAuth2UserBuilder() {
        }

        public CustomOAuth2UserBuilder authorities(Collection<? extends GrantedAuthority> authorities) {
            this.authorities = authorities;
            return this;
        }

        public CustomOAuth2UserBuilder attributes(Map<String, Object> attributes) {
            this.attributes = attributes;
            return this;
        }

        public CustomOAuth2UserBuilder nameAttributeKey(String nameAttributeKey) {
            this.nameAttributeKey = nameAttributeKey;
            return this;
        }

        public CustomOAuth2UserBuilder id(int id) {
            this.id = id;
            return this;
        }

        public CustomOAuth2User build() {
            return new CustomOAuth2User(this.authorities, this.attributes, this.nameAttributeKey, this.id);
        }

        public String toString() {
            return "CustomOAuth2User.CustomOAuth2UserBuilder(authorities=" + this.authorities + ", attributes=" + this.attributes + ", nameAttributeKey=" + this.nameAttributeKey + ", id=" + this.id + ")";
        }
    }
}
