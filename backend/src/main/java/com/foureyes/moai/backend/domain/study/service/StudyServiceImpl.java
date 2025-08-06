package com.foureyes.moai.backend.domain.study.service;

import com.foureyes.moai.backend.commons.util.StorageService;
import com.foureyes.moai.backend.domain.study.dto.request.CreateStudyRequest;
import com.foureyes.moai.backend.domain.study.dto.response.StudyResponseDto;
import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.study.entity.StudyMembership;
import com.foureyes.moai.backend.domain.study.repository.StudyGroupRepository;
import com.foureyes.moai.backend.domain.study.repository.StudyMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StudyServiceImpl implements StudyService {

    private final StudyGroupRepository studyGroupRepository;
    private final StudyMembershipRepository studyMembershipRepository;
    private final StorageService storageService;

    @Override
    @Transactional
    public StudyResponseDto createStudy(int userId, CreateStudyRequest request) {

        String imageUrl = null;
        try {
            imageUrl = storageService.uploadFile(request.getImage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        StudyGroup studyGroup = StudyGroup.builder()
            .name(request.getName())
            .description(request.getDescription())
            .imageUrl(imageUrl)
            .createdBy(userId)
            .createdAt(LocalDateTime.now())
            .build();

        studyGroupRepository.save(studyGroup);

        StudyMembership studyMembership = StudyMembership.builder()
            .userId(userId)
            .studyGroup(studyGroup)
            .role(StudyMembership.Role.ADMIN)
            .status(StudyMembership.Status.APPROVED)
            .joinedAt(LocalDateTime.now())
            .build();
        studyMembershipRepository.save(studyMembership);

        return StudyResponseDto.builder()
            .id(studyGroup.getId())
            .name(studyGroup.getName())
            .description(studyGroup.getDescription())
            .imageUrl(studyGroup.getImageUrl())
            .createdBy(studyGroup.getCreatedBy())
            .createdAt(studyGroup.getCreatedAt())
            .build();
    }

    @Override
    @Transactional
    public void sendJoinRequest(int userId, int studyGroupId) throws BadRequestException {
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "NOT_FOUND_STUDYGROUP_ID=" + studyGroupId));

        if (studyMembershipRepository.existsByUserIdAndStudyGroup(userId, group)) {
            throw new BadRequestException("이미 가입 요청중 입니다");
        }
        StudyMembership req = StudyMembership.builder()
            .userId(userId)
            .studyGroup(group)
            .role(StudyMembership.Role.MEMBER)       // 기본 권한
            .status(StudyMembership.Status.PENDING) // 대기 상태
            .joinedAt(LocalDateTime.now())
            .build();
        studyMembershipRepository.save(req);
    }
}
