package com.foureyes.moai.backend.domain.study.repository;

import com.foureyes.moai.backend.domain.study.entity.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Integer> {
    Optional<StudyGroup> findByHashId(String hashId);
}
