package com.foureyes.moai.backend.domain.session.service;

import com.foureyes.moai.backend.domain.session.dto.response.SessionResponseDto;

public interface StudySessionService {
    SessionResponseDto openOrGetByHashId(String studyHashId, int meUserId);
}
