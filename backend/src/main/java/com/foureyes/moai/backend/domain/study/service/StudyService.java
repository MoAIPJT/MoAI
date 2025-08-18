package com.foureyes.moai.backend.domain.study.service;


import com.foureyes.moai.backend.domain.study.dto.request.CreateStudyRequest;
import com.foureyes.moai.backend.domain.study.dto.request.UpdateStudyRequestDto;
import com.foureyes.moai.backend.domain.study.dto.response.*;

import java.util.List;

public interface StudyService {
    StudyResponseDto createStudy(int userId, CreateStudyRequest request);
    void sendJoinRequest(int userId, int studyGroupId);
    List<StudyMemberListResponseDto> getStudyMembers(int userId, int studyId);
    List<StudyListResponseDto> getUserStudies(int userId);
    void leaveStudy(int userId, int studyId);
    void deleteMember(int adminUserId, int studyId, int targetUserId);
    void changeMemberRole(int adminUserId, int studyId, int targetUserId, String newRole);
    void rejectJoinRequest(int adminUserId, int studyId, int targetUserId);
    void acceptJoinRequest(int adminUserId, int studyId, int targetUserId, String newRole);
    List<JoinRequestResponseDto> getPendingJoinRequests(int adminUserId, int studyId);
    List<JoinStudyListResponseDto> getJoinedStudies(int userId);
    StudyDetailResponseDto getStudyDetailByHashId(int userId, String hashId);
    StudyNoticeResponseDto getStudyNotice(int userId, int studyId);
    void updateStudyNotice(int userId, int studyId, String notice);
    void updateStudyGroup(int userId, int studyId, UpdateStudyRequestDto request);
}
