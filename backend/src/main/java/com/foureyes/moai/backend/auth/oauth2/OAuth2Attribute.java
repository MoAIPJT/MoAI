package com.foureyes.moai.backend.auth.oauth2;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.Map;

@ToString
@Builder
@Getter
public class OAuth2Attribute {
    private Map<String, Object> attributes;
    private String attributeKey;
    private String email;
    private String name;
    private String picture;

    /**
     * 입력: provider, attributeKey, attributes
     * 출력: OAuth2Attribute
     * 기능: 각 OAuth2 공급자에 맞는 속성 매핑 로직을 호출
     */
    static OAuth2Attribute of(String provider, String attributeKey, Map<String, Object> attributes) {
        switch (provider) {
            case "google":
                return ofGoogle(attributeKey, attributes);
            default:
                throw new RuntimeException();
        }
    }

    /**
     * 입력: attributeKey, attributes
     * 출력: OAuth2Attribute
     * 기능: 구글 사용자 정보로부터 OAuth2Attribute 객체를 생성
     */
    private static OAuth2Attribute ofGoogle(String attributeKey, Map<String, Object> attributes) {
        return OAuth2Attribute.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .picture((String) attributes.get("picture"))
                .attributeKey(attributeKey)
                .attributes(attributes)
                .build();
    }
}
