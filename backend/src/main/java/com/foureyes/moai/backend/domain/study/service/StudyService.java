package com.foureyes.moai.backend.domain.study.service;


import com.foureyes.moai.backend.domain.study.dto.request.CreateStudyRequest;
import com.foureyes.moai.backend.domain.study.dto.response.StudyMemberListResponseDto;
import com.foureyes.moai.backend.domain.study.dto.response.StudyResponseDto;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface StudyService {
    StudyResponseDto createStudy(int userId, CreateStudyRequest request);
    void sendJoinRequest(int userId, int studyGroupId) throws BadRequestException;
    /** 스터디 멤버 목록 조회 */
    List<StudyMemberListResponseDto> getStudyMembers(int userId, int studyId);
}
