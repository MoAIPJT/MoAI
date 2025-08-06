package com.foureyes.moai.backend.domain.study.service;


import com.foureyes.moai.backend.domain.study.dto.request.CreateStudyRequest;
import com.foureyes.moai.backend.domain.study.dto.response.StudyResponseDto;
import org.apache.coyote.BadRequestException;

public interface StudyService {
    StudyResponseDto createStudy(int userId, CreateStudyRequest request);
    void sendJoinRequest(int userId, int studyGroupId) throws BadRequestException;
}
