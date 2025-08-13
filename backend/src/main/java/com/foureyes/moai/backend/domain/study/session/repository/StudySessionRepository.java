// domain/study/session/repository/StudySessionRepository.java
package com.foureyes.moai.backend.domain.study.session.repository;

import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import com.foureyes.moai.backend.domain.study.session.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {

    Optional<StudySession> findByStudyGroupAndClosedAtIsNull(StudyGroup group);
}
