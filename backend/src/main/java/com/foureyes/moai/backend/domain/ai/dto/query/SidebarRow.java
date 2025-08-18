package com.foureyes.moai.backend.domain.ai.dto.query;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SidebarRow {
    private int summaryId;
    private String title;
    private String description;
    private String modelType;
    private String promptType;
    private LocalDateTime createdAt;
    private int studyId;
    private String studyName;
    private String studyImg; // StudyGroup의 이미지 칼럼명에 맞춰주세요
}
