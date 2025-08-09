package com.foureyes.moai.backend.domain.document.repository;

import com.foureyes.moai.backend.domain.document.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Integer> {

    // 특정 스터디의 문서 목록
    List<Document> findByStudyGroup_Id(int studyGroupId);

    // 특정 업로더의 문서 목록
    List<Document> findByUploader_Id(int uploaderId);

    // 스터디 + 문서 ID로 조회
    boolean existsByIdAndStudyGroup_Id(int id, int studyGroupId);
}
