package com.foureyes.moai.backend.domain.user.exception;

public enum ErrorCode {
    EMAIL_ALREADY_EXISTS("이미 존재하는 이메일입니다."),
    INVALID_REQUEST("잘못된 요청입니다."),

    USER_NOT_FOUND("등록되지 않은 이메일입니다."),
    INVALID_PASSWORD("비밀번호가 올바르지 않습니다."),
    TOKEN_EXPIRED("JWT 토큰이 만료되었습니다."),
    INVALID_TOKEN("유효하지 않은 JWT 토큰입니다."),
    TOKEN_SIGNATURE_INVALID("JWT 서명 검증에 실패했습니다.");

    private final String message;
    ErrorCode(String message) { this.message = message; }
    public String getMessage() { return message; }
}
