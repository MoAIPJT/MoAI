package com.foureyes.moai.backend.commons.exception;

public class SummaryNotFoundException extends CustomException {
    public SummaryNotFoundException() {
        super(ErrorCode.SUMMARY_NOT_FOUND);
    }
}
