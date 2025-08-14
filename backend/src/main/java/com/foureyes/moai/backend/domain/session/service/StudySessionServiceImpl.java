// domain/study/session/service/StudySessionService.java
package com.foureyes.moai.backend.domain.session.service;

import com.foureyes.moai.backend.commons.exception.CustomException;
import com.foureyes.moai.backend.commons.exception.ErrorCode;
import com.foureyes.moai.backend.domain.session.dto.response.JoinSessionResponseDto;
import com.foureyes.moai.backend.domain.session.dto.response.SessionResponseDto;
import com.foureyes.moai.backend.domain.session.repository.StudySessionRepository;
import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.study.entity.StudyMembership;
import com.foureyes.moai.backend.domain.study.repository.StudyGroupRepository;
import com.foureyes.moai.backend.domain.study.repository.StudyMembershipRepository;
import com.foureyes.moai.backend.domain.session.entity.StudySession;
import com.foureyes.moai.backend.domain.user.entity.User;
import com.foureyes.moai.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.foureyes.moai.backend.domain.study.entity.StudyMembership.Role.ADMIN;
import static com.foureyes.moai.backend.domain.study.entity.StudyMembership.Role.DELEGATE;

@Service
@RequiredArgsConstructor
public class StudySessionServiceImpl implements StudySessionService{

    private final StudyGroupRepository studyGroupRepository;
    private final StudyMembershipRepository membershipRepository;
    private final StudySessionRepository sessionRepository;
    private final UserRepository userRepository;

    private final LiveKitAdminClient liveKitAdminClient;
    private final LiveKitTokenGenerator tokenGenerator;

    @Override
    @Transactional
    public SessionResponseDto openOrGetByHashId(String studyHashId, int meUserId) {

        // 1) 스터디 존재 확인
        StudyGroup group = studyGroupRepository.findByHashId(studyHashId)
                .orElseThrow(() -> new CustomException(ErrorCode.STUDY_GROUP_NOT_FOUND));

        int studyId = group.getId();

        // 2) 멤버십 + 승인 상태 확인 (APPROVED만 통과)
        StudyMembership membership = membershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(meUserId, studyId, StudyMembership.Status.APPROVED)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_NOT_MEMBER));

        StudyMembership.Role role = membership.getRole();
         if (!(role == ADMIN || role == DELEGATE)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        // 3) 이미 열린 세션이 있으면 반환
        Optional<StudySession> openOpt = sessionRepository.findByStudyGroupAndClosedAtIsNull(group);
        if (openOpt.isPresent()) {
            StudySession s = openOpt.get();
            return SessionResponseDto.builder()
                .id(s.getId())
                .studyGroupId(studyId)
                .studyGroupHashId(studyHashId)
                .roomName(s.getRoomName())
                .created(false)
                .build();
        }

        // 4) 생성 시도 (동시성은 DB UNIQUE 제약으로 최종 보호)
        String roomName = "study-" + studyHashId;

        liveKitAdminClient.ensureRoom(roomName);

        StudySession entity = StudySession.builder()
            .studyGroup(group)
            .roomName(roomName)
            .createdBy(meUserId)
            .createdAt(LocalDateTime.now())
            .build();

        try {
            StudySession saved = sessionRepository.save(entity);
            return SessionResponseDto.builder()
                .id(saved.getId())
                .studyGroupId(studyId)
                .studyGroupHashId(studyHashId)
                .roomName(roomName)
                .created(true)
                .build();
        } catch (DataIntegrityViolationException race) {
            // 경쟁 생성으로 UNIQUE(uq_one_open_per_group) 충돌 → 방금 생긴 세션 재조회 후 반환
            Optional<StudySession> existingOpt = sessionRepository.findByStudyGroupAndClosedAtIsNull(group);
            StudySession existing = existingOpt.orElseThrow(() -> new CustomException(ErrorCode.DATABASE_ERROR));
            return SessionResponseDto.builder()
                .id(existing.getId())
                .studyGroupId(studyId)
                .studyGroupHashId(studyHashId)
                .roomName(existing.getRoomName())
                .created(false)
                .build();
        }
    }

    private String resolveDisplayName(int userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND)); // 404 매핑

        String candidate = user.getName(); // DB의 사용자 이름

        // 공통 정제: null/공백/제어문자 제거 + 길이 제한(예: 32자)
        if (candidate == null) candidate = "";
        candidate = candidate.replaceAll("\\p{Cntrl}", "").trim();
        if (candidate.isBlank()) {
            candidate = Integer.toString(userId); // 최종 fallback
        }
        if (candidate.length() > 32) {
            candidate = candidate.substring(0, 32);
        }
        return candidate;
    }

    /** 참가(토큰 발급): 세션이 없으면 관리자/대리자일 때만 자동 오픈, 아니면 403 */
    @Transactional
    public JoinSessionResponseDto joinByHashId(String studyHashId, int meUserId) {
        StudyGroup group = studyGroupRepository.findByHashId(studyHashId)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_GROUP_NOT_FOUND));
        int studyId = group.getId();

        StudyMembership membership = membershipRepository
            .findByUserIdAndStudyGroup_IdAndStatus(meUserId, studyId, StudyMembership.Status.APPROVED)
            .orElseThrow(() -> new CustomException(ErrorCode.STUDY_NOT_MEMBER));

        String roomName;
        Optional<StudySession> openOpt = sessionRepository.findByStudyGroupAndClosedAtIsNull(group);
        if (openOpt.isPresent()) {
            roomName = openOpt.get().getRoomName();
        } else {
            boolean canOpen = (membership.getRole() == StudyMembership.Role.ADMIN)
                || (membership.getRole() == StudyMembership.Role.DELEGATE);
            if (!canOpen) {
                throw new CustomException(ErrorCode.FORBIDDEN);
            }
            // 열고 나서 DTO에서 roomName만 가져와 사용
            SessionResponseDto opened = openOrGetByHashId(studyHashId, meUserId);
            roomName = opened.getRoomName();
        }

        String displayName = resolveDisplayName(meUserId);

        String token = tokenGenerator.createJoinToken(roomName, meUserId, displayName);
        return JoinSessionResponseDto.builder()
            .roomName(roomName)
            .wsUrl(tokenGenerator.getWsUrl())
            .displayName(displayName)
            .token(token)
            .build();
    }
}
