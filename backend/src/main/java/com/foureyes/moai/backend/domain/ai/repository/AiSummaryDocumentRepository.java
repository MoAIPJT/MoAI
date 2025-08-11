package com.foureyes.moai.backend.domain.ai.repository;

import com.foureyes.moai.backend.domain.ai.entity.AiSummaryDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiSummaryDocumentRepository extends JpaRepository<AiSummaryDocument, Integer> {
    boolean existsBySummary_IdAndDocument_Id(int summaryId, int documentId);
    long deleteBySummary_Id(int summaryId);
}
