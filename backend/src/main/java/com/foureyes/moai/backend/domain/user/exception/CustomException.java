package com.foureyes.moai.backend.domain.user.exception;

public class CustomException extends RuntimeException {
    private final ErrorCode errorCode;
    public CustomException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
    public ErrorCode getErrorCode() { return errorCode; }
}
