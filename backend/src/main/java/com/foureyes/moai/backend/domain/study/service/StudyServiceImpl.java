package com.foureyes.moai.backend.domain.study.service;

import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import com.foureyes.moai.backend.commons.util.StorageService;
import com.foureyes.moai.backend.domain.study.dto.request.CreateStudyRequest;
import com.foureyes.moai.backend.domain.study.dto.response.*;
import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.study.entity.StudyMembership;
import com.foureyes.moai.backend.domain.study.repository.StudyGroupRepository;
import com.foureyes.moai.backend.domain.study.repository.StudyMembershipRepository;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.hashids.Hashids;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyServiceImpl implements StudyService {

    private final StudyGroupRepository studyGroupRepository;
    private final StudyMembershipRepository studyMembershipRepository;
    private final StorageService storageService;
    private final UserRepository userRepository;
    private final Hashids hashids;

    @Override
    @Transactional
    public StudyResponseDto createStudy(int userId, CreateStudyRequest request) {

        String imageUrl = null;
        try {
            imageUrl = storageService.uploadFile(request.getImage());
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
        }
        StudyGroup studyGroup = StudyGroup.builder()
            .name(request.getName())
            .description(request.getDescription())
            .imageUrl(imageUrl)
            .createdBy(userId)
            .createdAt(LocalDateTime.now())
            .maxCapacity(request.getMaxCapacity())
            .build();

        StudyGroup saved = studyGroupRepository.save(studyGroup);

        String encoded = hashids.encode(saved.getId());
        saved.setHashId(encoded);

        studyGroupRepository.save(saved);

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
    public void sendJoinRequest(int userId, int studyGroupId) {
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_GROUP_NOT_FOUND));

        if (studyMembershipRepository.existsByUserIdAndStudyGroup(userId, group)) {
            throw new CustomException(ErrorCode.ALREADY_JOINED_STUDY);
        }
        StudyMembership req = StudyMembership.builder()
            .userId(userId)
            .studyGroup(group)
            .role(StudyMembership.Role.MEMBER)
            .status(StudyMembership.Status.PENDING)
            .joinedAt(LocalDateTime.now())
            .build();
        studyMembershipRepository.save(req);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudyMemberListResponseDto> getStudyMembers(int userId, int studyId) {
        boolean joined = studyMembershipRepository
            .existsByUserIdAndStudyGroup_IdAndStatus(userId,studyId,StudyMembership.Status.APPROVED);
        if (!joined){
            throw new CustomException(ErrorCode.STUDY_NOT_MEMBER);
        }
        return studyMembershipRepository
            .findAllByStudyGroup_IdAndStatus(studyId, StudyMembership.Status.APPROVED)
            .stream()
            .map(membership -> {
                User user = userRepository.findById(membership.getUserId())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

                return StudyMemberListResponseDto.builder()
                    .member(user.getName())
                    .role(membership.getRole().name())
                    .build();
            })
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudyListResponseDto> getUserStudies(int userId) {
        List<StudyMembership.Status> statuses = List.of(
            StudyMembership.Status.PENDING,
            StudyMembership.Status.APPROVED
        );

        return studyMembershipRepository
            .findAllByUserIdAndStatusIn(userId, statuses)
            .stream()
            .map(m -> StudyListResponseDto.builder()
                .name(m.getStudyGroup().getName())
                .description(m.getStudyGroup().getDescription())
                .imageUrl(m.getStudyGroup().getImageUrl())
                .creatorName(
                    userRepository.findById(m.getStudyGroup().getCreatedBy())
                    .map(User::getName)
                    .orElse("Unknown"))
                .status(m.getStatus().name())
                .studyId(m.getStudyGroup().getId())
                .hashId(m.getStudyGroup().getHashId())
                .build())
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void leaveStudy(int userId, int studyId) {
        StudyMembership membership = studyMembershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(
                userId, studyId, StudyMembership.Status.APPROVED)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_NOT_MEMBER));
        membership.setStatus(StudyMembership.Status.LEFT);
        studyMembershipRepository.save(membership);
    }

    @Override
    @Transactional
    public void deleteMember(int adminUserId, int studyId, int targetUserId) {
        StudyMembership adminMember = studyMembershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(
                adminUserId, studyId, StudyMembership.Status.APPROVED)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_NOT_MEMBER));

        if (adminMember.getRole() != StudyMembership.Role.ADMIN) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        StudyMembership targetMember = studyMembershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(
                targetUserId, studyId, StudyMembership.Status.APPROVED)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_MEMBERSHIP_NOT_FOUND));

        targetMember.setStatus(StudyMembership.Status.LEFT);
        studyMembershipRepository.save(targetMember);
    }

    @Override
    @Transactional
    public void changeMemberRole(int adminUserId, int studyId, int targetUserId, String newRole) {
        StudyMembership adminMembership = studyMembershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(
                adminUserId, studyId, StudyMembership.Status.APPROVED)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_NOT_MEMBER));

        if (adminMembership.getRole() != StudyMembership.Role.ADMIN) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        //변경 대상 멤버 조회 (APPROVED 상태)
        StudyMembership targetMembership = studyMembershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(
                targetUserId, studyId, StudyMembership.Status.APPROVED)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_MEMBERSHIP_NOT_FOUND));

        //새로운 역할 enum 변환
        StudyMembership.Role roleEnum;
        try {
            roleEnum = StudyMembership.Role.valueOf(newRole);
        } catch (IllegalArgumentException e) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        //만약 새 역할이 ADMIN 이면, 기존 ADMIN → MEMBER 로 강등
        if (roleEnum == StudyMembership.Role.ADMIN) {
            adminMembership.setRole(StudyMembership.Role.MEMBER);
            studyMembershipRepository.save(adminMembership);
        }

        //대상 멤버 역할 변경 및 저장
        targetMembership.setRole(roleEnum);
        studyMembershipRepository.save(targetMembership);
    }

    @Override
    @Transactional
    public void rejectJoinRequest(int adminUserId, int studyId, int targetUserId) {
        StudyMembership adminMembership = studyMembershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(
                adminUserId, studyId, StudyMembership.Status.APPROVED)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_NOT_MEMBER));

        if (adminMembership.getRole() != StudyMembership.Role.ADMIN) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        //거절 대상이 PENDING 상태인지 조회
        StudyMembership target = studyMembershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(
                targetUserId, studyId, StudyMembership.Status.PENDING)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_MEMBERSHIP_NOT_FOUND));

        //상태를 REJECTED로 변경
        target.setStatus(StudyMembership.Status.REJECTED);
        studyMembershipRepository.save(target);
    }

    @Override
    @Transactional
    public void acceptJoinRequest(int adminUserId, int studyId, int targetUserId, String newRole) {
        StudyMembership admin = studyMembershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(
                adminUserId, studyId, StudyMembership.Status.APPROVED)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_NOT_MEMBER));
        if (admin.getRole() != StudyMembership.Role.ADMIN) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        StudyMembership target = studyMembershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(
                targetUserId, studyId, StudyMembership.Status.PENDING)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_MEMBERSHIP_NOT_FOUND));

        StudyMembership.Role roleEnum;
        try {
            roleEnum = StudyMembership.Role.valueOf(newRole);
        } catch (IllegalArgumentException e) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        target.setStatus(StudyMembership.Status.APPROVED);
        target.setRole(roleEnum);
        studyMembershipRepository.save(target);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JoinRequestResponseDto> getPendingJoinRequests(int adminUserId, int studyId) {
        StudyMembership admin = studyMembershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(
                adminUserId, studyId, StudyMembership.Status.APPROVED)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_NOT_MEMBER));
        if (admin.getRole() != StudyMembership.Role.ADMIN) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        //PENDING 요청 조회
        return studyMembershipRepository
            .findAllByStudyGroup_IdAndStatus(studyId, StudyMembership.Status.PENDING)
            .stream()
            .map(m -> new JoinRequestResponseDto(
                m.getUserId(),
                m.getStatus().name()
            ))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<JoinStudyListResponseDto> getJoinedStudies(int userId) {
        return studyMembershipRepository
            .findAllByUserIdAndStatus(userId, StudyMembership.Status.APPROVED)
            .stream()
            .map(membership -> {
                StudyGroup group = membership.getStudyGroup();
                return JoinStudyListResponseDto.builder()
                    .name(group.getName())
                    .imageUrl(group.getImageUrl())
                    .studyId(group.getId())
                    .hashId(group.getHashId())
                    .build();
            })
            .collect(Collectors.toList());
    }
}
