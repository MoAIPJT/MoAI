package com.foureyes.moai.backend.domain.document.repository;

import com.foureyes.moai.backend.domain.document.dto.response.DocumentRow;
import com.foureyes.moai.backend.domain.document.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Integer> {

    // 특정 스터디의 문서 목록
    List<Document> findByStudyGroup_Id(int studyGroupId);

    // 특정 업로더의 문서 목록
    List<Document> findByUploader_Id(int uploaderId);

    // 스터디 + 문서 ID로 조회
    boolean existsByIdAndStudyGroup_Id(int id, int studyGroupId);

    @Query("""
        select new com.foureyes.moai.backend.domain.document.dto.response.DocumentRow(
            d.id, d.title, d.description, u.profileImageUrl, u.name, d.updatedAt, d.createdAt
        )
        from Document d
        join d.uploader u
        where d.studyGroup.id = :studyId
        order by case when d.updatedAt is null then 1 else 0 end,
                 d.updatedAt desc, d.createdAt desc
    """)
    List<DocumentRow> findListByStudyId(@Param("studyId") int studyId);
}
