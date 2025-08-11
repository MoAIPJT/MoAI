package com.foureyes.moai.backend.commons.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    // 400 Bad Request
    EMAIL_ALREADY_EXISTS("이미 존재하는 이메일입니다.", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST("잘못된 요청입니다.", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD("비밀번호가 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    ALREADY_JOINED_STUDY("이미 가입 요청중입니다.", HttpStatus.BAD_REQUEST),
    FILE_UPLOAD_FAILED("파일 업로드에 실패했습니다.", HttpStatus.BAD_REQUEST),
    STUDY_NOT_MEMBER("해당 스터디에 참여 중이지 않습니다.",    HttpStatus.BAD_REQUEST),
    DUPLICATE_RESOURCE("이미 존재하는 데이터입니다.",HttpStatus.CONFLICT),

    // 401 Unauthorized

    INVALID_TOKEN("유효하지 않은 토큰입니다.", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED("JWT 토큰이 만료되었습니다.", HttpStatus.UNAUTHORIZED),
    TOKEN_SIGNATURE_INVALID("JWT 서명 검증에 실패했습니다.", HttpStatus.UNAUTHORIZED),

    // 403 Forbidden
    FORBIDDEN_DOCUMENT_ACCESS("문서에 접근할 권한이 없습니다.",HttpStatus.FORBIDDEN),
    FORBIDDEN("권한이 없습니다.", HttpStatus.FORBIDDEN),

    // 404 Not Found
    USER_NOT_FOUND("등록되지 않은 이메일입니다.", HttpStatus.NOT_FOUND),
    STUDY_GROUP_NOT_FOUND("존재하지 않는 스터디 그룹입니다.", HttpStatus.NOT_FOUND),
    STUDY_MEMBERSHIP_NOT_FOUND("스터디 멤버 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    SUMMARY_NOT_FOUND("존재하지 않는 요약본입니다.", HttpStatus.NOT_FOUND),
    DOCUMENT_NOT_FOUND("파일을 찾을 수 없습니다",HttpStatus.NOT_FOUND ),
    CATEGORY_NOT_FOUND("카테고리를 찾을 수 없습니다.",HttpStatus.NOT_FOUND ),
    // 500 Internal Server Error
    FILE_DOWNLOAD_FAILED("파일 다운 실패",HttpStatus.INTERNAL_SERVER_ERROR ),
    DATABASE_ERROR("데이터베이스 처리 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_SERVER_ERROR("서버 내부 오류입니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_DELETE_FAILED("파일삭제 실패",HttpStatus.INTERNAL_SERVER_ERROR );
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
