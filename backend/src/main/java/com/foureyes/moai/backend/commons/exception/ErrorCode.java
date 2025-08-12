package com.foureyes.moai.backend.commons.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    // 400 Bad Request
    BAD_REQUEST("잘못된 요청입니다.", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTS("이미 존재하는 이메일입니다.", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST("잘못된 요청입니다.", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD("비밀번호가 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    ALREADY_JOINED_STUDY("이미 가입 요청중입니다.", HttpStatus.BAD_REQUEST),
    FILE_UPLOAD_FAILED("파일 업로드에 실패했습니다.", HttpStatus.BAD_REQUEST),
    INVALID_DATETIME("시작 시간이 종료 시간보다 늦을 수 없습니다.", HttpStatus.BAD_REQUEST),
    STUDY_NOT_MEMBER("해당 스터디에 참여 중이지 않습니다.",    HttpStatus.BAD_REQUEST),
    PASSWORD_CONFIRM_MISMATCH("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    PASSWORD_SAME_AS_OLD("새 비밀번호는 현재 비밀번호와 달라야 합니다.", HttpStatus.BAD_REQUEST),
    EMAIL_VERIFICATION_FAILED("이메일 인증 코드가 잘못되었거나 만료되었습니다.", HttpStatus.BAD_REQUEST),
    OAUTH2_TOKEN_ERROR("OAuth2 토큰 처리 중 오류가 발생했습니다.", HttpStatus.BAD_REQUEST),

    // 401 Unauthorized
    INVALID_TOKEN("유효하지 않은 토큰입니다.", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED("JWT 토큰이 만료되었습니다.", HttpStatus.UNAUTHORIZED),
    TOKEN_SIGNATURE_INVALID("JWT 서명 검증에 실패했습니다.", HttpStatus.UNAUTHORIZED),
    INVALID_REFRESH_TOKEN("유효하지 않은 리프레시 토큰입니다.", HttpStatus.UNAUTHORIZED),

    // 403 Forbidden
    FORBIDDEN("권한이 없습니다.", HttpStatus.FORBIDDEN),
    EMAIL_NOT_VERIFIED("이메일 인증이 완료되지 않았습니다.", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("접근 권한이 없습니다.", HttpStatus.UNAUTHORIZED),

    // 404 Not Found
    USER_NOT_FOUND("등록되지 않은 이메일입니다.", HttpStatus.NOT_FOUND),
    STUDY_GROUP_NOT_FOUND("존재하지 않는 스터디 그룹입니다.", HttpStatus.NOT_FOUND),
    STUDY_MEMBERSHIP_NOT_FOUND("스터디 멤버 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    SCHEDULE_NOT_FOUND("일정 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),

    // 500 Internal Server Error
    DATABASE_ERROR("데이터베이스 처리 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    OAUTH2_PROCESSING_ERROR("OAuth2 처리 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_SERVER_ERROR("서버 내부 오류입니다.", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getStatus() {
        return httpStatus;
    }

    public String getCode() {
        return this.name();
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
