package com.foureyes.moai.backend.domain.session.repository;

import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.session.entity.StudySession;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StudySessionRepository extends JpaRepository<StudySession, Integer> {

    Optional<StudySession> findByStudyGroupAndClosedAtIsNull(StudyGroup group);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from StudySession s where s.studyGroup = :group and s.closedAt is null")
    Optional<StudySession> findOpenForUpdate(@Param("group") StudyGroup group);
}
