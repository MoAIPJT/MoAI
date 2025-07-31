package com.foureyes.moai.backend.domain.user.exception;

public enum ErrorCode {
    EMAIL_ALREADY_EXISTS("이미 존재하는 이메일입니다."),
    USER_NOT_FOUND("존재하지 않는 회원입니다."),
    INVALID_PASSWORD("비밀번호가 일치하지 않습니다."),
    INVALID_REQUEST("잘못된 요청입니다.");

    private final String message;
    ErrorCode(String message) { this.message = message; }
    public String getMessage() { return message; }
}
