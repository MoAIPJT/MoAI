package com.foureyes.moai.backend.domain.document.repository;


import com.foureyes.moai.backend.domain.document.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    // 특정 스터디의 모든 카테고리 조회
    List<Category> findByStudyGroup_Id(int studyGroupId);

    // 특정 스터디 내 이름 중복 체크
    boolean existsByStudyGroup_IdAndName(int studyGroupId, String name);

    // 스터디 + 카테고리 ID로 조회
    Optional<Category> findByIdAndStudyGroup_Id(int id, int studyGroupId);

}
