package com.foureyes.moai.backend.domain.ai.repository;

import com.foureyes.moai.backend.domain.ai.entity.Summary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SummaryRepository extends JpaRepository<Summary, Long> {
}
