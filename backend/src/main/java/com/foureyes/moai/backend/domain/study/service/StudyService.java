package com.foureyes.moai.backend.domain.study.service;


import com.foureyes.moai.backend.domain.study.dto.request.CreateStudyRequest;
import com.foureyes.moai.backend.domain.study.dto.response.StudyResponseDto;

public interface StudyService {
    StudyResponseDto createStudy(int userId, CreateStudyRequest request);
}
