package com.foureyes.moai.backend.domain.study.service;


import com.foureyes.moai.backend.domain.study.dto.request.CreateStudyRequest;
import com.foureyes.moai.backend.domain.study.dto.response.StudyListResponseDto;
import com.foureyes.moai.backend.domain.study.dto.response.StudyMemberListResponseDto;
import com.foureyes.moai.backend.domain.study.dto.response.StudyResponseDto;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface StudyService {
    StudyResponseDto createStudy(int userId, CreateStudyRequest request);
    void sendJoinRequest(int userId, int studyGroupId) throws BadRequestException;
    List<StudyMemberListResponseDto> getStudyMembers(int userId, int studyId);
    List<StudyListResponseDto> getUserStudies(int userId);
    void leaveStudy(int userId, int studyId);
    void deleteMember(int adminUserId, int studyId, int targetUserId);
    void changeMemberRole(int adminUserId, int studyId, int targetUserId, String newRole);
}
