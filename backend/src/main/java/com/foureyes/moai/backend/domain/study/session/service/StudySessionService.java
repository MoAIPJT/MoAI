// domain/study/session/service/StudySessionService.java
package com.foureyes.moai.backend.domain.study.session.service;

import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.study.entity.StudyMembership;
import com.foureyes.moai.backend.domain.study.repository.StudyGroupRepository;
import com.foureyes.moai.backend.domain.study.repository.StudyMembershipRepository;
import com.foureyes.moai.backend.domain.study.session.dto.request.OpenSessionRequest;
import com.foureyes.moai.backend.domain.study.session.dto.response.SessionResponse;
import com.foureyes.moai.backend.domain.study.session.entity.StudySession;
import com.foureyes.moai.backend.domain.study.session.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudySessionService {

    private final StudyGroupRepository studyGroupRepository;
    private final StudyMembershipRepository membershipRepository;
    private final StudySessionRepository sessionRepository;

    private final LiveKitAdminClient liveKitAdminClient;
    private final OpenViduAdminClient openViduAdminClient;

    /**
     * ADMIN/DELEGATE만 세션을 열 수 있음.
     * 이미 열린 세션이 있으면 그대로 반환(idempotent).
     * 플랫폼 미지정 시 LIVEKIT.
     */
    @Transactional
    public SessionResponse openOrGet(int studyId, int meUserId, OpenSessionRequest req) {

        // 1) 스터디 존재 확인
        StudyGroup group = studyGroupRepository.findById(studyId)
            .orElseThrow(() -> new IllegalArgumentException("StudyGroup not found: " + studyId));

        // 2) 권한 확인 (스터디 멤버 + ADMIN/DELEGATE)
        Optional<StudyMembership> membershipOpt =
            membershipRepository.findByStudyGroupIdAndUserId(studyId, meUserId); // TODO: 실제 메서드 시그니처에 맞춰 수정
        StudyMembership membership = membershipOpt
            .orElseThrow(() -> new SecurityException("스터디 구성원이 아닙니다."));

        // TODO: Role 이름/타입에 맞게 수정 (예: Role enum이 ADMIN/DELEGATE 라면 아래처럼)
        // 예시:
         Role role = membership.getRole();
         if (!(role == Role.ADMIN || role == Role.DELEGATE)) { ... }
        if (!(membership.getRole().isAdmin() || membership.getRole().isDelegate())) {
            throw new SecurityException("세션을 열 권한이 없습니다.");
        }

        // 3) 이미 열린 세션이 있으면 반환
        Optional<StudySession> openOpt = sessionRepository.findByStudyGroupAndClosedAtIsNull(group);
        if (openOpt.isPresent()) {
            StudySession s = openOpt.get();
            return SessionResponse.builder()
                .id(s.getId())
                .studyGroupId(studyId)
                .platform(s.getPlatform())
                .roomName(s.getRoomName())
                .created(false)
                .build();
        }

        // 4) 생성 시도 (동시성은 DB UNIQUE 제약으로 최종 보호)
        StudySession.Platform platform =
            (req == null) ? StudySession.Platform.LIVEKIT : req.platformOrDefault();
        String roomName = "study-" + studyId;

        switch (platform) {
            case LIVEKIT:
                // LiveKit은 첫 참가 시 자동 생성 가능. 필요하면 선생성 로직 구현.
                liveKitAdminClient.ensureRoom(roomName);
                break;
            case OPENVIDU:
                openViduAdminClient.createSessionIfAbsent(roomName);
                break;
        }

        StudySession entity = StudySession.builder()
            .studyGroup(group)
            .platform(platform)
            .roomName(roomName)
            .createdBy(meUserId)
            .createdAt(LocalDateTime.now())
            .build();

        try {
            StudySession saved = sessionRepository.save(entity);
            return SessionResponse.builder()
                .id(saved.getId())
                .studyGroupId(studyId)
                .platform(platform)
                .roomName(roomName)
                .created(true)
                .build();
        } catch (DataIntegrityViolationException race) {
            // 경쟁 생성으로 UNIQUE(uq_one_open_per_group) 충돌 → 방금 생긴 세션 재조회 후 반환
            Optional<StudySession> existingOpt = sessionRepository.findByStudyGroupAndClosedAtIsNull(group);
            StudySession existing = existingOpt.orElseThrow();
            return SessionResponse.builder()
                .id(existing.getId())
                .studyGroupId(studyId)
                .platform(existing.getPlatform())
                .roomName(existing.getRoomName())
                .created(false)
                .build();
        }
    }
}
