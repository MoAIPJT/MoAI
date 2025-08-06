package com.foureyes.moai.backend.domain.study.repository;

import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.study.entity.StudyMembership;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyMembershipRepository extends JpaRepository<StudyMembership, Integer> {
    boolean existsByUserIdAndStudyGroup(int userId, StudyGroup studyGroup);
    boolean existsByUserIdAndStudyGroup_Id(int userId, Long studyGroupId);
}
