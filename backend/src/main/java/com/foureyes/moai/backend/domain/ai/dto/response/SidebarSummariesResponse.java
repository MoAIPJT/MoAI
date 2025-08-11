package com.foureyes.moai.backend.domain.ai.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "SidebarSummariesResponse")
public class SidebarSummariesResponse {
    private List<StudyBlock> studies;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudyBlock {
        private int studyId;
        private String name;
        private String studyImg;
        private List<SummaryItem> summaries;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SummaryItem {
        private int summaryId;
        private String title;
        private String description;
        private String modelType;
        private String promptType;
        private LocalDateTime createdAt;
    }
}
