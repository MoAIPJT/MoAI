package com.foureyes.moai.backend.domain.study.repository;

import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.study.entity.StudyMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudyMembershipRepository extends JpaRepository<StudyMembership, Integer> {
    boolean existsByUserIdAndStudyGroup(int userId, StudyGroup studyGroup);
    boolean existsByUserIdAndStudyGroup_Id(int userId, int studyGroupId);

    //유저가 스터디 그룹의 속속인가, 승인상태인가
    boolean existsByUserIdAndStudyGroup_IdAndStatus(
        int userId, int studyGroupId, StudyMembership.Status status);

    // 해당 스터디에 APPROVED 상태인 멤버 전부 조회
    List<StudyMembership> findAllByStudyGroup_IdAndStatus(
        int studyGroupId,
        StudyMembership.Status status
    );

    //특정 유저에 대한 멤버십 전부를 조회
    List<StudyMembership> findAllByUserIdAndStatusIn(
        int userId,
        List<StudyMembership.Status> statuses
    );

    Optional<StudyMembership> findByUserIdAndStudyGroup_IdAndStatus(
        int userId, int studyGroupId, StudyMembership.Status status);


}
