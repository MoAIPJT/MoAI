package com.foureyes.moai.backend.domain.session.service;

import com.foureyes.moai.backend.domain.session.dto.response.CloseSessionResponseDto;
import com.foureyes.moai.backend.domain.session.dto.response.JoinSessionResponseDto;
import com.foureyes.moai.backend.domain.session.dto.response.ParticipantsResponseDto;
import com.foureyes.moai.backend.domain.session.dto.response.SessionResponseDto;

public interface StudySessionService {
    SessionResponseDto openOrGetByHashId(String studyHashId, int meUserId);
    JoinSessionResponseDto joinByHashId(String studyHashId, int meUserId);
    CloseSessionResponseDto closeByHashId(String studyHashId, int meUserId);
    ParticipantsResponseDto listParticipantsByHashId(String studyHashId, int meUserId);
}
