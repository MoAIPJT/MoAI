package com.foureyes.moai.backend.domain.ai.repository;

import com.foureyes.moai.backend.domain.ai.entity.AiSummary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AiSummaryRepository extends JpaRepository<AiSummary, Integer> {
    List<AiSummary> findByOwner_IdOrderByCreatedAtDesc(int ownerId);
    Optional<AiSummary> findByIdAndOwner_Id(int id, int ownerId);

}
