package com.foureyes.moai.backend.domain.document.repository;

import com.foureyes.moai.backend.domain.document.entity.DocumentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentCategoryRepository extends JpaRepository<DocumentCategory, Integer> {

    // 문서에 연결된 모든 카테고리
    List<DocumentCategory> findByDocument_Id(int documentId);

    // 카테고리에 연결된 모든 문서
    List<DocumentCategory> findByCategory_Id(int categoryId);

    // 중복 매핑 존재 여부 체크
    boolean existsByDocument_IdAndCategory_Id(int documentId, int categoryId);

    // 문서 + 카테고리 삭제
    void deleteByDocument_IdAndCategory_Id(int documentId, int categoryId);


    void deleteByDocument_Id(int documentId);


    @Query("""
        select dc.document.id, c.name
        from DocumentCategory dc
        join dc.category c
        where dc.document.id in :docIds
    """)
    List<Object[]> findNamesByDocumentIds(@Param("docIds") List<Integer> docIds);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    long deleteByCategory_Id(int categoryId);
}
